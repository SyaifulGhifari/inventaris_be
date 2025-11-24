import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { logger } from '../config/logger';
import { env } from '../config/env';

/**
 * Global error handler middleware
 * Catches all errors and returns consistent error responses
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Handle operational errors (AppError instances)
    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message));
        return;
    }

    // Log unexpected errors
    logger.error('Unexpected error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    // Return generic error in production, detailed error in development
    const message = env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    const response = env.NODE_ENV === 'production'
        ? errorResponse(message)
        : errorResponse(message, { stack: err.stack });

    res.status(500).json(response);
}

/**
 * 404 Not Found handler
 * Handles routes that don't exist
 */
export function notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    res.status(404).json(
        errorResponse(`Route ${req.method} ${req.url} not found`)
    );
}
