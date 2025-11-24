import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { AuthRequest } from '../types';
import { LoginInput } from '../validators/auth.validator';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
    /**
     * POST /api/auth/login
     * Login user with email and password
     */
    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body as LoginInput;

            const result = await authService.login(email, password);

            res.status(200).json(
                successResponse(result, 'Login successful')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Logout user (client-side token removal)
     */
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // In a stateless JWT setup, logout is handled client-side
            // The client should remove the token from storage
            // TODO: Implement token blacklist if needed for enhanced security

            res.status(200).json(
                successResponse({}, 'Logout successful')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/me
     * Get current authenticated user
     */
    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not found in request');
            }

            const user = await authService.getUserById(req.user.id);

            res.status(200).json(
                successResponse(user)
            );
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
