import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import dashboardRoutes from './dashboard.routes';
import categoriesRoutes, { sizesRouter } from './categories.routes';

/**
 * Main Router
 * Aggregates all API routes
 */
const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoriesRoutes);
router.use('/sizes', sizesRouter);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
