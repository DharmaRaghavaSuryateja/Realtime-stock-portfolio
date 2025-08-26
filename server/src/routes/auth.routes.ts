import { Router, Request, Response } from 'express';
import {
  loginUser,
  registerUser,
  refreshToken,
} from '../controllers/authController';
import {
  asyncHandler,
  validateRequest,
  authenticateToken,
} from '../middlewares';
import {
  loginUserValidator,
  registerUserValidator,
  refreshTokenValidator,
} from '../validators/auth.validator';

const router = Router();

router.post(
  '/login',
  validateRequest(loginUserValidator),
  asyncHandler(loginUser),
);

router.post(
  '/register',
  validateRequest(registerUserValidator),
  asyncHandler(registerUser),
);

router.post(
  '/refresh',
  validateRequest(refreshTokenValidator),
  asyncHandler(refreshToken),
);

export default router;
