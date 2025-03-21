// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import PlanningBox from './PlanningBox';

function App() {
  const [tasks, setTasks] = useState([]); // State for managing tasks

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management App</h1>
      </header>
      <main className="app-main">
        <PlanningBox />
        {/* Add other components here (TaskBoard, TaskForm, etc.) */}
      </main>
    </div>
  );
}

export default App;

