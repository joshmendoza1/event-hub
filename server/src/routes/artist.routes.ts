// server/src/routes/artist.routes.ts
import express from 'express';
import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistsByEvent,
  addArtistToEvent,
  removeArtistFromEvent,
} from '../controllers/artist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get all artists
router.get('/', authenticate, getArtists);

// Get artist by ID
router.get('/:id', authenticate, getArtistById);

// Create new artist
router.post('/', authenticate, createArtist);

// Update artist
router.put('/:id', authenticate, updateArtist);

// Delete artist
router.delete('/:id', authenticate, deleteArtist);

// Get artists for an event
router.get('/event/:eventId', authenticate, getArtistsByEvent);

// Add artist to event
router.post('/:artistId/event/:eventId', authenticate, addArtistToEvent);

// Remove artist from event
router.delete('/:artistId/event/:eventId', authenticate, removeArtistFromEvent);

export default router;
