import { Response, NextFunction } from 'express';
import { productsService } from '../services/products.service';
import { successResponse } from '../utils/response';
import { AuthRequest, ProductFilters } from '../types';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';

/**
 * Products Controller
 * Handles HTTP requests for product endpoints
 */
export class ProductsController {
    /**
     * GET /api/products
     * Get all products with filtering and pagination
     */
    async getProducts(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const filters = req.query as unknown as Partial<ProductFilters>;

            const result = await productsService.getProducts(filters);

            res.status(200).json(successResponse(result));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/products/:id
     * Get single product by ID
     */
    async getProductById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const product = await productsService.getProductById(id);

            res.status(200).json(successResponse(product));
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/products
     * Create new product
     */
    async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateProductInput;
            const userId = req.user?.id;

            const product = await productsService.createProduct(data, userId);

            res.status(201).json(
                successResponse(product, 'Product created successfully')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT/PATCH /api/products/:id
     * Update existing product
     */
    async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = req.body as UpdateProductInput;
            const userId = req.user?.id;

            const product = await productsService.updateProduct(id, data, userId);

            res.status(200).json(
                successResponse(product, 'Product updated successfully')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/products/:id
     * Delete product (soft delete)
     */
    async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await productsService.deleteProduct(id);

            res.status(200).json(
                successResponse({}, 'Product deleted successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}

export const productsController = new ProductsController();
