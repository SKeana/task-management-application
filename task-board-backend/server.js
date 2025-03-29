const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

let tasks = [
  { id: 1, title: "Design homepage", status: "todo" },
  { id: 2, title: "Set up database", status: "in-progress" },
  { id: 3, title: "Write API endpoints", status: "in-progress" },
  { id: 4, title: "Write tests", status: "done" }
];


app.get('/api/tasks', (req, res) => {
  console.log("Request received for GET /api/task");
  res.json(tasks);
});

app.get('/', (req, res) => {
  res.send('hello form taskbord backend use /api/tasks');
});

app.listen(PORT, () =>{
  console.log(`Server is running http://localhost:${PORT}`);
});