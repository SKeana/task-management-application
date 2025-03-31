// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to run: npm install axios
import './App.css';

// Define the base URL for your backend API
// Make sure your backend server is running on this address/port
const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  // State for tasks, new task input, loading, errors, and submitting status
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Initial Tasks Hook ---
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        setTasks(response.data); // Update state with tasks from backend
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Is the backend server running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks(); // Fetch tasks when component mounts
  }, []); // Empty dependency array means run once on mount

  // --- Handle Form Submission (Add Task) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle === "") {
      alert("Please enter a task title.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Send POST request to backend
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        title: trimmedTitle
      });
      const newlyCreatedTask = response.data; // Get task created by backend
      // Add the new task (from backend response) to frontend state
      setTasks(prevTasks => [...prevTasks, newlyCreatedTask]);
      setNewTaskTitle(""); // Clear input
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.response?.data?.message || "Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, taskId) => {
    console.log("Drag Start:", taskId);
    e.dataTransfer.setData("text/plain", taskId.toString()); // Store MongoDB _id (string)
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.6'; }, 0);
  };

  const handleDragEnd = (e) => {
    console.log("Drag End");
    if (e.target) e.target.style.opacity = '1';
    // Clean up column highlight class
    document.querySelectorAll('.column-drag-over').forEach(el => {
        el.classList.remove('column-drag-over');
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.currentTarget.classList.add('column-drag-over'); // Add highlight
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('column-drag-over'); // Remove highlight
  };

  // Handle Drop (Update Task Status)
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain"); // Get the _id string
    console.log(`Dropped Task ID: ${taskId} onto Column: ${targetStatus}`);
    e.currentTarget.classList.remove('column-drag-over');

    // Find task in current state to check if status needs changing
    const taskToMove = tasks.find(task => task._id === taskId);
    if (!taskToMove || taskToMove.status === targetStatus) {
      console.log("Drop resulted in no status change.");
      return; // No change needed
    }

    setError(null); // Clear previous errors

    try {
      // Send PATCH request to backend
      const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, {
        status: targetStatus // Send new status in body
      });
      const updatedTaskFromServer = response.data; // Get updated task from backend

      // Update frontend state with the updated task from backend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTaskFromServer : task
        )
      );
      console.log(`Task ${taskId} status updated successfully.`);

    } catch (err) {
      console.error(`Error updating task ${taskId} status:`, err);
      setError(err.response?.data?.message || `Failed to update task status.`);
      // Task will visually remain in original column due to lack of optimistic update
    }
  };

  // --- Filtering Tasks for Rendering ---
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // --- Rendering ---
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management Board</h1>
      </header>
      <main className="app-main">
        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="add-task-form">
          <input
            type='text'
            placeholder='Enter new task title'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            aria-label="New task title"
            disabled={isSubmitting}
          />
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {/* Display Loading or Error Messages */}
        {isLoading && <p style={{ textAlign: 'center' }}>Loading tasks...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

        {/* Columns Container - Render only if not loading */}
        {!isLoading && (
          <div className="columns-container">
            {/* To Do Column */}
            <div
              className='column columns-to-do'
              id='todo'
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'todo')}
            >
              <h2>To Do</h2>
              {todoTasks.map(task => (
                <div
                  key={task._id} // Use MongoDB _id
                  id={task._id}   // Use MongoDB _id
                  className="task-card"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task._id)} // Pass _id
                  onDragEnd={handleDragEnd}
                >
                  {task.title}
                </div>
              ))}
              {todoTasks.length === 0 && !isLoading && <div className="empty-column-placeholder">Drop tasks here</div>}
            </div>

            {/* In Progress Column */}
            <div
              className='column columns-in-progress'
              id='in-progress'
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'in-progress')}
            >
              <h2>In Progress</h2>
              {inProgressTasks.map(task => (
                <div
                  key={task._id}
                  id={task._id}
                  className="task-card"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                >
                  {task.title}
                </div>
              ))}
              {inProgressTasks.length === 0 && !isLoading && <div className="empty-column-placeholder">Drop tasks here</div>}
            </div>

            {/* Done Column */}
            <div
              className='column columns-done'
              id='done'
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'done')}
            >
              <h2>Done</h2>
              {doneTasks.map(task => (
                <div
                  key={task._id}
                  id={task._id}
                  className="task-card"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                >
                  {task.title}
                </div>
              ))}
              {doneTasks.length === 0 && !isLoading && <div className="empty-column-placeholder">Drop tasks here</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
