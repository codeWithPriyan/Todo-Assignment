// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch all todos
export const fetchTodos = async () => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

// Add a new todo
export const addTodo = async (todo) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error('Failed to add todo');
  return response.json();
};

// Delete a todo
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete todo');
  return true;
};

// Update a todo
export const updateTodo = async (id, todo) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

// Generate summary and send to Slack
export const summarizeTodos = async () => {
  const response = await fetch(`${API_URL}/summarize`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to summarize todos');
  return response.json();
};
