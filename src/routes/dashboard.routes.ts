import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

/**
 * Dashboard Routes
 * /api/dashboard/*
 */
const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

/**
 * GET /api/dashboard/stats
 * Get overall dashboard statistics
 */
router.get(
    '/stats',
    dashboardController.getStats.bind(dashboardController)
);

/**
 * GET /api/dashboard/low-stock
 * Get low stock products
 */
router.get(
    '/low-stock',
    dashboardController.getLowStock.bind(dashboardController)
);

export default router;
