import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validator';
import { loginSchema } from '../validators/auth.validator';

/**
 * Authentication Routes
 * /api/auth/*
 */
const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
    '/login',
    authLimiter, // Rate limit login attempts
    validateBody(loginSchema),
    authController.login.bind(authController)
);

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post(
    '/logout',
    authenticate,
    authController.logout.bind(authController)
);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get(
    '/me',
    authenticate,
    authController.getCurrentUser.bind(authController)
);

export default router;
