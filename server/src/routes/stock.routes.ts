import { Router } from 'express';
import {
  getDashboardDisplayStocks,
  getStockInfo,
  searchStocks,
} from '@/controllers/stockController';
import { asyncHandler, validateRequest } from '@/middlewares';
import {
  stockCodeSchema,
  stockQuerySchema,
  stockTypeSchema,
} from '@/validators/stock.validator';
import { cacheMiddleware } from '@/utils/cache';

const router = Router();

router.get(
  '/',
  validateRequest({ query: stockTypeSchema }),
  cacheMiddleware(null, true),
  asyncHandler(getDashboardDisplayStocks),
);

router.get(
  '/search',
  validateRequest({ query: stockQuerySchema }),
  cacheMiddleware(null, true),
  asyncHandler(searchStocks),
);

router.get(
  '/:stockCode',
  validateRequest({ params: stockCodeSchema }),
  asyncHandler(getStockInfo),
);

export default router;
