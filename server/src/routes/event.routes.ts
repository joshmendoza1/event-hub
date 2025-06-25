import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Get all events
router.get('/', authenticate, getEvents);

// Get event by ID
router.get('/:id', authenticate, getEventById);

// Create new event
router.post(
  '/',
  authenticate,
  authorize(['admin', 'event_planner']),
  createEvent
);

// Update event
router.put('/:id', authenticate, updateEvent);

// Delete event
router.delete('/:id', authenticate, deleteEvent);

export default router;
