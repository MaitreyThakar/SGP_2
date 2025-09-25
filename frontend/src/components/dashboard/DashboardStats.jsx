'use client';

import { TrendingUp, TrendingDown, DollarSign, BarChart3, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

/**
 * StatCard component for displaying individual statistics
 */
const StatCard = ({ title, value, change, changePercent, icon: Icon, trend, description }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${
            isPositive 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
              : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30'
          }`}>
            <Icon className={`h-6 w-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">{title}</p>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change} ({changePercent}%)
          </span>
        </div>
        <p className="text-xs text-gray-500">vs last period</p>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const { data, loading, error, source } = useMarketData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 text-center">
          <p className="text-gray-300">Failed to load dashboard statistics</p>
          {source && (
            <p className="text-sm text-yellow-400 mt-2">Falling back to demo data...</p>
          )}
        </div>
      </div>
    );
  }

  // Calculate portfolio value from watchlist (mock calculation)
  const portfolioValue = data?.watchlistStocks?.reduce((total, stock) => total + (stock.price * 100), 0) || 124563;
  
  const stats = [
    {
      title: 'Portfolio Value',
      value: `$${portfolioValue.toLocaleString()}`,
      change: '+2,341',
      changePercent: '+1.92',
      icon: DollarSign,
      trend: 'up',
      description: 'Total portfolio worth'
    },
    {
      title: 'Indian Markets',
      value: data?.marketOverview?.indices?.nse?.value?.toLocaleString() || '18,245',
      change: `+${data?.marketOverview?.indices?.nse?.change || 125}`,
      changePercent: `+${data?.marketOverview?.indices?.nse?.changePercent?.toFixed(2) || '0.69'}`,
      icon: TrendingUp,
      trend: 'up',
      description: 'NIFTY 50 Index'
    },
    {
      title: 'US Markets',
      value: data?.marketOverview?.indices?.sp500?.value?.toLocaleString() || '4,327',
      change: `${data?.marketOverview?.indices?.sp500?.change || -23}`,
      changePercent: `${data?.marketOverview?.indices?.sp500?.changePercent?.toFixed(2) || '-0.53'}`,
      icon: TrendingDown,
      trend: data?.marketOverview?.indices?.sp500?.change >= 0 ? 'up' : 'down',
      description: 'S&P 500 Index'
    },
    {
      title: 'Crypto Markets',
      value: `$${((data?.marketOverview?.crypto?.totalMarketCap || 2100000000000) / 1000000000000).toFixed(1)}T`,
      change: `+${((data?.marketOverview?.crypto?.change || 45200000000) / 1000000000).toFixed(1)}B`,
      changePercent: `+${data?.marketOverview?.crypto?.changePercent?.toFixed(2) || '2.15'}`,
      icon: BarChart3,
      trend: 'up',
      description: 'Total market cap'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Data Source Indicator */}
      {source && (
        <div className="flex justify-end">
          <span className={`px-3 py-1 rounded-full text-xs ${
            source === 'finnhub' 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-yellow-600/20 text-yellow-400'
          }`}>
            {source === 'finnhub' ? 'Live Data from Finnhub' : 'Demo Data (API Unavailable)'}
          </span>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changePercent={stat.changePercent}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
