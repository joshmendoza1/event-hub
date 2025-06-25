import { Request, Response } from 'express';
import Event from '../models/event.model';

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, startDate, endDate, location, status, budget } = req.body;

    // @ts-ignore
    const organizer = req.user.id;

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      status,
      budget,
      organizer,
    });

    const savedEvent = await event.save();
    await savedEvent.populate('organizer', 'name email');

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, startDate, endDate, location, status, budget } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is the organizer or an admin
    // @ts-ignore
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this event' });
      return;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.startDate = startDate ? new Date(startDate) : event.startDate;
    event.endDate = endDate ? new Date(endDate) : event.endDate;
    event.location = location || event.location;
    event.status = status || event.status;
    event.budget = budget !== undefined ? budget : event.budget;

    const updatedEvent = await event.save();
    await updatedEvent.populate('organizer', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is the organizer or an admin
    // @ts-ignore
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this event' });
      return;
    }

    await event.remove();

    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
