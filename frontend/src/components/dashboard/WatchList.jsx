'use client';

import { useState } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import StockCard from '../common/StockCard';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const WatchList = () => {
  const { data, loading, error, source, lastUpdated, refetch } = useMarketData();
  const [refreshing, setRefreshing] = useState(false);

  const handleStockClick = (stock) => {
    console.log('Stock clicked:', stock.symbol);
    // Navigate to detailed view
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    return timestamp.toLocaleDateString();
  };

  if (loading && !data) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading market data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Failed to load watchlist data</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const watchlist = data?.watchlistStocks || [];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
            <p className="text-sm text-gray-300 mt-1">
              Track your favorite stocks and cryptocurrencies
              {source && (
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  source === 'finnhub' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {source === 'finnhub' ? 'Live Data' : 'Demo Data'}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              {watchlist.length} items
            </span>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium px-4 py-2 rounded-lg border border-blue-600/50 hover:bg-blue-600/10 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {watchlist.map((stock) => (
              <div key={stock.symbol} className="transform hover:scale-105 transition-all duration-300">
                <StockCard
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  volume={stock.volume}
                  marketCap={stock.marketCap}
                  onClick={() => handleStockClick(stock)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No stocks in your watchlist</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Stocks
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Add New Stock +
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchList;
