// server/src/routes/vendor.routes.ts
import express from 'express';
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorsByEvent,
  addVendorToEvent,
  removeVendorFromEvent,
} from '../controllers/vendor.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get all vendors
router.get('/', authenticate, getVendors);

// Get vendor by ID
router.get('/:id', authenticate, getVendorById);

// Create new vendor
router.post('/', authenticate, createVendor);

// Update vendor
router.put('/:id', authenticate, updateVendor);

// Delete vendor
router.delete('/:id', authenticate, deleteVendor);

// Get vendors for an event
router.get('/event/:eventId', authenticate, getVendorsByEvent);

// Add vendor to event
router.post('/:vendorId/event/:eventId', authenticate, addVendorToEvent);

// Remove vendor from event
router.delete('/:vendorId/event/:eventId', authenticate, removeVendorFromEvent);

export default router;
