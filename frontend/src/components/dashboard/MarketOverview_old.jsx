'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const sectorData = [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Banking', value: 25, color: '#10b981' },
    { name: 'Healthcare', value: 15, color: '#f59e0b' },
    { name: 'Energy', value: 12, color: '#ef4444' },
    { name: 'Others', value: 13, color: '#8b5cf6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends Today</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="nse"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="NSE"
              />
              <Line
                type="monotone"
                dataKey="nasdaq"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="NASDAQ"
              />
              <Line
                type="monotone"
                dataKey="crypto"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Crypto (T)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
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
            <span className="text-sm text-gray-600">Crypto</span>
          </div>
        </div>
      </div>

      {/* Sector Distribution - Commented out for cleaner dashboard */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Allocation']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {sectorData.map((sector, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: sector.color }}
                ></div>
                <span className="text-sm text-gray-600">{sector.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{sector.value}%</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default MarketOverview;
