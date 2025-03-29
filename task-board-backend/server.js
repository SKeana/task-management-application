// server.js

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
// IMPORTANT: Parses incoming JSON request bodies. Must be before routes that need it.
app.use(express.json());
// ------------------

// --- API Routes ---

// GET /api/tasks - Fetch all tasks
app.get('/api/tasks', (req, res) => {
  // This function runs when a GET request hits /api/tasks
  console.log('Request received for GET /api/tasks');

  // Send the 'tasks' array back as a JSON response (status 200 OK is default)
  res.json(tasks);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  // This function runs when a POST request hits /api/tasks
  console.log('Request received for POST /api/tasks');
  console.log('Request Body:', req.body); // Log the parsed body

  // 1. Extract the title from the request body (thanks to express.json())
  const { title } = req.body;

  // 2. Basic Server-Side Validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    // If validation fails, send a 400 Bad Request error response
    return res.status(400).json({ message: 'Task title is required and must be a non-empty string.' });
  }

  // 3. Create the new task object
  const newTask = {
    id: nextTaskId++, // Use the current ID, then increment for the next one
    title: title.trim(), // Use the validated & trimmed title
    status: 'todo'      // Default status for new tasks
  };

  // 4. Add the new task to our in-memory array
  tasks.push(newTask);
  console.log('Updated tasks array:', tasks);

  // 5. Send the newly created task back as the response
  // Use 201 Created status code for successful resource creation
  res.status(201).json(newTask);
});



app.patch('/api/task/:taskId', (res,req) =>{
  const newtaskId = parseInt(req.parmas.tasksId, 10);
  const { status } = req.body;
  
  console.log(`Request received for PATCH /api/tasks/${taskId}`);
  console.log("request body:", req.body);

  if(isNaN(taskId)) {
    return res.status(400).json({ message: 'invalid task ID given'});
  }

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ mesage: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}`})
  } 

  const taskIndex = taskIndex.findIndex(task => tasks.id === taskId);
  if(!taskIndex === -1){
    return res.status(404).json({ message: `Task with ID ${taskId} not found.`});
  }

  tasks[taskIndex] = {...tasks[taskIndex], status: status};
  console.log(`Updated task ${taskId}:`, tasks[taskIndex]);
  console.log('Current tasks array:', tasks);

  res.json(tasks[taskIndex]);
})

// --- Catch-all Route for Basic Check ---
// Useful for quickly checking if the server is running
app.get('/', (req, res) => {
  res.send('Hello from Task Board Backend! Use /api/tasks');
});

// --- Start Server ---
// Make the server listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
