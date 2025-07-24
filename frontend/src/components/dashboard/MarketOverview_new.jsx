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
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Global Market Overview</h3>
        <p className="text-sm text-gray-600 mt-1">Real-time market trends across major exchanges</p>
      </div>

      {/* Market Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Indian Markets</p>
              <p className="text-2xl font-bold text-blue-900">NSE: 18,275</p>
            </div>
            <div className="text-green-600">
              <span className="text-sm font-medium">+0.41%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">US Markets</p>
              <p className="text-2xl font-bold text-green-900">NASDAQ: 4,335</p>
            </div>
            <div className="text-green-600">
              <span className="text-sm font-medium">+0.35%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Crypto Markets</p>
              <p className="text-2xl font-bold text-yellow-900">$2.2T</p>
            </div>
            <div className="text-green-600">
              <span className="text-sm font-medium">+4.55%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">Today's Performance</h4>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">NSE</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">NASDAQ</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Crypto (T)</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Line
                type="monotone"
                dataKey="nse"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="NSE"
                activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="nasdaq"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="NASDAQ"
                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="crypto"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Crypto (T)"
                activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Last updated: 2 minutes ago</span>
          <span>Data provided by major exchanges</span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
