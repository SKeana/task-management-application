// task-board-backend/server.js

// 1. Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/task');
const cors = require('cors'); // Import CORS package
require('dotenv').config();

// 2. Create Express App Instance
const app = express();

// 3. Define Port
const PORT = process.env.PORT || 3001;

// --- MongoDB Connection String ---
// !!! REPLACE WITH YOUR ACTUAL CONNECTION STRING !!!
const MONGO_URI = process.env.MONGO_URI;// OR for local: const MONGO_URI = 'mongodb://localhost:27017/taskBoardDb';
// ---------------------------------

// --- Middleware ---
// Enable CORS for all origins (for development)
// IMPORTANT: For production, configure CORS more restrictively
app.use(cors());

app.use(express.json()); // Parses incoming JSON request bodies
// ------------------

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Start the Express server ONLY after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });
// -------------------------

// --- API Routes (Using Mongoose Model) ---

// GET /api/tasks - Fetch all tasks from DB
app.get('/api/tasks', async (req, res) => {
  console.log('Request received for GET /api/tasks');
  try {
    const tasks = await Task.find().sort({ createdAt: 1 }); // Fetch and sort by creation time
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks from database.' });
  }
});

// POST /api/tasks - Create a new task in DB
app.post('/api/tasks', async (req, res) => {
  console.log('Request received for POST /api/tasks');
  console.log('Request Body:', req.body);
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required.' });
    }
    const newTask = new Task({ title: title.trim() });
    const savedTask = await newTask.save();
    console.log('Task saved:', savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating task in database.' });
  }
});

// PATCH /api/tasks/:taskId - Update task status in DB
app.patch('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;
  console.log(`Request received for PATCH /api/tasks/${taskId}`);
  console.log('Request Body:', req.body);

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      console.log(`Task with ID ${taskId} not found for update.`);
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }
    console.log('Task updated:', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Task ID format.' });
    }
    res.status(500).json({ message: 'Error updating task in database.' });
  }
});

// DELETE /api/tasks/:taskId - Delete a task from DB
app.delete('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  console.log(`Request received for DELETE /api/tasks/${taskId}`);

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      console.log(`Task with ID ${taskId} not found for deletion.`);
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }

    console.log('Task deleted:', deletedTask);
    res.status(200).json({ message: `Task ${taskId} deleted successfully.`, deletedTask });
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Task ID format.' });
    }
    res.status(500).json({ message: 'Error deleting task from database.' });
  }
});

// --- Catch-all Route ---
app.get('/', (req, res) => {
  res.send('Hello from Task Board Backend! Database connection established.');
});