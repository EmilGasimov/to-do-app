import { useEffect, useState } from "react";
import AddTodo from "./function-components/AddTodo";
import TodoList from "./function-components/TodoList";
import TodoFilter from "./function-components/TodoFilter";
import { Todo, FilterType } from "./types";
import "./App.css";
import { useAuth } from "./context/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/todos`;
const PAGE_SIZE = 8;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [_, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await fetch(API_URL, { credentials: "include" });

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
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to create todo");
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
        credentials: "include",
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
      credentials: "include",
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
        credentials: "include",
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to update todo");
    }

    const updated = await response.json();

    setTodos((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
  };

  const clearCompleted = async () => {
    await fetch(`${API_URL}/completed`, {
      method: "DELETE",
      credentials: "include",
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

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">todos</h1>
        <div className="app__user-bar">
          <span className="app__user-name">{user?.name}</span>
          <button className="app__logout-btn" onClick={logout}>Log out</button>
        </div>
      </header>

      <main className="app__main">
        <AddTodo onAdd={addTodo} />

        <TodoList
          todos={paginatedTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {totalPages > 1 && (
          <div className="app__pagination">
            <button
              className="app__page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="app__page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="app__page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {todos.length > 0 && (
          <footer className="app__footer">
            <span className="app__count">
              {activeCount} item{activeCount !== 1 ? "s" : ""} left
            </span>
            <TodoFilter currentFilter={filter} onFilterChange={handleFilterChange} />
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
