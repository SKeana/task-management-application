# Task Management Application

A simple Kanban-style task board. Tasks move between **To Do**, **In Progress**, and **Done** columns via drag and drop. The frontend is a React (Create React App) client; the backend is an Express + MongoDB (Mongoose) REST API.

## Tech stack

- **Frontend:** React 19, Axios, native HTML5 drag-and-drop, Create React App
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Features

- Add tasks via a simple form
- Drag and drop tasks between the To Do / In Progress / Done columns
- Delete tasks
- Status changes persist to MongoDB via PATCH requests

## Project structure

```
task-management-application-master/
├── package.json              # React frontend
├── public/
├── src/
│   ├── App.js                # Board UI + drag-and-drop logic
│   ├── PlanningBox.js
│   └── App.css
└── task-board-backend/
    ├── server.js             # Express server (port 3001)
    ├── models/
    │   └── task.js           # Mongoose Task schema
    └── .env                  # MONGO_URI, PORT
```

## API

Base URL: `http://localhost:3001/api`

| Method | Path                  | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/tasks`              | List all tasks                       |
| POST   | `/tasks`              | Create a new task                    |
| PATCH  | `/tasks/:taskId`      | Update a task's `status`             |
| DELETE | `/tasks/:taskId`      | Delete a task                        |

A task has the shape:

```json
{
  "_id": "mongo-object-id",
  "title": "string (required)",
  "status": "todo | in-progress | done",
  "createdAt": "ISO date"
}
```

## Setup

### 1. Backend

```bash
cd task-board-backend
npm install express mongoose cors dotenv
```

Create a `.env` file in `task-board-backend/`:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/taskBoardDb
```

(Or use a MongoDB Atlas connection string for `MONGO_URI`.)

Start the API:

```bash
node server.js
```

The server only starts listening after MongoDB connects successfully.

### 2. Frontend

In a separate terminal, from the project root:

```bash
npm install
npm start
```

The React app runs on `http://localhost:3000` and talks to the API at `http://localhost:3001/api`.

## Available scripts

- `npm start` — run the React dev server
- `npm run build` — production build
- `npm test` — run the test runner
