'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

// Sample historical data for stocks
const stockHistoricalData = {
  'RELIANCE': [
    { date: 'Aug 1', price: 2420.50 },
    { date: 'Aug 2', price: 2435.75 },
    { date: 'Aug 3', price: 2445.20 },
    { date: 'Aug 4', price: 2430.10 },
    { date: 'Aug 5', price: 2440.60 },
    { date: 'Aug 6', price: 2455.30 },
    { date: 'Aug 7', price: 2462.15 },
    { date: 'Aug 8', price: 2448.50 },
    { date: 'Aug 9', price: 2456.75 }
  ],
  'TCS': [
    { date: 'Aug 1', price: 3380.25 },
    { date: 'Aug 2', price: 3395.50 },
    { date: 'Aug 3', price: 3410.75 },
    { date: 'Aug 4', price: 3400.30 },
    { date: 'Aug 5', price: 3415.80 },
    { date: 'Aug 6', price: 3425.60 },
    { date: 'Aug 7', price: 3435.90 },
    { date: 'Aug 8', price: 3415.40 },
    { date: 'Aug 9', price: 3421.20 }
  ],
  'HDFC': [
    { date: 'Aug 1', price: 1630.45 },
    { date: 'Aug 2', price: 1640.20 },
    { date: 'Aug 3', price: 1645.60 },
    { date: 'Aug 4', price: 1638.75 },
    { date: 'Aug 5', price: 1642.30 },
    { date: 'Aug 6', price: 1650.15 },
    { date: 'Aug 7', price: 1652.40 },
    { date: 'Aug 8', price: 1648.60 },
    { date: 'Aug 9', price: 1654.85 }
  ],
  'INFY': [
    { date: 'Aug 1', price: 1750.30 },
    { date: 'Aug 2', price: 1765.45 },
    { date: 'Aug 3', price: 1770.80 },
    { date: 'Aug 4', price: 1763.25 },
    { date: 'Aug 5', price: 1772.50 },
    { date: 'Aug 6', price: 1780.65 },
    { date: 'Aug 7', price: 1785.20 },
    { date: 'Aug 8', price: 1778.90 },
    { date: 'Aug 9', price: 1789.40 }
  ],
  'AAPL': [
    { date: 'Aug 1', price: 170.25 },
    { date: 'Aug 2', price: 171.50 },
    { date: 'Aug 3', price: 172.80 },
    { date: 'Aug 4', price: 171.75 },
    { date: 'Aug 5', price: 172.60 },
    { date: 'Aug 6', price: 173.45 },
    { date: 'Aug 7', price: 174.20 },
    { date: 'Aug 8', price: 173.80 },
    { date: 'Aug 9', price: 175.23 }
  ],
  'BTC': [
    { date: 'Aug 1', price: 42100.75 },
    { date: 'Aug 2', price: 42500.30 },
    { date: 'Aug 3', price: 42800.45 },
    { date: 'Aug 4', price: 42300.90 },
    { date: 'Aug 5', price: 42700.25 },
    { date: 'Aug 6', price: 43100.50 },
    { date: 'Aug 7', price: 43250.75 },
    { date: 'Aug 8', price: 43150.30 },
    { date: 'Aug 9', price: 43567.89 }
  ]
};

// List of stocks available in watchlist
const watchlistStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFC', name: 'HDFC Bank Limited' },
  { symbol: 'INFY', name: 'Infosys Limited' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'BTC', name: 'Bitcoin' }
];

/**
 * StockWatchlistChart component for displaying stock price trends
 * Shows historical price data for selected stocks from watchlist
 */
const StockWatchlistChart = () => {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [chartData, setChartData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Set the chart data when the selected stock changes
  useEffect(() => {
    const data = stockHistoricalData[selectedStock];
    if (data) {
      setChartData(data);
    }
  }, [selectedStock]);

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
  const selectedStockName = watchlistStocks.find(stock => stock.symbol === selectedStock)?.name || selectedStock;
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50">
        <h3 className="text-2xl font-bold text-white">Stock Price Trends</h3>
        <p className="text-sm text-gray-300 mt-1">Historical price performance from your watchlist</p>
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
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Data shown for the last 9 trading days</span>
          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            View Detailed Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockWatchlistChart;
