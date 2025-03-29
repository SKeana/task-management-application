// server.js (In-Memory Version)

// 1. Import Dependencies
const express = require('express');

// 2. Create Express App Instance
const app = express();

// 3. Define Port
const PORT = process.env.PORT || 3001;

// --- In-Memory Task Storage ---
let tasks = [
  { id: 1, title: "Design homepage", status: "todo" },
  { id: 2, title: "Set up database", status: "in-progress" },
  { id: 3, title: "Write API endpoints", status: "in-progress" },
  { id: 4, title: "Write tests", status: "done" }
];
let nextTaskId = 5; // Variable to generate simple unique IDs
// -----------------------------

// --- Middleware ---
// Parses incoming JSON request bodies.
app.use(express.json());
// ------------------

// --- API Routes ---

// GET /api/tasks - Fetch all tasks
app.get('/api/tasks', (req, res) => {
  console.log('Request received for GET /api/tasks');
  res.json(tasks); // Send the in-memory array
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  console.log('Request received for POST /api/tasks');
  console.log('Request Body:', req.body);
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Task title is required and must be a non-empty string.' });
  }

  const newTask = {
    id: nextTaskId++,
    title: title.trim(),
    status: 'todo'
  };
  tasks.push(newTask); // Add to in-memory array
  console.log('Updated tasks array:', tasks);
  res.status(201).json(newTask); // Send back new task
});

// PATCH /api/tasks/:taskId - Update task status
app.patch('/api/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const { status } = req.body;
  console.log(`Request received for PATCH /api/tasks/${taskId}`);
  console.log('Request Body:', req.body);

  if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid Task ID provided.' });
  }

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
  }

  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
  }

  // Update in-memory array
  tasks[taskIndex] = { ...tasks[taskIndex], status: status };
  console.log(`Updated task ${taskId}:`, tasks[taskIndex]);
  console.log('Current tasks array:', tasks);
  res.json(tasks[taskIndex]); // Send back updated task
});

// --- Catch-all Route for Basic Check ---
app.get('/', (req, res) => {
  res.send('Hello from Task Board Backend! (In-Memory)');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
