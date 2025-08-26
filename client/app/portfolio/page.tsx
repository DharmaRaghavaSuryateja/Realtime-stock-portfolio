"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { UserStock, SectorSummary, PortfolioResponse } from "@/types";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function PortfolioPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const REFRESH_INTERVAL = 15 * 1000;
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(
    new Set()
  );

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const fetchPortfolio = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const response = await apiClient.getUserStocks();
      setPortfolioData(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/");
        if (showLoader) toast.error("Session expired. Please sign in again.");
      } else {
        if (showLoader) toast.error("Failed to fetch portfolio");
        console.error("Error fetching portfolio:", error);
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [router]);

  const backgroundRefresh = useCallback(async () => {
    if (isAuthenticatedRef.current) {
      await fetchPortfolio(false);
    }
  }, [fetchPortfolio]);

  const startRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(backgroundRefresh, REFRESH_INTERVAL);
  }, [backgroundRefresh]);

  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }
      fetchPortfolio();
      startRefreshInterval();
    }
    return () => {
      stopRefreshInterval();
    };
  }, [isAuthenticated, authLoading, router, fetchPortfolio, startRefreshInterval, stopRefreshInterval]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRefreshInterval();
      } else if (isAuthenticated) {
        startRefreshInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startRefreshInterval, stopRefreshInterval, isAuthenticated]);

  const handleRemoveStock = async (id: number) => {
    try {
      await apiClient.removeFromPortfolio(id);
      await fetchPortfolio();
    } catch (err) {
      toast.error("Failed to remove stock");
    }
  };

  const toggleSector = (sector: string) => {
    const newExpandedSectors = new Set(expandedSectors);
    if (newExpandedSectors.has(sector)) {
      newExpandedSectors.delete(sector);
    } else {
      newExpandedSectors.add(sector);
    }
    setExpandedSectors(newExpandedSectors);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading your portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              No Portfolio Data
            </h1>
            <p className="text-gray-400">Unable to load your portfolio data.</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    stocks: sectorStocks,
    totalPortfolioInvestment,
    totalCurrentValue,
    totalGainLoss,
    totalStocks,
    localCurrency,
  } = portfolioData;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
          <p className="text-gray-400">Welcome back, {user?.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Total Investment
            </h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalPortfolioInvestment, localCurrency)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Total Current Value
            </h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalCurrentValue, localCurrency)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Total Gain/Loss
            </h3>
            <p
              className={`text-2xl font-bold ${
                totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(totalGainLoss, localCurrency)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Total Stocks
            </h3>
            <p className="text-2xl font-bold text-white">{totalStocks}</p>
          </div>
        </div>

        {sectorStocks.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <p className="text-gray-400 mb-4">Your portfolio is empty</p>
            <p className="text-gray-500 text-sm">
              Start building your portfolio by adding stocks from the home page.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sectorStocks.map((sector) => (
              <div
                key={sector.sector}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                <div
                  className="px-6 py-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => toggleSector(sector.sector)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-semibold text-white">
                        {sector.sector}
                      </h2>
                      <span className="text-sm text-gray-400">
                        ({sector.stockCount} stocks)
                      </span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Investment</p>
                        <p className="text-white font-medium">
                          {formatCurrency(
                            sector.totalInvestment,
                            sector.currency
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Current Value</p>
                        <p className="text-white font-medium">
                          {formatCurrency(
                            sector.totalPresentValue,
                            sector.currency
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Gain/Loss</p>
                        <p
                          className={`font-medium ${
                            sector.totalGainLoss >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(
                            sector.totalGainLoss,
                            sector.currency
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">%</p>
                        <p
                          className={`font-medium ${
                            sector.totalGainLossPercentage >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatPercentage(sector.totalGainLossPercentage)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Portfolio %</p>
                        <p className="text-white font-medium">
                          {sector.portfolioPercentage.toFixed(2)}%
                        </p>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            expandedSectors.has(sector.sector)
                              ? "rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedSectors.has(sector.sector) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Shares
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Purchase Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Current Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Investment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Current Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Gain/Loss
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Portfolio %
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {sector.stocks.map((stock) => (
                          <tr
                            key={stock.user_stock_id}
                            className="hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {stock.symbol}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {stock.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {stock.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatCurrency(
                                stock.purchase_price,
                                stock.currency
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatCurrency(
                                stock.currentMarketPrice,
                                stock.currency
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatCurrency(stock.investment, stock.currency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {formatCurrency(
                                stock.presentValue,
                                stock.currency
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`text-sm font-medium ${
                                  stock.gainLoss >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {formatCurrency(stock.gainLoss, stock.currency)}
                              </div>
                              <div
                                className={`text-xs ${
                                  stock.gainLossPercentage >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {formatPercentage(stock.gainLossPercentage)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {stock.portfolioPercentage.toFixed(2)}%
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm text-white cursor-pointer"
                              onClick={() =>
                                handleRemoveStock(stock.user_stock_id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                className="w-5 h-5 text-red-400 text-bold"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
