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

/**
 * Custom hook for fetching US market data with search support
 * @returns {Object} US market data state and functions
 */
export const useUSMarketData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const fetchUSMarketData = useCallback(async (searchQuery = null, symbols = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (symbols) {
        params.append('symbols', symbols);
      }
      
      const url = `/api/us-market${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch US market data');
      }
      
      const result = await response.json();
      
      if (searchQuery) {
        // Store search results separately
        setSearchResults({
          query: searchQuery,
          results: result.data.stocks || [],
          timestamp: new Date(result.timestamp),
          source: result.source
        });
      } else {
        // Update main data
        setData(result.data);
        setSource(result.source);
        setLastUpdated(new Date(result.timestamp));
      }
      
    } catch (err) {
      console.error('Error fetching US market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for stocks by query
  const searchStocks = useCallback(async (query) => {
    if (!query || query.length < 2) return;
    
    await fetchUSMarketData(query);
  }, [fetchUSMarketData]);

  // Fetch specific symbols
  const fetchSymbols = useCallback(async (symbolList) => {
    if (!symbolList || symbolList.length === 0) return;
    
    const symbolsString = Array.isArray(symbolList) ? symbolList.join(',') : symbolList;
    await fetchUSMarketData(null, symbolsString);
  }, [fetchUSMarketData]);

  // Clear search results and return to default data
  const clearSearch = useCallback(() => {
    setSearchResults(null);
    if (!data) {
      fetchUSMarketData(); // Reload default data if not already loaded
    }
  }, [data, fetchUSMarketData]);

  // Fetch data only once on component mount
  useEffect(() => {
    fetchUSMarketData();
  }, [fetchUSMarketData]);

  return {
    data,
    loading,
    error,
    source,
    lastUpdated,
    searchResults,
    refetch: fetchUSMarketData,
    searchStocks,
    fetchSymbols,
    clearSearch
  };
};

/**
 * Custom hook for fetching crypto market data with search support
 * @returns {Object} Crypto market data state and functions
 */
export const useCryptoMarketData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const fetchCryptoMarketData = useCallback(async (searchQuery = null, symbols = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (symbols) {
        params.append('symbols', symbols);
      }
      
      const url = `/api/crypto-market${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto market data');
      }
      
      const result = await response.json();
      
      if (searchQuery) {
        // Store search results separately
        setSearchResults({
          query: searchQuery,
          results: result.data.cryptos || [],
          timestamp: new Date(result.timestamp),
          source: result.source
        });
      } else {
        // Update main data
        setData(result.data);
        setSource(result.source);
        setLastUpdated(new Date(result.timestamp));
      }
      
    } catch (err) {
      console.error('Error fetching crypto market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for cryptos by query
  const searchCryptos = useCallback(async (query) => {
    if (!query || query.length < 2) return;
    
    await fetchCryptoMarketData(query);
  }, [fetchCryptoMarketData]);

  // Fetch specific symbols
  const fetchSymbols = useCallback(async (symbolList) => {
    if (!symbolList || symbolList.length === 0) return;
    
    const symbolsString = Array.isArray(symbolList) ? symbolList.join(',') : symbolList;
    await fetchCryptoMarketData(null, symbolsString);
  }, [fetchCryptoMarketData]);

  // Clear search results and return to default data
  const clearSearch = useCallback(() => {
    setSearchResults(null);
    if (!data) {
      fetchCryptoMarketData(); // Reload default data if not already loaded
    }
  }, [data, fetchCryptoMarketData]);

  // Fetch data only once on component mount
  useEffect(() => {
    fetchCryptoMarketData();
  }, [fetchCryptoMarketData]);

  return {
    data,
    loading,
    error,
    source,
    lastUpdated,
    searchResults,
    refetch: fetchCryptoMarketData,
    searchCryptos,
    fetchSymbols,
    clearSearch
  };
};