// task-board-backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
    dueDate: { type: Date, required: false }, // Optional due date for the task
    reminderAt: { type: Date, required: false } // Optional reminder date for the task
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;