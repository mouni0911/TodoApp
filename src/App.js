import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [editableTodo, setEditableTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === "") {
      setError("Please provide Todo text");
      return;
    }
    const newTask = {
      id: todos.length + 1,
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, newTask]);
    setNewTodo("");
    setError("");
  };

  const toggleCompleted = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const editTodo = (id, newTitle) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleEditStart = (id, title) => {
    setEditableTodo(id);
    setEditedTitle(title);
  };

  const handleEditEnd = () => {
    if (editedTitle.trim() !== "") {
      editTodo(editableTodo, editedTitle);
    }
    setEditableTodo(null);
    setEditedTitle("");
  };

  const filterTodos = showCompleted
    ? todos.filter((todo) => todo.completed)
    : todos;

  return (
    <div className="app-container">
      <h1>Todo List App</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new task"
        />
        <button
          onClick={addTodo}
          style={{
            backgroundColor: "#dd0909",
            color: "white",
            padding: "15px 18px",
          }}
        >
          Add
        </button>
      </div>
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
      <div>
        <label>
          Show Completed
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
        </label>
      </div>
      <ul className="todo-list">
        {filterTodos.map((todo) => (
          <li key={todo.id}>
            {editableTodo === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button onClick={handleEditEnd}>Save</button>
              </>
            ) : (
              <>
                <span
                  className={todo.completed ? "completed" : ""}
                  onClick={() => toggleCompleted(todo.id)}
                >
                  {todo.title}
                </span>
                <button
                  className="edit-button"
                  onClick={() => handleEditStart(todo.id, todo.title)}
                >
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
