import { AppError } from '../middlewares';
import yahooFinance from 'yahoo-finance2';

export const stockTypes = [
  'most_actives',
  'day_gainers',
  'day_losers',
] as const;

export type StockType = (typeof stockTypes)[number];

export interface StockInfo {
  name: string;
  symbol: string;
  currentMarketPrice: number;
  peRatio: number;
  latestEarnings: number;
  sector: string;
  currency: string;
}

interface SearchResult {
  name: string;
  symbol: string;
  sector: string;
}

async function getStockSector(symbol: string): Promise<string> {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['assetProfile'],
    });
    return result.assetProfile?.sector || '';
  } catch {
    return '';
  }
}

async function processStockData(stock: any): Promise<StockInfo> {
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

export async function getStockDetailsBySymbol(
  symbols: string[],
): Promise<StockInfo[]> {
  try {
    const response = await yahooFinance.quote(symbols);
    const quotes = response.filter((stock) => stock.quoteType === 'EQUITY');
    return Promise.all(quotes.map(processStockData));
  } catch (err) {
    throw new AppError('Unable to fetch stocks. Please try again later', 503);
  }
}

export async function getStocksList(
  type: StockType = 'most_actives',
  region: string = 'US',
  count: number = 20,
): Promise<StockInfo[]> {
  try {
    const screener = await yahooFinance.screener({
      scrIds: type,
      count,
      lang: 'en-US',
      region,
    });

    const quotes = screener.quotes.filter(
      (stock) => stock.quoteType === 'EQUITY',
    );

    return Promise.all(quotes.map(processStockData));
  } catch (err) {
    throw new AppError('Unable to fetch stocks. Please try again later', 503);
  }
}

export async function searchStocksByQuery(
  query: string,
): Promise<SearchResult[]> {
  try {
    const results = await yahooFinance.search(query);
    const quotes = results.quotes.filter(
      (stock: any) => stock?.quoteType === 'EQUITY',
    );

    return quotes.map(
      (stock: Record<string, any>): SearchResult => ({
        name: stock.longname,
        symbol: stock.symbol,
        sector: stock.sector,
      }),
    );
  } catch (err) {
    throw new AppError('Unable to fetch stocks. Please try again later', 503);
  }
}
