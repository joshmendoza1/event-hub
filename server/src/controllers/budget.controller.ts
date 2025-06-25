import { Request, Response } from 'express';
import BudgetItem from '../models/budget-item.model';
import Event from '../models/event.model';

// Get budget items for an event
export const getBudgetItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Get budget items for the event
    const budgetItems = await BudgetItem.find({ event: eventId });

    res.json(budgetItems);
  } catch (error) {
    console.error('Get budget items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create budget item
export const createBudgetItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { name, category, amount, status } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is authorized to modify this event's budget
    // @ts-ignore
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to modify this event\'s budget' });
      return;
    }

    // Create new budget item
    const budgetItem = new BudgetItem({
      name,
      category,
      amount,
      status,
      event: eventId,
    });

    const savedBudgetItem = await budgetItem.save();

    res.status(201).json(savedBudgetItem);
  } catch (error) {
    console.error('Create budget item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update budget item
export const updateBudgetItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, amount, status } = req.body;

    // Find budget item
    const budgetItem = await BudgetItem.findById(id);
    if (!budgetItem) {
      res.status(404).json({ message: 'Budget item not found' });
      return;
    }

    // Check if user is authorized to modify this event's budget
    const event = await Event.findById(budgetItem.event);
    if (!event) {
      res.status(404).json({ message: 'Associated event not found' });
      return;
    }

    // @ts-ignore
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to modify this event\'s budget' });
      return;
    }

    // Update budget item
    budgetItem.name = name || budgetItem.name;
    budgetItem.category = category || budgetItem.category;
    budgetItem.amount = amount !== undefined ? amount : budgetItem.amount;
    budgetItem.status = status || budgetItem.status;

    const updatedBudgetItem = await budgetItem.save();

    res.json(updatedBudgetItem);
  } catch (error) {
    console.error('Update budget item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete budget item
export const deleteBudgetItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find budget item
    const budgetItem = await BudgetItem.findById(id);
    if (!budgetItem) {
      res.status(404).json({ message: 'Budget item not found' });
      return;
    }

    // Check if user is authorized to modify this event's budget
    const event = await Event.findById(budgetItem.event);
    if (!event) {
      res.status(404).json({ message: 'Associated event not found' });
      return;
    }

    // @ts-ignore
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to modify this event\'s budget' });
      return;
    }

    // Delete budget item
    await budgetItem.remove();

    res.json({ message: 'Budget item removed' });
  } catch (error) {
    console.error('Delete budget item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get budget summary for an event
export const getBudgetSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Get all budget items for the event
    const budgetItems = await BudgetItem.find({ event: eventId });

    // Calculate totals
    const totalBudget = event.budget;
    const totalAllocated = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const totalSpent = budgetItems
      .filter(item => item.status === 'spent')
      .reduce((sum, item) => sum + item.amount, 0);

    // Group by category
    const categories = budgetItems.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});

    // Format category data for charts
    const categoryData = Object.keys(categories).map(key => ({
      name: key,
      value: categories[key],
    }));

    res.json({
      totalBudget,
      totalAllocated,
      totalSpent,
      remaining: totalBudget - totalSpent,
      allocationPercentage: totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0,
      spentPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      categories: categoryData,
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
