import express from 'express';
import {
  getDocumentsByEvent,
  uploadDocument,
  deleteDocument,
  upload,
} from '../controllers/document.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get documents for an event
router.get('/event/:eventId', authenticate, getDocumentsByEvent);

// Upload document
router.post('/event/:eventId', authenticate, upload.single('file'), uploadDocument);

// Delete document
router.delete('/:id', authenticate, deleteDocument);

export default router;
