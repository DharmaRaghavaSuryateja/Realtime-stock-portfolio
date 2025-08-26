import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, UserRole } from '../models';
import {
  generateTokens,
  successResponse,
  toUserResponse,
} from '../utils/response';
import jwtService from '../services/jwtService';
import { AppError } from '../middlewares';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password, local_currency = 'USD' } = req.body;
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
    paranoid: false,
  });

  if (existingUser) {
    return next(new AppError('username or email already exists', 409));
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: UserRole.USER,
    local_currency,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  return successResponse(
    res,
    {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    },
    201,
  );
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_identifier, password } = req.body;

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: user_identifier }, { username: user_identifier }],
    },
  });

  if (!user) {
    return next(new AppError('Invalid username or password', 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid username or password', 401));
  }

  const { accessToken, refreshToken } = generateTokens(user);

  return successResponse(res, {
    user: toUserResponse(user),
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.body;

  const decoded = jwtService.verifyRefreshToken(refreshToken);

  const user = await User.findOne({
    where: { id: decoded.userId },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const { accessToken } = generateTokens(user);

  return successResponse(res, {
    accessToken,
  });
};
