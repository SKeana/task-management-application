// 1. Import the Express library
const express = require('express');

// 2. Create an instance of the Express application
const app = express();

// 3. Define the port the server will listen on
// Use an environment variable if available, otherwise default to 3001
// (Using 3001 to avoid conflict with React's default 3000)
const PORT = process.env.PORT || 3001;

// 4. A simple route for the root URL '/' to test
app.get('/', (req, res) => {
  res.send('Hello from Task Board Backend!'); // Send a simple text response
});

// 5. Start the server and make it listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
