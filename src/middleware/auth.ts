import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users } from '../db/schema';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { AuthRequest, JWTPayload } from '../types';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify JWT token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

        // Fetch user from database
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('Token expired'));
        } else {
            next(error);
        }
    }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if not
 */
export async function optionalAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, decoded.userId))
                .limit(1);

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
}
