import React, { useState } from 'react';
import './App.css';

function App() {
  // ... (keep your state and handlers the same) ...
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design homepage", status: "todo" },
    { id: 2, title: "Set up database", status: "in-progress" },
    { id: 3, title: "Write API endpoints", status: "in-progress" },
    { id: 4, title: "Write tests", status: "done" }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = (e) => { /* ...your handler... */ };
  const handleDragStart = (e, taskId) => { /* ...your handler... */ };
  const handleDragEnd = (e) => { /* ...your handler... */ };
  const handleDragOver = (e) => { /* ...your handler... */ };
  const handleDragLeave = (e) => { /* ...your handler... */ };
  const handleDrop = (e, targetStatus) => { /* ...your handler... */ };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management Board</h1>
      </header>
      {/* app-main no longer needs to be the flex container for columns */}
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

        {/* --- THIS IS THE NEW WRAPPER --- */}
        <div className="columns-container">

          {/* --- To Do Column --- */}
          <div
            // Add a generic 'column' class for shared styles
            className='column columns-to-do'
            id='todo'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'todo')}
          >
            <h2>To Do</h2>
            {todoTasks.map(task => (
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
            {todoTasks.length === 0 && <div className="empty-column-placeholder">Drop tasks here</div>}
          </div>

          {/* --- In Progress Column --- */}
          <div
            // Add a generic 'column' class
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
            // Add a generic 'column' class
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

        </div> {/* --- END OF NEW WRAPPER --- */}
      </main>
    </div>
  );
}

export default App;
