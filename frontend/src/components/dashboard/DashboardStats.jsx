'use client';

import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

/**
 * StatCard component for displaying individual statistics
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the stat
 * @param {string} props.value - The main value to display
 * @param {string} props.change - The change amount
 * @param {string} props.changePercent - The percentage change
 * @param {React.Component} props.icon - The icon component
 * @param {string} props.trend - 'up' or 'down' trend indicator
 * @param {string} props.description - Additional description text
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
  const stats = [
    {
      title: 'Portfolio Value',
      value: '$124,563',
      change: '+2,341',
      changePercent: '+1.92',
      icon: DollarSign,
      trend: 'up',
      description: 'Total portfolio worth'
    },
    {
      title: 'Indian Markets',
      value: '18,245.30',
      change: '+125.45',
      changePercent: '+0.69',
      icon: TrendingUp,
      trend: 'up',
      description: 'NIFTY 50 Index'
    },
    {
      title: 'US Markets',
      value: '4,327.89',
      change: '-23.12',
      changePercent: '-0.53',
      icon: TrendingDown,
      trend: 'down',
      description: 'S&P 500 Index'
    },
    {
      title: 'Crypto Markets',
      value: '$2.1T',
      change: '+45.2B',
      changePercent: '+2.15',
      icon: BarChart3,
      trend: 'up',
      description: 'Total market cap'
    }
  ];

  return (
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
  );
};

export default DashboardStats;
