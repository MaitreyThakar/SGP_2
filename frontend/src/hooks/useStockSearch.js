'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook to search for stock symbols and train models
 * @returns {Object} { searchSymbol, trainAndPredict, searching, training, searchResult, prediction, error }
 */
export function useStockSearch() {
  const [searching, setSearching] = useState(false);
  const [training, setTraining] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Search for a stock symbol
   */
  const searchSymbol = useCallback(async (symbol, market = 'us') => {
    try {
      setSearching(true);
      setError(null);
      setSearchResult(null);

      if (!symbol || symbol.trim() === '') {
        throw new Error('Please enter a stock symbol');
      }

      const response = await fetch(
        `/api/search?symbol=${encodeURIComponent(symbol.toUpperCase())}&market=${market}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Symbol not found');
      }

      if (!data.found) {
        throw new Error(`Symbol "${symbol.toUpperCase()}" not found in ${market} market`);
      }

      setSearchResult(data);
      return data;
    } catch (err) {
      console.error('Error searching symbol:', err);
      setError(err.message);
      setSearchResult(null);
      throw err;
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Train model and get prediction for a symbol
   */
  const trainAndPredict = useCallback(async (symbol, market = 'us', period = '7d') => {
    try {
      setTraining(true);
      setError(null);
      setPrediction(null);

      if (!symbol || symbol.trim() === '') {
        throw new Error('Please enter a stock symbol');
      }

      console.log(`Training model and generating prediction for ${symbol}...`);

      // Call backend to train model and get prediction
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          market: market.toLowerCase(),
          period: period,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prediction');
      }

      const data = await response.json();
      setPrediction(data);
      console.log('Prediction generated successfully:', data);
      return data;
    } catch (err) {
      console.error('Error training and predicting:', err);
      setError(err.message);
      setPrediction(null);
      throw err;
    } finally {
      setTraining(false);
    }
  }, []);

  /**
   * Search and then train in one go
   */
  const searchAndTrain = useCallback(async (symbol, market = 'us', period = '7d') => {
    try {
      // First search to validate symbol
      const searchData = await searchSymbol(symbol, market);
      
      if (searchData && searchData.found) {
        // Then train and predict
        const predictionData = await trainAndPredict(symbol, market, period);
        return { search: searchData, prediction: predictionData };
      }
      
      throw new Error('Symbol not found');
    } catch (err) {
      throw err;
    }
  }, [searchSymbol, trainAndPredict]);

  /**
   * Clear all states
   */
  const reset = useCallback(() => {
    setSearchResult(null);
    setPrediction(null);
    setError(null);
    setSearching(false);
    setTraining(false);
  }, []);

  return {
    searchSymbol,
    trainAndPredict,
    searchAndTrain,
    reset,
    searching,
    training,
    searchResult,
    prediction,
    error,
  };
}
