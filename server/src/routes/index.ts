import express from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import budgetRoutes from './budget.routes';
import artistRoutes from './artist.routes';
import vendorRoutes from './vendor.routes';
import taskRoutes from './task.routes';
import documentRoutes from './document.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/budget', budgetRoutes);
router.use('/artists', artistRoutes);
router.use('/vendors', vendorRoutes);
router.use('/tasks', taskRoutes);
router.use('/documents', documentRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
