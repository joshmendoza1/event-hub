import { Request, Response } from 'express';
import Vendor from '../models/vendor.model';
import Event from '../models/event.model';

// Get all vendors
export const getVendors = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await Vendor.find().sort({ name: 1 });
    res.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendor by ID
export const getVendorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('events', 'title startDate endDate');

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    res.json(vendor);
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new vendor
export const createVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactEmail, contactPhone, service, fee, contractStatus, events } = req.body;

    const vendor = new Vendor({
      name,
      contactEmail,
      contactPhone,
      service,
      fee,
      contractStatus,
      events: events || [],
    });

    const savedVendor = await vendor.save();

    res.status(201).json(savedVendor);
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vendor
export const updateVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contactEmail, contactPhone, service, fee, contractStatus, events } = req.body;

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    vendor.name = name || vendor.name;
    vendor.contactEmail = contactEmail || vendor.contactEmail;
    vendor.contactPhone = contactPhone || vendor.contactPhone;
    vendor.service = service || vendor.service;
    vendor.fee = fee !== undefined ? fee : vendor.fee;
    vendor.contractStatus = contractStatus || vendor.contractStatus;

    if (events) {
      vendor.events = events;
    }

    const updatedVendor = await vendor.save();

    res.json(updatedVendor);
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete vendor
export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    await vendor.remove();

    res.json({ message: 'Vendor removed' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vendors for an event
export const getVendorsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Find vendors associated with this event
    const vendors = await Vendor.find({ events: eventId });

    res.json(vendors);
  } catch (error) {
    console.error('Get vendors by event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add vendor to event
export const addVendorToEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vendorId, eventId } = req.params;

    // Check if vendor and event exist
    const vendor = await Vendor.findById(vendorId);
    const event = await Event.findById(eventId);

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if vendor is already associated with this event
    if (vendor.events.includes(event._id as any)) {
      res.status(400).json({ message: 'Vendor is already associated with this event' });
      return;
    }

    // Add event to vendor's events
    vendor.events.push(event._id);
    await vendor.save();

    res.json(vendor);
  } catch (error) {
    console.error('Add vendor to event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove vendor from event
export const removeVendorFromEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vendorId, eventId } = req.params;

    // Check if vendor exists
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }

    // Remove event from vendor's events
    vendor.events = vendor.events.filter(
      (event) => event.toString() !== eventId
    );

    await vendor.save();

    res.json(vendor);
  } catch (error) {
    console.error('Remove vendor from event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
