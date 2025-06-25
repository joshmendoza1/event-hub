import express from 'express';
import {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  getBudgetSummary,
} from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get budget items for an event
router.get('/event/:eventId', authenticate, getBudgetItems);

// Get budget summary for an event
router.get('/event/:eventId/summary', authenticate, getBudgetSummary);

// Create budget item for an event
router.post('/event/:eventId', authenticate, createBudgetItem);

// Update budget item
router.put('/:id', authenticate, updateBudgetItem);

// Delete budget item
router.delete('/:id', authenticate, deleteBudgetItem);

export default router;
