import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState({
    todos: false,
    add: false,
    edit: false,
    delete: false,
    toggle: false,
    summarize: false,
  });
  const [summary_data, setsummarydata] = useState(null);

  const API_URL = "https://sirkakaam.onrender.com";

  const fetchTodos = async () => {
    setIsLoading((prev) => ({ ...prev, todos: true }));
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error("Fetch todos error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, todos: false }));
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.warning("Todo text cannot be empty");
      return;
    }

    setIsLoading((prev) => ({ ...prev, add: true }));
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo, status: "pending" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.statusText}`);
      }

      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo("");
      toast.success("Todo added successfully!");
    } catch (error) {
      console.error("Add todo error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.statusText}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Delete todo error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };
  const todocomplet = async (id) => {
    toast.success("good you have to done this task");

    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      const response = await fetch(`${API_URL}/completethistask/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.statusText}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Delete todo error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditTodo = async (id) => {
    if (!editText.trim()) {
      toast.warning("Todo text cannot be empty");
      return;
    }

    setIsLoading((prev) => ({ ...prev, edit: true }));
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });

      if (!response.ok) {
        // console.log("afn");
        throw new Error(`Failed to update todo: ${response.statusText}`);
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Update todo error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  const toggleComplete = async (id) => {
    setIsLoading((prev) => ({ ...prev, toggle: true }));
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo status: ${response.statusText}`);
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Toggle complete error:", error);
      // toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, toggle: false }));
    }
  };

  const handleSummarize = async () => {
    if (todos.length === 0) {
      toast.warning("No todos to summarize");
      return;
    }
    console.log("sriorn");
    setIsLoading((prev) => ({ ...prev, summarize: true }));
    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos }),
      });
      console.log("wrnoi");
      if (!response.ok) {
        throw new Error(`Failed to generate summary: ${response.statusText}`);
      }
      console.log(response);
      const result = await response.json();
      console.log(result);
      setsummarydata(result.summary);
      toast.success(result.message || "Summary sent to Slack successfully!");
    } catch (error) {
      console.error("Summarize error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const isAnyLoading = Object.values(isLoading).some(Boolean);

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header>
        <h1>Todo Summary Assistant</h1>
      </header>

      <main>
        <section className="todo-form">
          <h2>Add New Todo</h2>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a new todo..."
              required
              disabled={isLoading.add || isAnyLoading}
            />
            <button type="submit" disabled={isLoading.add || isAnyLoading}>
              {isLoading.add ? "Adding..." : "Add Todo"}
            </button>
          </form>
        </section>

        <section className="todo-list">
          <h2>Your Todos</h2>
          {isLoading.todos && todos.length === 0 ? (
            <p className="loading-message">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="empty-message">No todos yet. Add one above!</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => handleEditTodo(todo.id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleEditTodo(todo.id)
                      }
                      autoFocus
                      disabled={isLoading.edit}
                    />
                  ) : (
                    <>
                      <span
                        className="todo-text"
                        onClick={() => !isAnyLoading && toggleComplete(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <div className="actions">
                        <button
                          onClick={() => startEditing(todo)}
                          disabled={isAnyLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          disabled={isAnyLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="summary-section">
          <button
            onClick={handleSummarize}
            className="summary-button"
            disabled={isLoading.summarize || todos.length === 0 || isAnyLoading}
          >
            {isLoading.summarize
              ? "Processing..."
              : "Generate and Send Summary to Slack"}
          </button>
        </section>
        <div >
          {summary_data}
        </div>
      </main>
    </div>
  );
}

export default App;
