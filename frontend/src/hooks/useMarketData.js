'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching market data once and managing state
 * @returns {Object} Market data state and functions
 */
export const useMarketData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/market-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const result = await response.json();
      
      setData(result.data);
      setSource(result.source);
      setLastUpdated(new Date(result.timestamp));
      
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data only once on component mount
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return {
    data,
    loading,
    error,
    source,
    lastUpdated,
    refetch: fetchMarketData
  };
};

/**
 * Custom hook for fetching historical stock data
 * @param {string} symbol - Stock symbol
 * @returns {Object} Historical data state and functions
 */
export const useStockHistory = (symbol) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  const fetchHistoricalData = useCallback(async (stockSymbol) => {
    if (!stockSymbol) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stock-history?symbol=${stockSymbol}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const result = await response.json();
      
      setData(result.data);
      setSource(result.source);
      
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (symbol) {
      fetchHistoricalData(symbol);
    }
  }, [symbol, fetchHistoricalData]);

  return {
    data,
    loading,
    error,
    source,
    refetch: () => fetchHistoricalData(symbol)
  };
};