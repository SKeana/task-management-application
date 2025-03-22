// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import PlanningBox from './PlanningBox';

function App() {
  const [tasks, setTasks] = useState([]); // State for managing tasks

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management</h1>
      </header>
      <main className="app-main">
        <PlanningBox />
        {/* Add other components here (TaskBoard, TaskForm, etc.) */
          <div className='columns-planning'>
            <h2>Task that need to be done</h2>
          </div>
        }
        
        <div className='columns-working'>
          <h2>Task that need more work</h2>
        </div>
        <div className='columns-done'>
          <h2>Tasks that are done</h2>
        </div>
      </main>
    </div>
  );
}

export default App;