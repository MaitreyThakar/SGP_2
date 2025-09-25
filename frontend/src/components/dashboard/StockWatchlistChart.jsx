'use client';

import { useState, useEffect } from 'react';
import { useMarketData, useStockHistory } from '@/hooks/useMarketData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

const StockWatchlistChart = () => {
  const { data: marketData, loading: marketLoading } = useMarketData();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { data: chartData, loading: chartLoading, source } = useStockHistory(selectedStock);
  
  const watchlistStocks = marketData?.watchlistStocks || [];

  // Set default selected stock when data loads
  useEffect(() => {
    if (watchlistStocks.length > 0 && !watchlistStocks.find(s => s.symbol === selectedStock)) {
      setSelectedStock(watchlistStocks[0].symbol);
    }
  }, [watchlistStocks, selectedStock]);

  // Calculate the price change and percentage
  const calculateChange = () => {
    if (chartData.length < 2) return { change: '0.00', percentage: '0.00' };
    
    const latestPrice = chartData[chartData.length - 1].price;
    const previousPrice = chartData[0].price;
    const change = latestPrice - previousPrice;
    const percentage = (change / previousPrice) * 100;
    
    return {
      change: change.toFixed(2),
      percentage: percentage.toFixed(2)
    };
  };

  const { change, percentage } = calculateChange();
  const isPositive = parseFloat(change) >= 0;
  const selectedStockData = watchlistStocks.find(stock => stock.symbol === selectedStock);
  const selectedStockName = selectedStockData?.name || selectedStock;
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;

  if (marketLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-2xl font-bold text-white">Stock Price Trends</h3>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading stock data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Stock Price Trends</h3>
            <p className="text-sm text-gray-300 mt-1">Historical price performance from your watchlist</p>
          </div>
          {source && (
            <span className={`px-3 py-1 rounded-full text-xs ${
              source === 'finnhub' 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-yellow-600/20 text-yellow-400'
            }`}>
              {source === 'finnhub' ? 'Live Data' : 'Demo Data'}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown and Info */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Stock Selector Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center justify-between w-72 px-4 py-3 text-white bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600/50 transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="text-left">
                <span className="font-semibold">{selectedStock}</span>
                <div className="text-xs text-gray-300 truncate">{selectedStockName}</div>
              </div>
              <ChevronDown className={`h-5 w-5 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-xl">
                <ul className="py-2 max-h-60 overflow-auto">
                  {watchlistStocks.map((stock) => (
                    <li 
                      key={stock.symbol}
                      className={`px-4 py-3 hover:bg-gray-700 text-gray-200 cursor-pointer transition-colors duration-150 ${
                        selectedStock === stock.symbol ? 'bg-blue-600/20 text-blue-300' : ''
                      }`}
                      onClick={() => {
                        setSelectedStock(stock.symbol);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-gray-400">{stock.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Stock Price Info */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="text-2xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Period Change</p>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <p className={`text-xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{percentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <div className="h-96">
          {chartLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-300">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  tick={{ fill: '#9ca3af' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    color: '#f3f4f6'
                  }}
                  labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name={`${selectedStock} Price`}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Data shown for the last 7 trading days</span>
          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            View Detailed Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockWatchlistChart;