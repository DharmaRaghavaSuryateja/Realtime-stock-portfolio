import { errorResponse } from '@/utils/response';
export class AppError extends Error {
    constructor(message, statusCode = 500, metadata = {}) {
        super(message);
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}
export const globalErrorHandler = (err, req, res, next) => {
    let error;
    if (err instanceof AppError) {
        error = err;
    }
    else {
        error = new AppError(err.message || 'Something went wrong. Please try again later', 500);
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, error.message, error.statusCode, error.metadata);
};
export const notFoundHandler = (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
