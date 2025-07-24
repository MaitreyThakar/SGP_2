'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StockChart = ({ data, symbol, timeframe = '1D', type = 'line' }) => {
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    switch (timeframe) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
      case '1M':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1Y':
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatTooltip = (value, name, props) => {
    if (name === 'price') {
      return [`$${value?.toFixed(2)}`, 'Price'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label) => {
    return new Date(label).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentPrice = data?.[data.length - 1]?.price || 0;
  const previousPrice = data?.[data.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const percentageChange = ((priceChange / previousPrice) * 100);
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{symbol}</h3>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-2xl font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-sm font-medium flex items-center ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxis}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                fill={isPositive ? '#10b981' : '#ef4444'}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxis}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: isPositive ? '#10b981' : '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
