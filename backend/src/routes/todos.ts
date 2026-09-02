import { Router } from "express";
import Todo from "../models/Todo.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth); // every route below requires a valid session cookie

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Failed to get todos" });
  }
});

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags:
 *       - Todos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodo'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid todo
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      res.status(400).json({ message: "Task cannot be empty" });
      return;
    }

    if (text.length > 100) {
      res.status(400).json({ message: "Max 100 characters" });
      return;
    }

    const duplicate = await Todo.findOne({
      userId: req.userId,
      text: { $regex: `^${escapeRegex(text)}$`, $options: "i" },
    });

    if (duplicate) {
      res.status(409).json({ message: "You already have a task with this name" });
      return;
    }

    const todo = await Todo.create({
      text,
      completed: false,
      userId: req.userId,
    });

    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

/**
 * @openapi
 * /api/todos/{id}:
 *   patch:
 *     summary: Update a todo
 *     tags:
 *       - Todos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Todo ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodo'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", async (req, res) => {
  try {
    const updates: {
      text?: string;
      completed?: boolean;
    } = {};

    if (req.body.text !== undefined) {
      const text = req.body.text.trim();

      if (!text) {
        res.status(400).json({ message: "Task cannot be empty" });
        return;
      }

      if (text.length > 100) {
        res.status(400).json({ message: "Max 100 characters" });
        return;
      }

      const duplicate = await Todo.findOne({
        userId: req.userId,
        _id: { $ne: req.params.id },
        text: { $regex: `^${escapeRegex(text)}$`, $options: "i" },
      });

      if (duplicate) {
        res.status(409).json({ message: "You already have a task with this name" });
        return;
      }

      updates.text = text;
    }

    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json(todo);
  } catch {
    res.status(500).json({ message: "Failed to update todo" });
  }
});

/**
 * @openapi
 * /api/todos/completed:
 *   delete:
 *     summary: Delete all completed todos for the logged-in user
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: Completed todos deleted
 *       500:
 *         description: Server error
 */
router.delete("/completed", async (req, res) => {
  try {
    const result = await Todo.deleteMany({
      userId: req.userId,
      completed: true,
    });

    res.json({
      deletedCount: result.deletedCount,
    });
  } catch {
    res.status(500).json({
      message: "Failed to clear completed todos",
    });
  }
});

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags:
 *       - Todos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Todo ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

export default router;
