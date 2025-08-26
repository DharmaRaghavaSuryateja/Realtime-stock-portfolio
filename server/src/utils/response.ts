import { IUser } from '../models/User';
import jwtService from '../services/jwtService';
import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  metadata?: Record<string, any>;
}

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  return res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
  metadata: Record<string, any> = {},
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    metadata,
  };

  return res.status(statusCode).json(response);
}

export function toUserResponse(user: IUser): Omit<IUser, 'password'> {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    local_currency: user.local_currency,
    deleted: user.deleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function generateTokens(user: IUser) {
  const accessToken = jwtService.generateAccessToken({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    local_currency: user.local_currency,
  });

  const refreshToken = jwtService.generateRefreshToken({
    userId: user.id,
  });

  return { accessToken, refreshToken };
}
