'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarketData } from '@/hooks/useMarketData';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * MarketOverview component displaying global market trends and performance
 * @returns {JSX.Element} Market overview dashboard component
 */
const MarketOverview = () => {
  const { data, loading, error, source } = useMarketData();

  // Enhanced dummy market overview data for fallback
  const dummyMarketOverview = {
    indices: {
      nse: { value: 18275, change: 75, changePercent: 0.41 },
      sp500: { value: 4335, change: 15, changePercent: 0.35 },
      nasdaq: { value: 15435, change: 54, changePercent: 0.35 }
    },
    crypto: {
      totalMarketCap: 2200000000000,
      change: 95000000000,
      changePercent: 4.55
    }
  };

  /**
   * Generates realistic dummy market data with proper volatility patterns
   * @returns {Array} Array of market data points with fluctuations
   */
  const generateDummyMarketData = () => {
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    
    // Starting values for each market
    let nseValue = 18150;
    let nasdaqValue = 15380;
    let sp500Value = 4290;
    
    return timeSlots.map((time, index) => {
      // Create realistic market movements with trends and volatility
      const marketTrend = Math.sin(index * 0.5) * 0.3; // Overall trend pattern
      const randomVolatility = (Math.random() - 0.5) * 2; // Random volatility
      
      // Apply different movement patterns for each market
      const nseMovement = (marketTrend + randomVolatility * 0.8) * 25;
      const nasdaqMovement = (marketTrend + randomVolatility * 0.6) * 20;
      const sp500Movement = (marketTrend + randomVolatility * 0.5) * 15;
      
      // Update values with cumulative changes
      nseValue += nseMovement + (Math.random() - 0.5) * 15;
      nasdaqValue += nasdaqMovement + (Math.random() - 0.5) * 12;
      sp500Value += sp500Movement + (Math.random() - 0.5) * 8;
      
      // Add some correlation between markets
      const marketCorrelation = (Math.random() - 0.5) * 10;
      
      return {
        time,
        nse: Math.round(Math.max(nseValue + marketCorrelation, 18000)),
        nasdaq: Math.round(Math.max(nasdaqValue + marketCorrelation * 0.8, 15200)),
        sp500: Math.round(Math.max(sp500Value + marketCorrelation * 0.6, 4250)),
      };
    });
  };

  if (loading && !data) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-2xl font-bold text-white">Global Market Overview</h3>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading market overview...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use live data if available and valid, otherwise fall back to dummy data
  const marketOverview = (data?.marketOverview && source === 'finnhub') 
    ? data.marketOverview 
    : dummyMarketOverview;

  // Generate realistic chart data
  const marketData = (data?.chartData && source === 'finnhub') 
    ? data.chartData 
    : generateDummyMarketData();

  const dataSource = source === 'finnhub' ? 'finnhub' : 'dummy';
  const isLiveData = dataSource === 'finnhub' && !error;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header Section */}
      <header className="px-6 py-4 border-b border-gray-700/50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Global Market Overview</h3>
            <p className="text-sm text-gray-300 mt-1">
              {isLiveData ? 'Real-time market trends across major exchanges' : 'Market simulation with demo data'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isLiveData
              ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
              : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {isLiveData ? '🟢 Live Data' : '📊 Demo Data'}
          </span>
        </div>
      </header>

      {/* Market Performance Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-700/50">
        {/* Indian Markets Card */}
        <article className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-300">Indian Markets</p>
              <p className="text-3xl font-bold text-white">
                NSE: {marketOverview?.indices?.nse?.value?.toLocaleString() || '18,275'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              (marketOverview?.indices?.nse?.change || 0) >= 0 
                ? 'text-green-400 bg-green-500/10 border border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border border-red-500/30'
            }`}>
              <span className="text-sm font-medium">
                {(marketOverview?.indices?.nse?.change || 0) >= 0 ? '+' : ''}
                {marketOverview?.indices?.nse?.changePercent?.toFixed(2) || '0.41'}%
              </span>
            </div>
          </div>
        </article>
        
        {/* US Markets Card */}
        <article className="bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-300">US Markets</p>
              <p className="text-3xl font-bold text-white">
                S&P: {marketOverview?.indices?.sp500?.value?.toLocaleString() || '4,335'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              (marketOverview?.indices?.sp500?.change || 0) >= 0 
                ? 'text-green-400 bg-green-500/10 border border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border border-red-500/30'
            }`}>
              <span className="text-sm font-medium">
                {(marketOverview?.indices?.sp500?.change || 0) >= 0 ? '+' : ''}
                {marketOverview?.indices?.sp500?.changePercent?.toFixed(2) || '0.35'}%
              </span>
            </div>
          </div>
        </article>
        
        {/* Crypto Markets Card */}
        <article className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-300">Crypto Markets</p>
              <p className="text-3xl font-bold text-white">
                ${((marketOverview?.crypto?.totalMarketCap || 2200000000000) / 1000000000000).toFixed(1)}T
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              (marketOverview?.crypto?.changePercent || 0) >= 0 
                ? 'text-green-400 bg-green-500/10 border border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border border-red-500/30'
            }`}>
              <span className="text-sm font-medium">
                {(marketOverview?.crypto?.changePercent || 0) >= 0 ? '+' : ''}
                {marketOverview?.crypto?.changePercent?.toFixed(2) || '4.55'}%
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* Chart Section */}
      <section className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-white">Today's Performance</h4>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" aria-hidden="true"></div>
              <span className="text-sm text-gray-300">NSE</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" aria-hidden="true"></div>
              <span className="text-sm text-gray-300">S&P 500</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" aria-hidden="true"></div>
              <span className="text-sm text-gray-300">NASDAQ</span>
            </div>
          </div>
        </div>
        
        <div className="h-72 bg-gray-900/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={marketData} 
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3} 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
                width={60}
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
                formatter={(value, name) => [
                  value?.toLocaleString(),
                  name
                ]}
                labelFormatter={(time) => `Time: ${time}`}
              />
              <Line
                type="monotone"
                dataKey="nse"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="NSE"
                activeDot={{ 
                  r: 6, 
                  stroke: '#3b82f6', 
                  strokeWidth: 2, 
                  fill: '#3b82f6' 
                }}
              />
              <Line
                type="monotone"
                dataKey="sp500"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="S&P 500"
                activeDot={{ 
                  r: 6, 
                  stroke: '#10b981', 
                  strokeWidth: 2, 
                  fill: '#10b981' 
                }}
              />
              <Line
                type="monotone"
                dataKey="nasdaq"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="NASDAQ"
                activeDot={{ 
                  r: 6, 
                  stroke: '#f59e0b', 
                  strokeWidth: 2, 
                  fill: '#f59e0b' 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Error State Indicator */}
      {error && (
        <div className="mx-6 mb-4">
          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg px-4 py-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-300">
                API temporarily unavailable - showing demo data
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Last updated: {isLiveData ? '2 minutes ago' : 'Demo data (refreshes on reload)'}
          </span>
          <span>
            {isLiveData 
              ? 'Data provided by Finnhub & major exchanges' 
              : 'Simulated data for demonstration purposes'
            }
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MarketOverview;
