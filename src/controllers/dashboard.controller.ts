import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/response';

/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard and statistics endpoints
 */
export class DashboardController {
    /**
     * GET /api/dashboard/stats
     * Get overall dashboard statistics
     */
    async getStats(_req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await dashboardService.getDashboardStats();

            res.status(200).json(successResponse(stats));
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/dashboard/low-stock
     * Get low stock products
     */
    async getLowStock(req: Request, res: Response, next: NextFunction) {
        try {
            const threshold = req.query.threshold ? Number(req.query.threshold) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;

            const products = await dashboardService.getLowStockProducts(threshold, limit);

            res.status(200).json(successResponse(products));
        } catch (error) {
            next(error);
        }
    }
}

export const dashboardController = new DashboardController();
