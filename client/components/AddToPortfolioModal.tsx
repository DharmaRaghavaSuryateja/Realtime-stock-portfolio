'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Stock, StockSearchResult, AddToPortfolioData } from '@/types'
import currencySymbolMap from 'currency-symbol-map'

interface AddToPortfolioModalProps {
  stock: Stock | StockSearchResult | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddToPortfolioData) => Promise<void>
  isLoading?: boolean
}

interface FormData {
  purchase_date: string
  quantity: string
  purchase_price: string
}

export const AddToPortfolioModal: React.FC<AddToPortfolioModalProps> = ({
  stock,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [error, setError] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const handleClose = () => {
    reset()
    setError('')
    onClose()
  }

  const handleFormSubmit = async (data: FormData) => {
    if (!stock) return
    
    try {
      setError('')
      await onSubmit({
        stock_code: stock.symbol,
        purchase_date: data.purchase_date,
        quantity: parseInt(data.quantity),
        purchase_price: parseFloat(data.purchase_price),
      })
      handleClose()
    } catch (err: any) {
      setError(err.message || 'Failed to add stock to portfolio')
    }
  }

  if (!isOpen || !stock) return null

  const isFullStock = 'currentMarketPrice' in stock
  const getCurrencySymbol = (currencyCode: string) => {
    return currencySymbolMap(currencyCode) || currencyCode
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add to Portfolio</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">{stock.symbol}</h3>
              <p className="text-gray-400 text-sm">{stock.name}</p>
            </div>
            <div className="text-right">
              {isFullStock && (
                <>
                  <p className="text-white font-medium">
                    {getCurrencySymbol(stock.currency)}{stock.currentMarketPrice.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm">{stock.currency}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-300 mb-2">
              Purchase Price
            </label>
            <input
              type="number"
              id="purchase_price"
              step="0.01"
              min="0.01"
              {...register('purchase_price', { 
                required: 'Purchase price is required',
                min: { value: 0.01, message: 'Purchase price must be greater than 0' }
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter purchase price"
            />
            {errors.purchase_price && (
              <p className="mt-1 text-sm text-red-500">{errors.purchase_price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-300 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchase_date"
              max={new Date().toISOString().split("T")[0]} 
              {...register('purchase_date', { required: 'Purchase date is required' })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.purchase_date && (
              <p className="mt-1 text-sm text-red-500">{errors.purchase_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              step="1"
              {...register('quantity', { 
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' }
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Adding...' : 'Add to Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 