import { useEffect, useState } from "react";
import AddTodo from "./function-components/AddTodo";
import TodoList from "./function-components/TodoList";
import TodoFilter from "./function-components/TodoFilter";
import { Todo, FilterType } from "./types";
import "./App.css";

// TASK: Rewrite this class component as a functional component using hooks:
// - Replace state with useState (3 pieces: todos, filter, nextId)
// - Replace componentDidMount / componentDidUpdate with useEffect for localStorage sync
// - Replace class methods with regular const functions
// - Remove render(), return JSX directly

const API_URL = "http://localhost:5001/api/todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load todos");
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (text: string) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    const newTodo = await response.json();

    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t._id === id);

    if (!todo) return;

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      }
    );

    const updated = await response.json();

    setTodos((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const editTodo = async (id: string, text: string) => {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const updated = await response.json();

    setTodos((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
  };

  const clearCompleted = async () => {
    await fetch(`${API_URL}/completed`, {
      method: "DELETE",
    });

    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const getFilteredTodos = (): Todo[] => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">todos</h1>
      </header>

      <main className="app__main">
        <AddTodo onAdd={addTodo} />

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {todos.length > 0 && (
          <footer className="app__footer">
            <span className="app__count">
              {activeCount} item{activeCount !== 1 ? "s" : ""} left
            </span>
            <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
            <button
              className="app__clear-btn"
              onClick={clearCompleted}
              disabled={activeCount === todos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
