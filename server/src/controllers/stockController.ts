import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils/response';
import {
  getStocksList,
  getStockDetailsBySymbol,
  searchStocksByQuery,
  StockType,
  StockInfo,
} from '../services/yahooService';
import { setCache } from '../utils/cache';

export const getDashboardDisplayStocks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { type } = req.query;
  const stocks = await getStocksList(type as StockType);
  setCache<{ [key: string]: StockInfo[] }>(req, null, { stocks }, true);
  return successResponse(res, { stocks });
};

export const getStockInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { stockCode } = req.params;

  const stockInfo = await getStockDetailsBySymbol([stockCode]);

  return successResponse(res, {
    stock: stockInfo?.[0],
  });
};

export const searchStocks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { query } = req.query;

  const searchResults = await searchStocksByQuery(query as string);

  const stockInfo = searchResults.length
    ? await getStockDetailsBySymbol(searchResults.map((stock) => stock.symbol))
    : [];
  setCache<StockInfo[]>(req, null, stockInfo, true);
  return successResponse(res, stockInfo);
};
