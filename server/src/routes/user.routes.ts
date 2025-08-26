import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
} from '../controllers/userController';
import {
  asyncHandler,
  authenticateToken,
  validateRequest,
} from '../middlewares';
import { updateProfileValidator } from '../validators/user.validator';

const router = Router();

router.get('/', authenticateToken, asyncHandler(getMyProfile));

router.patch(
  '/',
  authenticateToken,
  validateRequest(updateProfileValidator),
  asyncHandler(updateMyProfile),
);

router.delete('/', authenticateToken, asyncHandler(deleteMyProfile));

export default router;
