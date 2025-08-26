'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { StockType } from '@/types'

interface TopTabBarProps {
  activeTab: StockType
  onTabChange: (tab: StockType) => void
  className?: string
}

const tabs = [
  { id: 'most_actives' as StockType, label: 'Most Actives' },
  { id: 'day_gainers' as StockType, label: 'Day Gainers' },
  { id: 'day_losers' as StockType, label: 'Day Losers' },
]

export const TopTabBar: React.FC<TopTabBarProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('flex space-x-1 p-1 bg-gray-800 rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            activeTab === tab.id
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 