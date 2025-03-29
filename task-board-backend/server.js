// server.js (Working with MongoDB)

// 1. Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // 1. Import the Task model

// 2. Create Express App Instance
const app = express();

// 3. Define Port
const PORT = process.env.PORT || 3001;

// --- MongoDB Connection String ---
// !!! REPLACE WITH YOUR ACTUAL CONNECTION STRING !!!
const MONGO_URI = 'mongodb+srv://skean2000:<db_password>@cluster0.xfnkesd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// OR for local: const MONGO_URI = 'mongodb://localhost:27017/taskBoardDb';
// ---------------------------------

// --- Middleware ---
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
app.get('/api/tasks', async (req, res) => { // Make handler async
  console.log('Request received for GET /api/tasks');
  try {
    const tasks = await Task.find(); // 2. Use Task.find() to get all tasks
    res.status(200).json(tasks);     // Send tasks back as JSON
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks from database.' }); // 500 Internal Server Error
  }
});

// POST /api/tasks - Create a new task in DB
app.post('/api/tasks', async (req, res) => { // Make handler async
  console.log('Request received for POST /api/tasks');
  console.log('Request Body:', req.body);

  try {
    const { title } = req.body; // Extract title

    // Basic validation (Mongoose schema also validates)
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    // 3. Create a new Task document using the model
    const newTask = new Task({
      title: title.trim()
      // status defaults to 'todo' based on schema
    });

    // 4. Save the new task to the database
    const savedTask = await newTask.save();

    console.log('Task saved:', savedTask);
    res.status(201).json(savedTask); // Send back the saved task (includes _id, status, timestamps)

  } catch (error) {
    console.error('Error creating task:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating task in database.' });
  }
});

// PATCH /api/tasks/:taskId - Update task status in DB
app.patch('/api/tasks/:taskId', async (req, res) => { // Make handler async
  const taskId = req.params.taskId; // Task ID from URL (Mongoose handles string conversion)
  const { status } = req.body;      // New status from body
  console.log(`Request received for PATCH /api/tasks/${taskId}`);
  console.log('Request Body:', req.body);

  // Validate status (optional here as schema also validates, but good practice)
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    // 5. Find task by ID and update its status
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,              // The _id of the task to find
      { status: status },  // The update to apply
      {
        new: true,         // Return the modified document, not the original
        runValidators: true // Ensure schema validations (like enum for status) are run
      }
    );

    // 6. Handle Task Not Found by findByIdAndUpdate
    if (!updatedTask) {
      console.log(`Task with ID ${taskId} not found for update.`);
      return res.status(404).json({ message: `Task with ID ${taskId} not found.` });
    }

    console.log('Task updated:', updatedTask);
    res.status(200).json(updatedTask); // Send back the updated task

  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
     // Handle potential validation errors from Mongoose during update
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // Handle potential CastError if the taskId format is invalid for ObjectId
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Task ID format.' });
    }
    res.status(500).json({ message: 'Error updating task in database.' });
  }
});
// ----------------------------------------------------

// --- Catch-all Route ---
app.get('/', (req, res) => {
  res.send('Hello from Task Board Backend! Database connection established.');
});

// --- Start Server (Moved inside mongoose.connect().then() ) ---
// app.listen is called within the mongoose.connect().then() block above
