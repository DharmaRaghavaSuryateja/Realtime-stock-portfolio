'use client'

import React from 'react'
import { Stock, StockSearchResult } from '@/types'
import currencySymbolMap from 'currency-symbol-map'
import { format } from 'date-fns'

interface StockTableProps {
  stocks: (Stock | StockSearchResult)[]
  onAddToPortfolio: (stock: Stock | StockSearchResult) => void
  isLoading?: boolean
  className?: string
}

export const StockTable: React.FC<StockTableProps> = ({
  stocks,
  onAddToPortfolio,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (stocks.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400 text-lg">No stocks found</p>
      </div>
    )
  }

  const isFullStock = (stock: Stock | StockSearchResult): stock is Stock => {
    return 'currentMarketPrice' in stock
  }

  const formatEarningsDate = (timestamp: number | undefined) => {
    if (!timestamp) return '-'
    try {
      const date = new Date(timestamp * 1000)
      return format(date, 'MMM, do, yyyy')
    } catch {
      return '-'
    }
  }

  const getCurrencySymbol = (currencyCode: string) => {
    return currencySymbolMap(currencyCode) || currencyCode
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-800 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                P/E Ratio
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Latest Earnings
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-gray-800 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{stock.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{stock.name}</div>
                  <div className="text-sm text-gray-400">{stock.sector}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-white">
                    {isFullStock(stock) ? `${getCurrencySymbol(stock.currency)}${stock.currentMarketPrice.toFixed(2)}` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-300">
                    {isFullStock(stock) && stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-300">
                    {isFullStock(stock) ? formatEarningsDate(stock.latestEarnings) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onAddToPortfolio(stock)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    Add to Portfolio
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 