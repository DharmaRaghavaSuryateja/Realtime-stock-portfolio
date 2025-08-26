import { AppError } from '@/middlewares';
import yahooFinance from 'yahoo-finance2';
export const stockTypes = [
    'most_actives',
    'day_gainers',
    'day_losers',
];
async function getStockSector(symbol) {
    try {
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: ['assetProfile'],
        });
        return result.assetProfile?.sector || '';
    }
    catch {
        return '';
    }
}
async function processStockData(stock) {
    const info = {
        name: stock.longName ?? stock.shortName,
        symbol: stock.symbol,
        currentMarketPrice: stock.regularMarketPrice,
        currency: stock.currency,
        peRatio: stock.trailingPE,
        latestEarnings: stock.earningsTimestamp ?? stock.earningsTimestampStart,
    };
    const sector = await getStockSector(stock.symbol);
    return { ...info, sector };
}
export async function getStockDetailsBySymbol(symbols) {
    try {
        const response = await yahooFinance.quote(symbols);
        const quotes = response.filter((stock) => stock.quoteType === 'EQUITY');
        return Promise.all(quotes.map(processStockData));
    }
    catch (err) {
        throw new AppError('Unable to fetch stocks. Please try again later', 503);
    }
}
export async function getStocksList(type = 'most_actives', region = 'US', count = 20) {
    try {
        const screener = await yahooFinance.screener({
            scrIds: type,
            count,
            lang: 'en-US',
            region,
        });
        const quotes = screener.quotes.filter((stock) => stock.quoteType === 'EQUITY');
        return Promise.all(quotes.map(processStockData));
    }
    catch (err) {
        throw new AppError('Unable to fetch stocks. Please try again later', 503);
    }
}
export async function searchStocksByQuery(query) {
    try {
        const results = await yahooFinance.search(query);
        const quotes = results.quotes.filter((stock) => stock?.quoteType === 'EQUITY');
        return quotes.map((stock) => ({
            name: stock.longname,
            symbol: stock.symbol,
            sector: stock.sector,
        }));
    }
    catch (err) {
        throw new AppError('Unable to fetch stocks. Please try again later', 503);
    }
}
