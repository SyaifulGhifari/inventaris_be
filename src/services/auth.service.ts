import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users, User } from '../db/schema';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { BCRYPT_SALT_ROUNDS } from '../utils/constants';
import { JWTPayload } from '../types';

/**
 * Authentication Service
 * Handles user authentication, token generation, and password management
 */
export class AuthService {
    /**
     * Login user with email and password
     */
    async login(email: string, password: string) {
        // Find user by email (case-insensitive)
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate JWT token
        const token = this.generateToken(user);

        // Calculate expiry time in seconds
        const expiresIn = this.getTokenExpirySeconds();

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
            expiresIn,
        };
    }

    /**
     * Generate JWT token for user
     */
    private generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            role: user.role,
        };

        return jwt.sign(payload, env.JWT_SECRET as Secret, {
            expiresIn: env.JWT_EXPIRES_IN as any,
        });
    }

    /**
     * Get token expiry time in seconds
     */
    private getTokenExpirySeconds(): number {
        // Parse JWT_EXPIRES_IN (e.g., "24h", "7d")
        const expiresIn = env.JWT_EXPIRES_IN;
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));

        switch (unit) {
            case 'h':
                return value * 3600;
            case 'd':
                return value * 86400;
            case 'm':
                return value * 60;
            case 's':
                return value;
            default:
                return 86400; // Default 24 hours
        }
    }

    /**
     * Hash password using bcrypt
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    }

    /**
     * Verify password against hash
     */
    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Get user by ID (for /auth/me endpoint)
     */
    async getUserById(userId: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

export const authService = new AuthService();
