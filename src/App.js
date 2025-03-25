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

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newTaskTitle.trim === "") return;
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      status: 'todo'
    };

    setTasks([...tasks, newTask]);
    newTaskTitle("");
  }

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management</h1>
      </header>
      <main className="app-main">

        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='Enter new tasks' value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}/>
          <button type='submit'>Add new task</button>
        </form>

        {/* <PlanningBox /> Commenting out for now */}
        <div className='columns-to-do' id='todo'>
          <h2>Task that need to be done</h2>
          {todoTasks.map(task => (
            <div key={task.id} className="task-card">
              {task.title}
            </div>
          ))}
        </div>
        <div className='columns-in-progress' id='in-progress'>
          <h2>Task that need more work</h2>
          {inProgressTasks.map(task => (
            <div key={task.id} className="task-card">
              {task.title}
            </div>
          ))}
        </div>
        <div className='columns-done' id='done'>
          <h2>Tasks that are done</h2>
          {doneTasks.map(task => (
            <div key={task.id} className="task-card">
              {task.title}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;