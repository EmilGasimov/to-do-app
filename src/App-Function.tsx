import React, { useEffect, useState } from "react";
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

interface AppState {
  todos: Todo[];
  filter: FilterType;
  nextId: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    JSON.parse(localStorage.getItem("todos") ?? "[]")
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [nextId, setNextId] = useState<number>(() => {
    const saved: Todo[] = JSON.parse(localStorage.getItem("todos") ?? "[]");
    return saved.length ? Math.max(...saved.map((t) => t.id)) + 1 : 1;
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: nextId, text: text.trim(), completed: false };
    setTodos([...todos, newTodo]);
    setNextId((prev) => prev + 1);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const editTodo = (id: number, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText.trim() } : t))
    );
  };

  const clearCompleted = () => {
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
