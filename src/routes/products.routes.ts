import { Router } from 'express';
import { productsController } from '../controllers/products.controller';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validator';
import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
} from '../validators/product.validator';

/**
 * Products Routes
 * /api/products/*
 */
const router = Router();

// All product routes require authentication
router.use(authenticate);

/**
 * GET /api/products
 * Get all products with filtering and pagination
 */
router.get(
    '/',
    validateQuery(productQuerySchema),
    productsController.getProducts.bind(productsController)
);

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get(
    '/:id',
    productsController.getProductById.bind(productsController)
);

/**
 * POST /api/products
 * Create new product
 */
router.post(
    '/',
    validateBody(createProductSchema),
    productsController.createProduct.bind(productsController)
);

/**
 * PUT /api/products/:id
 * Update existing product (full update)
 */
router.put(
    '/:id',
    validateBody(updateProductSchema),
    productsController.updateProduct.bind(productsController)
);

/**
 * PATCH /api/products/:id
 * Update existing product (partial update)
 */
router.patch(
    '/:id',
    validateBody(updateProductSchema),
    productsController.updateProduct.bind(productsController)
);

/**
 * DELETE /api/products/:id
 * Delete product (soft delete)
 */
router.delete(
    '/:id',
    productsController.deleteProduct.bind(productsController)
);

export default router;
