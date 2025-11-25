import { Request, Response, NextFunction } from 'express';
import { sql, isNull } from 'drizzle-orm';
import { db } from '../config/database';
import { products } from '../db/schema';
import { successResponse } from '../utils/response';
import { VALID_SIZES } from '../utils/constants';

/**
 * Categories Controller
 * Handles HTTP requests for categories and sizes endpoints
 */
export class CategoriesController {
    /**
     * GET /api/categories
     * Get all product categories with product counts
     */
    async getCategories(_req: Request, res: Response, next: NextFunction) {
        try {
            // Get categories with product counts
            const categories = await db
                .select({
                    id: sql<string>`ROW_NUMBER() OVER (ORDER BY ${products.category})`,
                    name: products.category,
                    productCount: sql<number>`count(*)::int`,
                })
                .from(products)
                .where(isNull(products.deletedAt))
                .groupBy(products.category);

            const formattedCategories = categories.map(cat => ({
                id: String(cat.id),
                name: cat.name,
                productCount: Number(cat.productCount),
            }));

            res.status(200).json(successResponse(formattedCategories));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/sizes
     * Get all available product sizes
     */
    async getSizes(_req: Request, res: Response, next: NextFunction) {
        try {
            // Return static array of valid sizes
            res.status(200).json(successResponse([...VALID_SIZES]));
        } catch (error) {
            next(error);
        }
    }
}

export const categoriesController = new CategoriesController();
