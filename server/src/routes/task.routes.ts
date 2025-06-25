import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByEvent,
  updateTaskStatus,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get all tasks
router.get('/', authenticate, getTasks);

// Get task by ID
router.get('/:id', authenticate, getTaskById);

// Create new task
router.post('/', authenticate, createTask);

// Update task
router.put('/:id', authenticate, updateTask);

// Delete task
router.delete('/:id', authenticate, deleteTask);

// Get tasks for an event
router.get('/event/:eventId', authenticate, getTasksByEvent);

// Update task status
router.patch('/:id/status', authenticate, updateTaskStatus);

export default router;
