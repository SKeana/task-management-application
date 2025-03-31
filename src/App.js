// App.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import axios from 'axios'; // Import axios
import './App.css';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port if needed

function App() {
  // Start with empty tasks, they will be fetched
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  // Optional: Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // --- Fetch Initial Tasks ---
  useEffect(() => {
    // Define the async function to fetch tasks
    const fetchTasks = async () => {
      setIsLoading(true); // Set loading state
      setError(null); // Clear previous errors
      try {
        // Make GET request to backend endpoint using axios
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        setTasks(response.data); // Update state with data from backend response
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later."); // Set error state
      } finally {
        setIsLoading(false); // Set loading state back to false
      }
    };

    fetchTasks(); // Call the function to fetch tasks when component mounts

    // Dependency array is empty [], so this effect runs only ONCE on mount
  }, []);

  // --- Handlers (will be modified next) ---
  const handleSubmit = (e) => { /* ... */ };
  const handleDragStart = (e, taskId) => { /* ... */ };
  const handleDragEnd = (e) => { /* ... */ };
  const handleDragOver = (e) => { /* ... */ };
  const handleDragLeave = (e) => { /* ... */ };
  const handleDrop = (e, targetStatus) => { /* ... */ };

  // --- Filtering Tasks (remains the same) ---
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
        {/* Add Task Form (remains the same for now) */}
        <form onSubmit={handleSubmit} className="add-task-form">
           {/* ... input and button ... */}
        </form>

        {/* Display Loading or Error Message */}
        {isLoading && <p style={{ textAlign: 'center' }}>Loading tasks...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {/* Columns Container - Render only if not loading and no error */}
        {!isLoading && !error && (
          <div className="columns-container">
            {/* To Do Column */}
            <div className='column columns-to-do' id='todo' /* ... DnD handlers ... */ >
              <h2>To Do</h2>
              {/* Use task._id for key now (from MongoDB) */}
              {todoTasks.map(task => (
                <div
                  key={task._id}
                  id={task._id} // Use _id from MongoDB
                  className="task-card"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task._id)} // Pass _id
                  onDragEnd={handleDragEnd}
                >
                  {task.title}
                </div>
              ))}
              {/* ... empty placeholder ... */}
            </div>

            {/* In Progress Column (similar changes for key/id) */}
            <div className='column columns-in-progress' id='in-progress' /* ... */ >
              <h2>In Progress</h2>
              {inProgressTasks.map(task => (
                <div key={task._id} id={task._id} /* ... */ >{task.title}</div>
              ))}
              {/* ... */}
            </div>

            {/* Done Column (similar changes for key/id) */}
            <div className='column columns-done' id='done' /* ... */ >
              <h2>Done</h2>
              {doneTasks.map(task => (
                <div key={task._id} id={task._id} /* ... */ >{task.title}</div>
              ))}
              {/* ... */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
