import { successResponse } from '@/utils/response';
import { getStocksList, getStockDetailsBySymbol, searchStocksByQuery, } from '@/services/yahooService';
import { setCache } from '@/utils/cache';
export const getDashboardDisplayStocks = async (req, res, next) => {
    const { type } = req.query;
    const stocks = await getStocksList(type);
    setCache(req, null, { stocks }, true);
    return successResponse(res, { stocks });
};
export const getStockInfo = async (req, res, next) => {
    const { stockCode } = req.params;
    const stockInfo = await getStockDetailsBySymbol([stockCode]);
    return successResponse(res, {
        stock: stockInfo?.[0],
    });
};
export const searchStocks = async (req, res, next) => {
    const { query } = req.query;
    const searchResults = await searchStocksByQuery(query);
    const stockInfo = searchResults.length
        ? await getStockDetailsBySymbol(searchResults.map((stock) => stock.symbol))
        : [];
    setCache(req, null, stockInfo, true);
    return successResponse(res, stockInfo);
};
