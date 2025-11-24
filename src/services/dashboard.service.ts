import { sql, isNull, lt, and } from 'drizzle-orm';
import { db } from '../config/database';
import { products } from '../db/schema';
import { LOW_STOCK_THRESHOLD } from '../utils/constants';

/**
 * Dashboard Service
 * Handles dashboard statistics and analytics
 */
export class DashboardService {
    /**
     * Get overall dashboard statistics
     */
    async getDashboardStats() {
        // Get total products count
        const [{ totalProducts }] = await db
            .select({ totalProducts: sql<number>`count(*)::int` })
            .from(products)
            .where(isNull(products.deletedAt));

        // Get total stock sum
        const [{ totalStock }] = await db
            .select({ totalStock: sql<number>`COALESCE(sum(stock), 0)::int` })
            .from(products)
            .where(isNull(products.deletedAt));

        // Get low stock products count
        const [{ lowStockProducts }] = await db
            .select({ lowStockProducts: sql<number>`count(*)::int` })
            .from(products)
            .where(and(isNull(products.deletedAt), lt(products.stock, LOW_STOCK_THRESHOLD)));

        // Get category statistics
        const categoryStats = await db
            .select({
                category: products.category,
                totalProducts: sql<number>`count(*)::int`,
                totalStock: sql<number>`COALESCE(sum(stock), 0)::int`,
            })
            .from(products)
            .where(isNull(products.deletedAt))
            .groupBy(products.category);

        return {
            totalProducts: Number(totalProducts),
            totalStock: Number(totalStock),
            lowStockProducts: Number(lowStockProducts),
            categoryStats: categoryStats.map(stat => ({
                category: stat.category,
                totalProducts: Number(stat.totalProducts),
                totalStock: Number(stat.totalStock),
            })),
        };
    }

    /**
     * Get low stock products
     */
    async getLowStockProducts(threshold: number = LOW_STOCK_THRESHOLD, limit: number = 20) {
        const lowStockProducts = await db
            .select({
                id: products.id,
                name: products.name,
                category: products.category,
                stock: products.stock,
                price: products.price,
                color: products.color,
                material: products.material,
            })
            .from(products)
            .where(and(isNull(products.deletedAt), lt(products.stock, threshold)))
            .orderBy(products.stock) // Order by stock ascending (lowest first)
            .limit(limit);

        return lowStockProducts.map(product => ({
            ...product,
            threshold,
        }));
    }
}

export const dashboardService = new DashboardService();
