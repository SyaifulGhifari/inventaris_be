import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller';
import { authenticate } from '../middleware/auth';

/**
 * Categories Routes
 * /api/categories/* and /api/sizes
 */
const router = Router();

// All category routes require authentication
router.use(authenticate);

/**
 * GET /api/categories
 * Get all product categories with counts
 */
router.get(
    '/',
    categoriesController.getCategories.bind(categoriesController)
);

export default router;

/**
 * Sizes Router (separate)
 */
export const sizesRouter = Router();

sizesRouter.use(authenticate);

/**
 * GET /api/sizes
 * Get all available sizes
 */
sizesRouter.get(
    '/',
    categoriesController.getSizes.bind(categoriesController)
);
