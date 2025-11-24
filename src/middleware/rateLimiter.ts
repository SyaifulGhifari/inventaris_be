import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { errorResponse } from '../utils/response';

/**
 * General API rate limiter
 * Limits requests to prevent abuse
 */
export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes by default
    max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window by default
    message: errorResponse('Too many requests, please try again later'),
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json(
            errorResponse('Too many requests, please try again later', {
                retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
            })
        );
    },
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
    message: errorResponse('Too many login attempts, please try again later'),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        res.status(429).json(
            errorResponse('Too many login attempts, please try again later', {
                retryAfter: 900, // 15 minutes in seconds
            })
        );
    },
});
