import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse } from '../utils/response';

/**
 * Validation middleware factory
 * Creates middleware to validate request body, query, or params using Zod schema
 */
export function validateBody(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json(
                    errorResponse('Validation error', error.flatten().fieldErrors)
                );
                return;
            }
            next(error);
        }
    };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.query = await schema.parseAsync(req.query);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json(
                    errorResponse('Invalid query parameters', error.flatten().fieldErrors)
                );
                return;
            }
            next(error);
        }
    };
}

/**
 * Validate URL parameters
 */
export function validateParams(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.params = await schema.parseAsync(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json(
                    errorResponse('Invalid parameters', error.flatten().fieldErrors)
                );
                return;
            }
            next(error);
        }
    };
}
