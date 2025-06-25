import { Request, Response } from 'express';
import Artist from '../models/artist.model';
import Event from '../models/event.model';

// Get all artists
export const getArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const artists = await Artist.find().sort({ name: 1 });
    res.json(artists);
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get artist by ID
export const getArtistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const artist = await Artist.findById(req.params.id).populate('events', 'title startDate endDate');

    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }

    res.json(artist);
  } catch (error) {
    console.error('Get artist by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new artist
export const createArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactEmail, contactPhone, genre, fee, contractStatus, events } = req.body;

    const artist = new Artist({
      name,
      contactEmail,
      contactPhone,
      genre,
      fee,
      contractStatus,
      events: events || [],
    });

    const savedArtist = await artist.save();

    res.status(201).json(savedArtist);
  } catch (error) {
    console.error('Create artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update artist
export const updateArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactEmail, contactPhone, genre, fee, contractStatus, events } = req.body;

    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }

    artist.name = name || artist.name;
    artist.contactEmail = contactEmail || artist.contactEmail;
    artist.contactPhone = contactPhone || artist.contactPhone;
    artist.genre = genre || artist.genre;
    artist.fee = fee !== undefined ? fee : artist.fee;
    artist.contractStatus = contractStatus || artist.contractStatus;

    if (events) {
      artist.events = events;
    }

    const updatedArtist = await artist.save();

    res.json(updatedArtist);
  } catch (error) {
    console.error('Update artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete artist
export const deleteArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }

    await artist.remove();

    res.json({ message: 'Artist removed' });
  } catch (error) {
    console.error('Delete artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get artists for an event
export const getArtistsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Find artists associated with this event
    const artists = await Artist.find({ events: eventId });

    res.json(artists);
  } catch (error) {
    console.error('Get artists by event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add artist to event
export const addArtistToEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artistId, eventId } = req.params;

    // Check if artist and event exist
    const artist = await Artist.findById(artistId);
    const event = await Event.findById(eventId);

    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if artist is already associated with this event
    if (artist.events.includes(event._id as any)) {
      res.status(400).json({ message: 'Artist is already associated with this event' });
      return;
    }

    // Add event to artist's events
    artist.events.push(event._id);
    await artist.save();

    res.json(artist);
  } catch (error) {
    console.error('Add artist to event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove artist from event
export const removeArtistFromEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artistId, eventId } = req.params;

    // Check if artist exists
    const artist = await Artist.findById(artistId);

    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }

    // Remove event from artist's events
    artist.events = artist.events.filter(
      (event) => event.toString() !== eventId
    );

    await artist.save();

    res.json(artist);
  } catch (error) {
    console.error('Remove artist from event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
