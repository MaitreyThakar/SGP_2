'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketOverview = () => {
  // Sample data for market overview
  const marketData = [
    { time: '09:00', nse: 18200, nasdaq: 4300, crypto: 2.1 },
    { time: '10:00', nse: 18220, nasdaq: 4315, crypto: 2.15 },
    { time: '11:00', nse: 18180, nasdaq: 4298, crypto: 2.08 },
    { time: '12:00', nse: 18245, nasdaq: 4327, crypto: 2.12 },
    { time: '13:00', nse: 18260, nasdaq: 4340, crypto: 2.18 },
    { time: '14:00', nse: 18235, nasdaq: 4320, crypto: 2.14 },
    { time: '15:00', nse: 18275, nasdaq: 4335, crypto: 2.20 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50">
        <h3 className="text-2xl font-bold text-white">Global Market Overview</h3>
        <p className="text-sm text-gray-300 mt-1">Real-time market trends across major exchanges</p>
      </div>

      {/* Market Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-700/50">
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-300">Indian Markets</p>
              <p className="text-3xl font-bold text-white">NSE: 18,275</p>
            </div>
            <div className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">+0.41%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-300">US Markets</p>
              <p className="text-3xl font-bold text-white">NASDAQ: 4,335</p>
            </div>
            <div className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">+0.35%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-300">Crypto Markets</p>
              <p className="text-3xl font-bold text-white">$2.2T</p>
            </div>
            <div className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">+4.55%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-white">Today's Performance</h4>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">NSE</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">NASDAQ</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Crypto (T)</span>
            </div>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
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
              />
              <Line
                type="monotone"
                dataKey="nse"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                name="NSE"
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="nasdaq"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="NASDAQ"
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="crypto"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
                name="Crypto (T)"
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50 rounded-b-xl">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Last updated: 2 minutes ago</span>
          <span>Data provided by major exchanges</span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
