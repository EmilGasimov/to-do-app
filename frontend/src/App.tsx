import React, { useEffect, useState } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import TodoFilter from "./components/TodoFilter";
import { Todo, FilterType } from "./types";
import "./App.css";

const API_URL = "http://localhost:5001/api/todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load todos");
        }

        const data: Todo[] = await response.json();

        setTodos(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (text: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const newTodo: Todo = await response.json();

      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error(err);
      setError("Could not add the task.");
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t._id === id);

    if (!todo) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo: Todo = await response.json();

      setTodos((prev) =>
        prev.map((t) => (t._id === id ? updatedTodo : t))
      );
    } catch (err) {
      console.error(err);
      setError("Could not update the task.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not delete the task.");
    }
  };

  const editTodo = async (id: string, newText: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit todo");
      }

      const updatedTodo: Todo = await response.json();

      setTodos((prev) =>
        prev.map((t) => (t._id === id ? updatedTodo : t))
      );
    } catch (err) {
      console.error(err);
      setError("Could not edit the task.");
    }
  };

  const clearCompleted = async () => {
    try {
      const response = await fetch(`${API_URL}/completed`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear completed todos");
      }

      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      console.error(err);
      setError("Could not clear completed tasks.");
    }
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

  if (loading) {
    return (
      <div className="app">
        <main className="app__main">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">todos</h1>
      </header>

      <main className="app__main">
        {error && (
          <div className="app__error">
            {error}
          </div>
        )}

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

            <TodoFilter
              currentFilter={filter}
              onFilterChange={setFilter}
            />

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