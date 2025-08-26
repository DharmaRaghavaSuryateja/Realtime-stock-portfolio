"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { TopTabBar } from "@/components/TopTabBar";
import { StockTable } from "@/components/StockTable";
import { AddToPortfolioModal } from "@/components/AddToPortfolioModal";
import { AuthModal } from "@/components/AuthModal";
import {
  Stock,
  StockSearchResult,
  StockType,
  AddToPortfolioData,
} from "@/types";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const REFRESH_INTERVAL = 15 * 1000;
  const [stocks, setStocks] = useState<(Stock | StockSearchResult)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<StockType>("most_actives");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<
    Stock | StockSearchResult | null
  >(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAddingToPortfolio, setIsAddingToPortfolio] = useState(false);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTabRef = useRef(activeTab);
  const currentSearchQueryRef = useRef(searchQuery);

  useEffect(() => {
    currentTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    currentSearchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const fetchStocks = useCallback(
    async (type: StockType, showLoader = true) => {
      try {
        if (showLoader) setIsLoading(true);
        const response = await apiClient.getStocks(type);
        setStocks(response.data.data.stocks);
      } catch (error: any) {
        if (showLoader) toast.error("Failed to fetch stocks");
        console.error("Error fetching stocks:", error);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    []
  );

  const searchStocks = useCallback(async (query: string, showLoader = true) => {
    if (query.length < 3) return;

    try {
      if (showLoader) setIsLoading(true);
      const response = await apiClient.searchStocks(query);
      setStocks(response.data.data);
    } catch (error: any) {
      if (showLoader) toast.error("Failed to search stocks");
      console.error("Error searching stocks:", error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  const backgroundRefresh = useCallback(async () => {
    const currentQuery = currentSearchQueryRef.current;
    const currentTab = currentTabRef.current;

    if (currentQuery.length >= 3) {
      await searchStocks(currentQuery, false);
    } else {
      await fetchStocks(currentTab, false);
    }
  }, [fetchStocks, searchStocks]);

  const startRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    refreshIntervalRef.current = setInterval(
      backgroundRefresh,
      REFRESH_INTERVAL
    );
  }, [backgroundRefresh]);

  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => searchStocks(query), 300),
    [searchStocks]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      debouncedSearch(query);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    fetchStocks(activeTab);
  };

  const handleTabChange = (tab: StockType) => {
    setActiveTab(tab);
    if (!searchQuery) {
      fetchStocks(tab);
    }
  };

  const handleAddToPortfolio = (stock: Stock | StockSearchResult) => {
    if (!isAuthenticated) {
      setSelectedStock(stock);
      setShowAuthModal(true);
      return;
    }

    setSelectedStock(stock);
    setShowAddModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedStock) {
      setShowAddModal(true);
    }
  };

  const handleAddToPortfolioSubmit = async (data: AddToPortfolioData) => {
    try {
      setIsAddingToPortfolio(true);
      await apiClient.addToPortfolio(data);
      toast.success("Stock added to portfolio successfully!");
      setShowAddModal(false);
      setSelectedStock(null);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to add stock to portfolio";
      toast.error(message);
      throw error;
    } finally {
      setIsAddingToPortfolio(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedStock(null);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    setSelectedStock(null);
  };

  useEffect(() => {
    fetchStocks(activeTab);
    startRefreshInterval();

    return () => {
      stopRefreshInterval();
    };
  }, [fetchStocks, activeTab, startRefreshInterval, stopRefreshInterval]);

  useEffect(() => {
    startRefreshInterval();
  }, [searchQuery, startRefreshInterval]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRefreshInterval();
      } else {
        startRefreshInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startRefreshInterval, stopRefreshInterval]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Yahoo Finance</h1>
          <p className="text-xl text-gray-400">
            Discover and track your favorite stocks
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <SearchBar
            onSearch={handleSearch}
            onClear={handleSearchClear}
            placeholder="Search Stocks ..."
          />
        </div>

        {!searchQuery && (
          <div className="mb-8">
            <TopTabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}

        <StockTable
          stocks={stocks}
          onAddToPortfolio={handleAddToPortfolio}
          isLoading={isLoading}
        />

        <AddToPortfolioModal
          stock={selectedStock}
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddToPortfolioSubmit}
          isLoading={isAddingToPortfolio}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
        />
      </main>
    </div>
  );
}
