/**
 * Standard response formatters for consistent API responses
 */

interface SuccessResponse<T> {
    success: true;
    message?: string;
    data: T;
}

interface ErrorResponse {
    success: false;
    message: string;
    errors?: any;
}

/**
 * Format successful response
 */
export function successResponse<T>(data: T, message?: string): SuccessResponse<T> {
    return {
        success: true,
        ...(message && { message }),
        data,
    };
}

/**
 * Format error response
 */
export function errorResponse(message: string, errors?: any): ErrorResponse {
    return {
        success: false,
        message,
        ...(errors && { errors }),
    };
}
