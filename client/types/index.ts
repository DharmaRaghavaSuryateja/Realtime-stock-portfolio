export interface Stock {
  name: string
  symbol: string
  currentMarketPrice: number
  peRatio: number
  latestEarnings: number
  sector: string
  currency: string
}

export interface StockSearchResult {
  name: string
  symbol: string
  sector: string
}

export interface UserStock {
  user_stock_id: number
  user_id: number
  stock_code: string
  quantity: number
  purchase_price: number
  purchase_date: Date
  name: string
  symbol: string
  currentMarketPrice: number
  currency: string
  sector: string
  investment: number
  presentValue: number
  localInvestment: number
  localPresentValue: number
  gainLoss: number
  gainLossPercentage: number
  portfolioPercentage: number
  createdAt: Date
  updatedAt: Date
}

export interface SectorSummary {
  sector: string
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  totalGainLossPercentage: number
  currency: string
  stockCount: number
  portfolioPercentage: number
  stocks: UserStock[]
}

export interface PortfolioResponse {
  stocks: SectorSummary[]
  totalPortfolioInvestment: number
  totalCurrentValue: number
  totalGainLoss:number
  totalStocks: number
  localCurrency: string
}

export interface User {
  id: number
  username: string
  email: string
  role: 'user' | 'admin'
  local_currency: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  user_identifier: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  local_currency?: string
}

export interface AddToPortfolioData {
  stock_code: string
  quantity: number
  purchase_price: number
  purchase_date?: string
}

export type StockType = 'most_actives' | 'day_gainers' | 'day_losers'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  metadata?: Record<string, any>
} 