import { eq, and, isNull, ilike, sql, asc, desc, lt } from 'drizzle-orm';
import { db } from '../config/database';
import { products, Product, NewProduct } from '../db/schema';
import { NotFoundError, ConflictError } from '../utils/errors';
import { ProductFilters, PaginationMeta } from '../types';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../utils/constants';

/**
 * Products Service
 * Handles all product-related business logic
 */
export class ProductsService {
    /**
     * Get products with filtering, sorting, and pagination
     */
    async getProducts(filters: Partial<ProductFilters>) {
        // Set defaults
        const page = filters.page || DEFAULT_PAGE;
        const limit = Math.min(filters.limit || DEFAULT_LIMIT, MAX_LIMIT);
        const sortBy = filters.sortBy || 'createdAt';
        const order = filters.order || 'desc';

        // Build base query - exclude soft deleted products
        let query = db.select().from(products).where(isNull(products.deletedAt));

        // Apply filters
        const conditions = [isNull(products.deletedAt)];

        if (filters.category) {
            conditions.push(eq(products.category, filters.category));
        }

        if (filters.search) {
            conditions.push(ilike(products.name, `%${filters.search}%`));
        }

        if (filters.color) {
            conditions.push(ilike(products.color, `%${filters.color}%`));
        }

        if (filters.material) {
            conditions.push(ilike(products.material, `%${filters.material}%`));
        }

        // Size filter - check if JSONB array contains the size
        if (filters.size) {
            conditions.push(sql`${products.sizes} @> ${JSON.stringify([filters.size])}`);
        }

        // Apply all conditions
        query = db.select().from(products).where(and(...conditions));

        // Apply sorting
        const orderColumn = {
            name: products.name,
            stock: products.stock,
            price: products.price,
            createdAt: products.createdAt,
        }[sortBy];

        const orderFn = order === 'asc' ? asc : desc;
        const sortedQuery = query.orderBy(orderFn(orderColumn));

        // Apply pagination
        const offset = (page - 1) * limit;
        const paginatedProducts = await sortedQuery.limit(limit).offset(offset);

        // Get total count for pagination metadata
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(products)
            .where(and(...conditions));

        const totalItems = Number(count);
        const totalPages = Math.ceil(totalItems / limit);

        const pagination: PaginationMeta = {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };

        return {
            products: paginatedProducts,
            pagination,
        };
    }

    /**
     * Get single product by ID
     */
    async getProductById(id: string): Promise<Product> {
        const [product] = await db
            .select()
            .from(products)
            .where(and(eq(products.id, id), isNull(products.deletedAt)))
            .limit(1);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product;
    }

    /**
     * Create new product
     */
    async createProduct(data: NewProduct, userId?: string): Promise<Product> {
        // Check for duplicate product name
        const [existing] = await db
            .select()
            .from(products)
            .where(and(eq(products.name, data.name), isNull(products.deletedAt)))
            .limit(1);

        if (existing) {
            throw new ConflictError('Product with this name already exists');
        }

        // Create product with audit fields
        const [newProduct] = await db
            .insert(products)
            .values({
                ...data,
                createdBy: userId,
                updatedBy: userId,
            })
            .returning();

        return newProduct;
    }

    /**
     * Update existing product
     */
    async updateProduct(
        id: string,
        data: Partial<NewProduct>,
        userId?: string
    ): Promise<Product> {
        // Check if product exists
        await this.getProductById(id);

        // If name is being updated, check for duplicates
        if (data.name) {
            const [existing] = await db
                .select()
                .from(products)
                .where(
                    and(
                        eq(products.name, data.name),
                        sql`${products.id} != ${id}`,
                        isNull(products.deletedAt)
                    )
                )
                .limit(1);

            if (existing) {
                throw new ConflictError('Product with this name already exists');
            }
        }

        // Update product
        const [updatedProduct] = await db
            .update(products)
            .set({
                ...data,
                updatedBy: userId,
                updatedAt: new Date(),
            })
            .where(eq(products.id, id))
            .returning();

        return updatedProduct;
    }

    /**
     * Delete product (soft delete)
     */
    async deleteProduct(id: string): Promise<void> {
        // Check if product exists
        await this.getProductById(id);

        // Soft delete by setting deletedAt timestamp
        const [result] = await db
            .update(products)
            .set({ deletedAt: new Date() })
            .where(eq(products.id, id))
            .returning();

        if (!result) {
            throw new NotFoundError('Product not found');
        }
    }
}

export const productsService = new ProductsService();
