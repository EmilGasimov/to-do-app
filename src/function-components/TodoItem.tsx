import React, { useEffect, useRef, useState } from "react";
import { Todo } from "../types";

// TASK: Rewrite this class component as a functional component using hooks:
// - state: { isEditing, editValue } → useState
// - handleDoubleClick, handleEditChange, handleEditSubmit, handleKeyDown become const functions
// - Remove render(), return JSX directly
// - Bonus: use useRef on the edit input and call .focus() inside useEffect when isEditing turns true

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

function TodoItem(props: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(props.todo.text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      props.onEdit(props.todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleEditSubmit();
    if (e.key === "Escape") setIsEditing(false);
  };

  const handleToggle = () => {
    props.onToggle(props.todo.id);
  };

  const handleDelete = () => {
    props.onDelete(props.todo.id);
  };

  return (
    <li
      className={`todo-item${
        props.todo.completed ? " todo-item--completed" : ""
      }`}
    >
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={props.todo.completed}
        onChange={handleToggle}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          className="todo-item__edit-input"
          type="text"
          value={editValue}
          onChange={handleEditChange}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="todo-item__text"
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {props.todo.text}
        </span>
      )}

      <button className="todo-item__delete-btn" onClick={handleDelete}>
        ✕
      </button>
    </li>
  );
}

export default TodoItem;
