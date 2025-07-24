'use client';

import { useState } from 'react';
import StockCard from '../common/StockCard';

const WatchList = () => {
  const [watchlist] = useState([
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      marketCap: 16500000000000
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3421.20,
      change: -12.30,
      changePercent: -0.36,
      volume: 987654,
      marketCap: 12800000000000
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank Limited',
      price: 1654.85,
      change: 8.75,
      changePercent: 0.53,
      volume: 2345678,
      marketCap: 9200000000000
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1789.40,
      change: 15.60,
      changePercent: 0.88,
      volume: 1876543,
      marketCap: 7400000000000
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.23,
      change: 2.45,
      changePercent: 1.42,
      volume: 45678901,
      marketCap: 2800000000000
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43567.89,
      change: 1234.56,
      changePercent: 2.92,
      volume: 12345678901,
      marketCap: 850000000000
    }
  ]);

  const handleStockClick = (stock) => {
    console.log('Stock clicked:', stock.symbol);
    // Navigate to detailed view
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Watchlist</h2>
            <p className="text-sm text-gray-600 mt-1">Track your favorite stocks and cryptocurrencies</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{watchlist.length} items</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors">
              Manage List
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {watchlist.map((stock) => (
            <div key={stock.symbol} className="transform hover:scale-105 transition-transform duration-200">
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
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Last updated: Just now</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Add New Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchList;
