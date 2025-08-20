'use client';

import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import StockCard from '../common/StockCard';
import { LoadingCard } from '../common/Loading';

/**
 * US Market List component with dark theme
 * Displays NYSE/NASDAQ stocks with filtering and sorting capabilities
 * @returns {JSX.Element} US market stocks list
 */
const USMarketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const usStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.23,
      change: 2.45,
      changePercent: 1.42,
      volume: 45678901,
      marketCap: 2800000000000,
      sector: 'Technology',
      pe: 28.4,
      pb: 39.8
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 342.67,
      change: -1.23,
      changePercent: -0.36,
      volume: 23456789,
      marketCap: 2550000000000,
      sector: 'Technology',
      pe: 32.1,
      pb: 12.9
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.45,
      change: 3.21,
      changePercent: 2.37,
      volume: 34567890,
      marketCap: 1750000000000,
      sector: 'Technology',
      pe: 25.7,
      pb: 5.4
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 148.78,
      change: 5.67,
      changePercent: 3.96,
      volume: 56789012,
      marketCap: 1540000000000,
      sector: 'Consumer Discretionary',
      pe: 52.8,
      pb: 8.1
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 234.56,
      change: -8.90,
      changePercent: -3.65,
      volume: 78901234,
      marketCap: 745000000000,
      sector: 'Consumer Discretionary',
      pe: 73.2,
      pb: 14.6
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 456.78,
      change: 12.34,
      changePercent: 2.78,
      volume: 34567890,
      marketCap: 1120000000000,
      sector: 'Technology',
      pe: 64.5,
      pb: 28.3
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: 298.45,
      change: 4.56,
      changePercent: 1.55,
      volume: 23456789,
      marketCap: 760000000000,
      sector: 'Technology',
      pe: 22.8,
      pb: 4.9
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 167.89,
      change: 1.23,
      changePercent: 0.74,
      volume: 12345678,
      marketCap: 485000000000,
      sector: 'Financial Services',
      pe: 11.2,
      pb: 1.7
    }
  ];

  const sectors = ['all', 'Technology', 'Consumer Discretionary', 'Financial Services', 'Healthcare', 'Energy'];

  const filteredStocks = usStocks
    .filter(stock => 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(stock => filterBy === 'all' || stock.sector === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        case 'volume':
          return b.volume - a.volume;
        default:
          return 0;
      }
    });

  const handleStockClick = (stock) => {
    console.log('Stock clicked:', stock.symbol);
    // Navigate to detailed view
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search US stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white"
            >
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100 opacity-90">S&P 500</p>
              <p className="text-2xl font-bold text-white mt-1">4,327.89</p>
            </div>
            <div className="flex items-center text-red-200">
              <TrendingDown className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">-23.12 (-0.53%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 opacity-90">NASDAQ</p>
              <p className="text-2xl font-bold text-white mt-1">13,456.78</p>
            </div>
            <div className="flex items-center text-green-300">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">+45.67 (0.34%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-100 opacity-90">DOW JONES</p>
              <p className="text-2xl font-bold text-white mt-1">34,789.12</p>
            </div>
            <div className="flex items-center text-green-300">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">+112.34 (0.32%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Hours */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Market Status</h3>
            <p className="text-sm text-gray-400">US Stock Market</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">Market Open</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Closes in 3h 45m</p>
          </div>
        </div>
      </div>

      {/* Stocks List */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            US Stocks ({filteredStocks.length})
          </h2>
          <div className="flex items-center space-x-3 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-sm font-semibold text-red-400">NYSE/NASDAQ Listed</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                volume={stock.volume}
                marketCap={stock.marketCap}
                onClick={() => handleStockClick(stock)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default USMarketList;
