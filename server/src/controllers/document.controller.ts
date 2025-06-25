import { Request, Response } from 'express';
import Document from '../models/document.model';
import Event from '../models/event.model';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept all file types for now
    cb(null, true);
  }
});

// Get documents for an event
export const getDocumentsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Get documents for the event
    const documents = await Document.find({ event: eventId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error('Get documents by event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload document
export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Create document record
    const document = new Document({
      name: req.body.name || req.file.originalname,
      type: path.extname(req.file.originalname).substring(1),
      url: `/uploads/${req.file.filename}`,
      event: eventId,
      // @ts-ignore
      uploadedBy: req.user.id,
    });

    const savedDocument = await document.save();
    await savedDocument.populate('uploadedBy', 'name email');

    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete document
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find document
    const document = await Document.findById(id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Check if user is authorized to delete this document
    // @ts-ignore
    if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this document' });
      return;
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', '..', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document from database
    await document.remove();

    res.json({ message: 'Document removed' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
