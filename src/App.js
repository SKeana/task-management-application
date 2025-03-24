import React, { useState, useEffect } from 'react';
import './App.css';
// import PlanningBox from './PlanningBox'; // Commenting out for now

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design homepage", status: "todo" },
    { id: 2, title: "Set up database", status: "in-progress" },
    { id: 3, title: "Write API endpoints", status: "in-progress" },
    { id: 4, title: "Write tests", status: "done" }
  ]);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');

  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management</h1>
      </header>
      <main className="app-main">
        {/* <PlanningBox /> Commenting out for now */}
        <div className='columns-to-do' id='todo'>
          <h2>Task that need to be done</h2>
        </div>
        <div className='columns-in-progress' id='in-progress'>
          <h2>Task that need more work</h2>
        </div>
        <div className='columns-done' id='done'>
          <h2>Tasks that are done</h2>
        </div>
      </main>
    </div>
  );
}

export default App;