import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { errorResponse } from '../utils/response';

/**
 * Validation middleware factory
 * Creates middleware to validate request body, query, or params using Zod schema
 */
export function validateBody(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json(
                    errorResponse('Validation error', error.flatten().fieldErrors)
                );
            }
            next(error);
        }
    };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json(
                    errorResponse('Invalid query parameters', error.flatten().fieldErrors)
                );
            }
            next(error);
        }
    };
}

/**
 * Validate URL parameters
 */
export function validateParams(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.params = await schema.parseAsync(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json(
                    errorResponse('Invalid parameters', error.flatten().fieldErrors)
                );
            }
            next(error);
        }
    };
}
