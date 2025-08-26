import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import userStockRoutes from './user.stock.routes';
import stockRoutes from './stock.routes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/users/me', userRoutes);

router.use('/users/me/stocks', userStockRoutes);

router.use('/stocks', stockRoutes);

export default router;
