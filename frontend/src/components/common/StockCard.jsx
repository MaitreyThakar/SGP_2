'use client';

import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

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
  const isPositive = change >= 0;

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2) || '0.00';
  };

  return (
    <div 
      className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 cursor-pointer border border-gray-200 hover:border-blue-300 group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {symbol}
          </h3>
          <p className="text-sm text-gray-600 truncate">{name}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : (
            <ArrowDownIcon className="h-3 w-3" />
          )}
          <span>{changePercent?.toFixed(2)}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            ${price?.toFixed(2)}
          </span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}${change?.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <p className="text-sm font-medium text-gray-900">{formatNumber(volume)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-sm font-medium text-gray-900">${formatNumber(marketCap)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
