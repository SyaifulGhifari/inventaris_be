/**
 * Application constants
 */

/**
 * Valid product categories for textile warehouse
 */
export const VALID_CATEGORIES = ['Celana', 'Celana Jeans', 'Baju', 'Jaket'] as const satisfies readonly [string, ...string[]];

/**
 * Valid product sizes
 */
export const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const satisfies readonly [string, ...string[]];

/**
 * Valid user roles
 */
export const VALID_ROLES = ['admin', 'staff', 'manager'] as const;

/**
 * Default pagination values
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Low stock threshold
 */
export const LOW_STOCK_THRESHOLD = 10;

/**
 * Password hashing rounds
 */
export const BCRYPT_SALT_ROUNDS = 12;
