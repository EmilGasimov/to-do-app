import { Router } from "express";
import Todo from "../models/Todo.js";

const router = Router();

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: Get all todos
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
router.get("/", async (_req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Failed to get todos" });
  }
});


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

    const todo = await Todo.create({
      text,
      completed: false,
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
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

      updates.text = text;
    }

    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
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
 *     summary: Delete all completed todos
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: Completed todos deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Server error
 */
router.delete("/completed", async (_req, res) => {
  try {
    const result = await Todo.deleteMany({
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
    const todo = await Todo.findByIdAndDelete(req.params.id);

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