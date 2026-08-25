import React, { useState } from "react";

const MAX_LENGTH = 100;

// TASK: Rewrite this class component as a functional component using hooks:
// - state: { value, error } → two useState calls (or one with an object)
// - handleChange and handleSubmit become regular const functions
// - Remove render(), return JSX directly
// - Note: error should reset when the user starts typing again

interface AddTodoProps {
  onAdd: (text: string) => void;
}

function AddTodo(props: AddTodoProps) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Task cannot be empty.");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Max ${MAX_LENGTH} characters.`);
      return;
    }

    props.onAdd(trimmed);
    setValue("");
    setError(null);
  };

  const remaining = MAX_LENGTH - value.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="add-todo-wrapper">
      <form className="add-todo" onSubmit={handleSubmit}>
        <input
          className={`add-todo__input${error ? " add-todo__input--error" : ""}`}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button className="add-todo__btn" type="submit">
          Add
        </button>
      </form>

      <div className="add-todo__meta">
        {error ? (
          <span className="add-todo__error">{error}</span>
        ) : (
          <span
            className={`add-todo__counter${
              isOverLimit ? " add-todo__counter--over" : ""
            }`}
          >
            {remaining} chars left
          </span>
        )}
      </div>
    </div>
  );
}

export default AddTodo;
