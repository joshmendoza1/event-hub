import { Request, Response } from 'express';
import Task from '../models/task.model';
import Event from '../models/event.model';
import User from '../models/user.model';

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    // Get tasks assigned to the user or created by the user
    const tasks = await Task.find({
      $or: [
        { assignedTo: userId },
        // If we want to include tasks created by the user, we would need to add a createdBy field to the Task model
      ],
    })
      .populate('event', 'title')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('event', 'title')
      .populate('assignedTo', 'name email');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, status, priority, assignedTo, event } = req.body;

    // Check if event exists
    const eventExists = await Event.findById(event);
    if (!eventExists) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user exists
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      priority,
      assignedTo,
      event,
    });

    const savedTask = await task.save();
    await savedTask.populate('event', 'title');
    await savedTask.populate('assignedTo', 'name email');

    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, status, priority, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Check if user is authorized to update this task
    // @ts-ignore
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this task' });
      return;
    }

    // If assignedTo is being changed, check if the new user exists
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo ? assignedTo : task.assignedTo;

    const updatedTask = await task.save();
    await updatedTask.populate('event', 'title');
    await updatedTask.populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Check if user is authorized to delete this task
    // @ts-ignore
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this task' });
      return;
    }

    await task.remove();

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tasks for an event
export const getTasksByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Get tasks for the event
    const tasks = await Task.find({ event: eventId })
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks by event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task status
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Check if user is authorized to update this task
    // @ts-ignore
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this task' });
      return;
    }

    task.status = status;

    const updatedTask = await task.save();
    await updatedTask.populate('event', 'title');
    await updatedTask.populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
