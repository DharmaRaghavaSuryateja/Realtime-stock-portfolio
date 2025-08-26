import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export class AppError extends Error {
  public statusCode: number;
  public metadata: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    metadata: Record<string, any> = {},
  ) {
    super(message);
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    error = new AppError(
      err.message || 'Something went wrong. Please try again later',
      500,
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 403);
  }

  return errorResponse(res, error.message, error.statusCode, error.metadata);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
