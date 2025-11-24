import { Request } from 'express';
import { User } from '../db/schema';

/**
 * Extended Express Request with user information
 */
export interface AuthRequest extends Request {
    user?: User;
}

/**
 * Product filter parameters
 */
export interface ProductFilters {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    size?: string;
    color?: string;
    material?: string;
    sortBy?: 'name' | 'stock' | 'price' | 'createdAt';
    order?: 'asc' | 'desc';
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * JWT Payload
 */
export interface JWTPayload {
    userId: string;
    role: string;
}
