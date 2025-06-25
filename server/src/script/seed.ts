import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import Event from '../models/event.model';
import Task from '../models/task.model';
import BudgetItem from '../models/budget-item.model';
import Artist from '../models/artist.model';
import Vendor from '../models/vendor.model';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-hub')
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Task.deleteMany({});
    await BudgetItem.deleteMany({});
    await Artist.deleteMany({});
    await Vendor.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });

    console.log('Created users');

    // Create events
    const event1 = await Event.create({
      title: 'Summer Music Festival',
      description: 'Annual summer music festival featuring local and international artists.',
      startDate: new Date('2023-07-15T10:00:00Z'),
      endDate: new Date('2023-07-17T22:00:00Z'),
      location: 'Central Park, New York',
      status: 'planned',
      budget: 50000,
      organizer: admin._id,
    });

    const event2 = await Event.create({
      title: 'Tech Conference 2023',
      description: 'Annual technology conference with workshops and networking opportunities.',
      startDate: new Date('2023-09-10T09:00:00Z'),
      endDate: new Date('2023-09-12T18:00:00Z'),
      location: 'Convention Center, San Francisco',
      status: 'active',
      budget: 75000,
      organizer: admin._id,
    });

    const event3 = await Event.create({
      title: 'Charity Gala Dinner',
      description: 'Annual fundraising dinner for local charities.',
      startDate: new Date('2023-11-25T18:00:00Z'),
      endDate: new Date('2023-11-25T23:00:00Z'),
      location: 'Grand Hotel, Chicago',
      status: 'draft',
      budget: 25000,
      organizer: user._id,
    });

    console.log('Created events');

    // Create budget items
    await BudgetItem.create([
      {
        name: 'Venue Rental',
        category: 'Venue',
        amount: 15000,
        status: 'approved',
        event: event1._id,
      },
      {
        name: 'Artist Fees',
        category: 'Artists',
        amount: 20000,
        status: 'approved',
        event: event1._id,
      },
      {
        name: 'Marketing',
        category: 'Marketing',
        amount: 5000,
        status: 'spent',
        event: event1._id,
      },
      {
        name: 'Venue Rental',
        category: 'Venue',
        amount: 30000,
        status: 'approved',
        event: event2._id,
      },
      {
        name: 'Catering',
        category: 'Food & Beverage',
        amount: 15000,
        status: 'planned',
        event: event2._id,
      },
    ]);

    console.log('Created budget items');

    // Create artists
    const artist1 = await Artist.create({
      name: 'DJ Awesome',
      contactEmail: 'dj@example.com',
      contactPhone: '123-456-7890',
      genre: 'Electronic',
      fee: 5000,
      contractStatus: 'signed',
      events: [event1._id],
    });

    const artist2 = await Artist.create({
      name: 'Rock Band',
      contactEmail: 'rock@example.com',
      contactPhone: '123-456-7891',
      genre: 'Rock',
      fee: 7500,
      contractStatus: 'pending',
      events: [event1._id],
    });

    console.log('Created artists');

    // Create vendors
    const vendor1 = await Vendor.create({
      name: 'Sound Equipment Co.',
      contactEmail: 'sound@example.com',
      contactPhone: '123-456-7892',
      service: 'Sound Equipment',
      fee: 3000,
      contractStatus: 'signed',
      events: [event1._id, event2._id],
    });

    const vendor2 = await Vendor.create({
      name: 'Catering Deluxe',
      contactEmail: 'catering@example.com',
      contactPhone: '123-456-7893',
      service: 'Catering',
      fee: 10000,
      contractStatus: 'signed',
      events: [event2._id, event3._id],
    });

    console.log('Created vendors');

    // Create tasks
    await Task.create([
      {
        title: 'Finalize artist lineup',
        description: 'Confirm all artists and their performance times',
        dueDate: new Date('2023-06-15'),
        status: 'completed',
        priority: 'high',
        assignedTo: admin._id,
        event: event1._id,
      },
      {
        title: 'Order stage equipment',
        description: 'Contact vendors for stage, sound, and lighting equipment',
        dueDate: new Date('2023-06-30'),
        status: 'in-progress',
        priority: 'medium',
        assignedTo: user._id,
        event: event1._id,
      },
      {
        title: 'Finalize speaker list',
        description: 'Confirm all speakers and their topics',
        dueDate: new Date('2023-08-15'),
        status: 'pending',
        priority: 'high',
        assignedTo: admin._id,
        event: event2._id,
      },
      {
        title: 'Send invitations',
        description: 'Send out invitations to all guests',
        dueDate: new Date('2023-10-25'),
        status: 'pending',
        priority: 'medium',
        assignedTo: user._id,
        event: event3._id,
      },
    ]);

    console.log('Created tasks');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}
