import { z } from 'zod';
import { VALID_CATEGORIES, VALID_SIZES } from '../utils/constants';

/**
 * Create product validation schema
 */
export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
    category: z.enum(VALID_CATEGORIES, {
        errorMap: () => ({ message: 'Category must be one of: Celana, Celana Jeans, Baju, Jaket' }),
    }),
    sizes: z
        .array(z.enum(VALID_SIZES))
        .min(1, 'At least one size is required')
        .refine((sizes) => new Set(sizes).size === sizes.length, {
            message: 'Duplicate sizes are not allowed',
        }),
    color: z.string().min(1, 'Color is required').max(50, 'Color must not exceed 50 characters'),
    material: z.string().min(1, 'Material is required').max(100, 'Material must not exceed 100 characters'),
    stock: z.number().int('Stock must be an integer').min(0, 'Stock must be a non-negative number'),
    price: z.number().positive('Price must be a positive number').transform(val => val.toFixed(2)),
    description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
    imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

/**
 * Update product validation schema (all fields optional)
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Product query parameters validation schema
 */
export const productQuerySchema = z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
    search: z.string().optional(),
    category: z.enum(VALID_CATEGORIES).optional(),
    size: z.enum(VALID_SIZES).optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    sortBy: z.enum(['name', 'stock', 'price', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
