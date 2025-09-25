'use client';

import { TrendingUp, TrendingDown, Volume2, DollarSign } from 'lucide-react';

/**
 * StockCard component for displaying individual stock information
 * @param {Object} props - Component props
 * @param {string} props.symbol - Stock symbol
 * @param {string} props.name - Stock name
 * @param {number} props.price - Current stock price
 * @param {number} props.change - Price change amount
 * @param {number} props.changePercent - Price change percentage
 * @param {number} props.volume - Trading volume
 * @param {number} props.marketCap - Market capitalization
 * @param {Function} props.onClick - Click handler function
 */
const StockCard = ({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  volume, 
  marketCap, 
  onClick 
}) => {
  const isPositive = (change || 0) >= 0;
  
  // Format large numbers
  const formatNumber = (num) => {
    if (!num || num === null || num === undefined || isNaN(num)) return '0';
    
    const numValue = parseFloat(num);
    if (numValue >= 1e12) return (numValue / 1e12).toFixed(1) + 'T';
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(1) + 'B';
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(1) + 'M';
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(1) + 'K';
    return numValue.toString();
  };

  return (
    <div 
      className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600/50 hover:border-gray-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol}</h3>
          <p className="text-xs text-gray-400 line-clamp-2">{name}</p>
        </div>
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">
          ${(price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center space-x-1 mt-1">
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{(change || 0).toFixed(2)}
          </span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            ({isPositive ? '+' : ''}{(changePercent || 0).toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Volume2 className="h-4 w-4" />
            <span>Volume</span>
          </div>
          <span className="text-gray-300 font-medium">{formatNumber(volume)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>Market Cap</span>
          </div>
          <span className="text-gray-300 font-medium">${formatNumber(marketCap)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-600/50">
        {/* <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
          View Details →
        </button> */}
      </div>
    </div>
  );
};

export default StockCard;
