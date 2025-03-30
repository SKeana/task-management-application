import React, { useState } from 'react';
import axios from 'axios'; 
import './App.css'; // Make sure this CSS file exists and is linked

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
    if (newTaskTitle.trim() === "") return;

    const newTask = {
      id: Date.now(), // Simple unique ID
      title: newTaskTitle,
      status: 'todo'
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskTitle("");
  };

  // Called when dragging of a task card starts
  const handleDragStart = (e, taskId) => {
    console.log("Drag Start - Task ID:", taskId);
    e.dataTransfer.setData("text/plain", taskId.toString());
    // Use setTimeout for reliable style update during drag start
    setTimeout(() => {
      if (e.target) {
        e.target.style.opacity = '0.6'; // Visual feedback: make item semi-transparent
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
    // Clean up any column highlighting if applied
    document.querySelectorAll('.column-drag-over').forEach(el => {
        el.classList.remove('column-drag-over');
    });
  };

  // Called frequently as an item is dragged *over* a potential drop zone (a column)
  const handleDragOver = (e) => {
    e.preventDefault(); // <<< VERY IMPORTANT: Allows dropping
    console.log('Dragging over column:', e.currentTarget.id);
    // Optional: Add class for visual feedback on the column being dragged over
    e.currentTarget.classList.add('column-drag-over');
  };

  // Called when a dragged item leaves a potential drop zone
  const handleDragLeave = (e) => {
    // Optional: Remove class for visual feedback
    e.currentTarget.classList.remove('column-drag-over');
  };

  // Called when a dragged item is dropped onto a valid drop zone (a column)
  const handleDrop = (e, targetStatus) => {
    e.preventDefault(); // <<< VERY IMPORTANT: Prevents default browser action
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    console.log(`Dropped Task ID: ${taskId} onto Column: ${targetStatus}`);

    // Optional: Remove visual feedback class from the dropped-on column
    e.currentTarget.classList.remove('column-drag-over');

    if (!taskId) {
        console.error("Could not get Task ID on drop.");
        return;
    }

    // Update the task's status immutably
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId && task.status !== targetStatus) {
          // Found the task and it's moving to a new column
          console.log(`Updating Task ${taskId} status to ${targetStatus}`);
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

        {/* --- Columns Wrapper --- */}
        <div className="columns-container">

          {/* --- To Do Column --- */}
          <div
            className='column columns-to-do' // Generic and specific classes
            id='todo' // ID matches the status string
            onDragOver={handleDragOver} // Allow items to be dragged over
            onDragLeave={handleDragLeave} // Handle leaving the drop zone
            onDrop={(e) => handleDrop(e, 'todo')} // Handle the actual drop
          >
            <h2>To Do</h2>
            {todoTasks.map(task => (
              <div
                key={task.id}
                id={task.id.toString()} // ID for the draggable element
                className="task-card"
                draggable="true" // Make the card draggable
                onDragStart={(e) => handleDragStart(e, task.id)} // Start drag
                onDragEnd={handleDragEnd} // End drag
              >
                {task.title}
              </div>
            ))}
            {todoTasks.length === 0 && <div className="empty-column-placeholder">Drop tasks here</div>}
          </div>

          {/* --- In Progress Column --- */}
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
            className='column columns-done'
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

        </div> {/* --- End of columns-container --- */}
      </main>
    </div>
  );
}

export default App;
