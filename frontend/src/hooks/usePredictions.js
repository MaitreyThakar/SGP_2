'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to fetch and manage predictions from backend
 * @param {string} market - Market type ('us', 'indian', 'crypto')
 * @param {string} period - Prediction period ('1d', '7d', '30d', '90d')
 * @returns {Object} { predictions, loading, error, refetch }
 */
export function usePredictions(market = 'us', period = '7d') {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/predictions?market=${market}&period=${period}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err.message);
      // Fallback to empty array instead of crashing
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, [market, period]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const refetch = useCallback(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return { predictions, loading, error, refetch };
}

/**
 * Custom hook to fetch a single stock prediction
 * @param {string} symbol - Stock symbol
 * @param {string} market - Market type
 * @returns {Object} { prediction, loading, error, refetch }
 */
export function usePrediction(symbol, market = 'us') {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrediction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!symbol) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          market: market.toLowerCase(),
          period: '7d',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [symbol, market]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  const refetch = useCallback(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  return { prediction, loading, error, refetch };
}
