import React, { useState } from 'react'; // Removed useEffect, useRef as not needed for this basic version
import './App.css'; // Make sure you have this CSS file with basic styling

function App() {
  // --- State ---
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design homepage", status: "todo" },
    { id: 2, title: "Set up database", status: "in-progress" },
    { id: 3, title: "Write API endpoints", status: "in-progress" },
    { id: 4, title: "Write tests", status: "done" }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  // --- Event Handlers ---

  // Handle form submission to add a new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === "") return; // Prevent adding empty tasks

    const newTask = {
      // Use a more robust ID generation in a real app (e.g., UUID)
      id: Date.now(), // Simple unique ID for this example
      title: newTaskTitle,
      status: 'todo' // New tasks start in 'todo'
    };

    setTasks(prevTasks => [...prevTasks, newTask]); // Add new task immutably
    setNewTaskTitle(""); // Clear the input field
  };

  // Called when dragging of a task card starts
  const handleDragStart = (e, taskId) => {
    console.log("Drag Start:", taskId);
    e.dataTransfer.setData("text/plain", taskId.toString()); // Store the task ID being dragged
    // Optional: Slightly reduce opacity while dragging
    // Use setTimeout to ensure the style change doesn't interfere with the drag image
    setTimeout(() => {
      if (e.target) {
        e.target.style.opacity = '0.6';
      }
    }, 0);
  };

  // Called when dragging ends (whether successful drop or not)
  const handleDragEnd = (e) => {
    console.log("Drag End");
    // Reset opacity after dragging finishes
    if (e.target) {
      e.target.style.opacity = '1';
    }
  };

  // Called frequently as an item is dragged *over* a potential drop zone (a column)
  const handleDragOver = (e) => {
    e.preventDefault(); // MUST prevent default to allow dropping
    // Optional: Add visual feedback to the drop zone (e.g., border highlight)
    // e.currentTarget.style.backgroundColor = '#e0e0e0'; // Example highlight
  };

  // Optional: Called when a dragged item leaves a potential drop zone
  const handleDragLeave = (e) => {
    // Optional: Remove visual feedback from the drop zone
    // e.currentTarget.style.backgroundColor = ''; // Remove highlight
  };

  // Called when a dragged item is dropped onto a valid drop zone (a column)
  const handleDrop = (e, targetStatus) => {
    e.preventDefault(); // Prevent default browser drop behavior
    console.log("Dropped onto:", targetStatus);
    // Optional: Remove visual feedback from the drop zone
    // e.currentTarget.style.backgroundColor = ''; // Remove highlight

    const taskId = parseInt(e.dataTransfer.getData("text/plain")); // Get the task ID stored during dragStart
    console.log("Dropped Task ID:", taskId);

    if (!taskId) return; // Exit if no valid ID was retrieved

    // Update the task's status immutably
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          // Found the task, return a new object with the updated status
          return { ...task, status: targetStatus };
        }
        // Otherwise, return the task unchanged
        return task;
      })
    );
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

        {/* --- Add New Task Form --- */}
        <form onSubmit={handleSubmit} className="add-task-form">
          <input
            type='text'
            placeholder='Enter new task title'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            aria-label="New task title"
          />
          <button type='submit'>Add Task</button>
        </form>

        {/* --- Task Columns Container --- */}
        <div className="columns-container">

          {/* --- To Do Column --- */}
          <div
            className='column column-todo'
            id='todo' // ID matches the status string
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave} // Optional: for visual feedback
            onDrop={(e) => handleDrop(e, 'todo')} // Pass the target status
          >
            <h2>To Do</h2>
            {todoTasks.map(task => (
              <div
                key={task.id}
                id={task.id.toString()} // Assign task ID to the element
                className="task-card"
                draggable="true" // Make the card draggable
                onDragStart={(e) => handleDragStart(e, task.id)} // Pass task ID on drag start
                onDragEnd={handleDragEnd}
              >
                {task.title}
              </div>
            ))}
            {/* Optional: Placeholder when empty */}
            {todoTasks.length === 0 && <div className="empty-column-placeholder">Drop tasks here</div>}
          </div>

          {/* --- In Progress Column --- */}
          <div
            className='column column-in-progress'
            id='in-progress'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'in-progress')}
          >
            <h2>In Progress</h2>
            {inProgressTasks.map(task => (
              <div
                key={task.id}
                id={task.id.toString()}
                className="task-card"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
              >
                {task.title}
              </div>
            ))}
            {inProgressTasks.length === 0 && <div className="empty-column-placeholder">Drop tasks here</div>}
          </div>

          {/* --- Done Column --- */}
          <div
            className='column column-done'
            id='done'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'done')}
          >
            <h2>Done</h2>
            {doneTasks.map(task => (
              <div
                key={task.id}
                id={task.id.toString()}
                className="task-card"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
              >
                {task.title}
              </div>
            ))}
            {doneTasks.length === 0 && <div className="empty-column-placeholder">Drop tasks here</div>}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
