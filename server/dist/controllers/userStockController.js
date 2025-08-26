import { UserStock } from '@/models';
import { successResponse } from '@/utils/response';
import { AppError } from '@/middlewares';
import { getStockDetailsBySymbol } from '@/services/yahooService';
import _ from 'lodash';
import { Convert } from 'easy-currencies';
import { GET_MY_STOCKS_KEY, removeCache, setCache } from '@/utils/cache';
export const getMyStocks = async (req, res, next) => {
    const userId = req.user?.userId;
    const userLocalCurrency = req.user?.local_currency || 'INR';
    let totalPortfolioInvestment = 0, totalCurrentValue = 0, totalStocks = 0;
    const userstocks = await UserStock.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
    });
    const stocks = userstocks.length
        ? await getStockDetailsBySymbol(userstocks.map((stock) => stock.stock_code))
        : [];
    const stockPromises = userstocks.map(async (stock) => {
        const quote = stocks.find((item) => item.symbol === stock.stock_code);
        if (!quote) {
            return 0;
        }
        const convertedPurchasePrice = await Convert(stock.purchase_price)
            .from(quote.currency)
            .to(userLocalCurrency);
        return convertedPurchasePrice * stock.quantity;
    });
    const investments = await Promise.all(stockPromises);
    totalPortfolioInvestment = investments.reduce((sum, val) => sum + val, 0);
    const result = await Promise.all(userstocks.map(async (stock) => {
        const quote = stocks.find((item) => item.symbol === stock.stock_code);
        if (quote) {
            const investment = stock.purchase_price * stock.quantity;
            const presentValue = quote.currentMarketPrice * stock.quantity;
            const localInvestment = (await Convert(stock.purchase_price)
                .from(quote.currency)
                .to(userLocalCurrency)) * stock.quantity;
            const localPresentValue = (await Convert(quote.currentMarketPrice)
                .from(quote.currency)
                .to(userLocalCurrency)) * stock.quantity;
            const gainLoss = presentValue - investment;
            const gainLossPercentage = investment > 0 ? (gainLoss / investment) * 100 : 0;
            const portfolioPercentage = totalPortfolioInvestment > 0
                ? (localInvestment / totalPortfolioInvestment) * 100
                : 0;
            totalStocks += stock.quantity;
            totalCurrentValue += localPresentValue;
            return {
                ...stock.dataValues,
                ...quote,
                investment: parseFloat(investment.toFixed(2)),
                presentValue: parseFloat(presentValue.toFixed(2)),
                localInvestment: parseFloat(localInvestment.toFixed(2)),
                localPresentValue: parseFloat(localPresentValue.toFixed(2)),
                gainLoss: parseFloat(gainLoss.toFixed(2)),
                gainLossPercentage: parseFloat(gainLossPercentage.toFixed(2)),
                portfolioPercentage: parseFloat(portfolioPercentage.toFixed(2)),
            };
        }
    }));
    const sectorGroups = _.groupBy(result, 'sector');
    const sectorSummaries = Object.entries(sectorGroups).map(([sector, stocks]) => {
        const totalInvestment = _.sumBy(stocks, 'localInvestment');
        const totalPresentValue = _.sumBy(stocks, 'localPresentValue');
        const totalStocks = _.sumBy(stocks, 'quantity');
        const totalGainLoss = totalPresentValue - totalInvestment;
        const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
        const sectorPortfolioPercentage = _.sumBy(stocks, 'portfolioPercentage');
        return {
            sector,
            totalInvestment: parseFloat(totalInvestment.toFixed(2)),
            totalPresentValue: parseFloat(totalPresentValue.toFixed(2)),
            totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
            totalGainLossPercentage: parseFloat(totalGainLossPercentage.toFixed(2)),
            currency: userLocalCurrency,
            stockCount: totalStocks,
            portfolioPercentage: parseFloat(sectorPortfolioPercentage.toFixed(2)),
            stocks: stocks,
        };
    });
    const response = {
        stocks: sectorSummaries,
        totalPortfolioInvestment: parseFloat(totalPortfolioInvestment.toFixed(2)),
        totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
        totalGainLoss: totalCurrentValue - totalPortfolioInvestment,
        totalStocks,
        localCurrency: userLocalCurrency,
    };
    setCache(req, GET_MY_STOCKS_KEY, response);
    return successResponse(res, response);
};
export const createMyStock = async (req, res, next) => {
    const userId = req.user?.userId;
    const { stock_code, quantity, purchase_price, purchase_date } = req.body;
    const stockDetails = await getStockDetailsBySymbol([stock_code]);
    if (!stockDetails || stockDetails.length === 0) {
        return next(new AppError('Stock not found', 404));
    }
    const stock = await UserStock.create({
        user_id: userId,
        stock_code,
        quantity,
        purchase_price,
        purchase_date: purchase_date || new Date(),
    });
    removeCache(req, GET_MY_STOCKS_KEY);
    return successResponse(res, { stock }, 201);
};
export const deleteMyStock = async (req, res, next) => {
    const userId = req.user?.userId;
    const { stockId } = req.params;
    const stock = await UserStock.findOne({
        where: { user_stock_id: stockId, user_id: userId },
    });
    if (!stock) {
        return next(new AppError('Stock not found', 404));
    }
    await stock.destroy();
    removeCache(req, GET_MY_STOCKS_KEY);
    return successResponse(res, {});
};
