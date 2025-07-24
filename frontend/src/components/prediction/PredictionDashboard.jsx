'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Target, Calendar, BarChart3 } from 'lucide-react';
import StockChart from '../common/StockChart';

const PredictionDashboard = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [predictionPeriod, setPredictionPeriod] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample prediction data
  const predictions = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 175.23,
      predictedPrice: 185.67,
      confidence: 78,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 82,
      factors: ['Strong earnings', 'Product launch', 'Market sentiment']
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      currentPrice: 234.56,
      predictedPrice: 218.90,
      confidence: 65,
      timeframe: '7 days',
      trend: 'bearish',
      accuracy: 75,
      factors: ['Market volatility', 'Competition', 'Regulatory concerns']
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      currentPrice: 342.67,
      predictedPrice: 358.12,
      confidence: 84,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 88,
      factors: ['Cloud growth', 'AI adoption', 'Strong fundamentals']
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: 43567.89,
      predictedPrice: 47890.23,
      confidence: 72,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 69,
      factors: ['Institutional adoption', 'ETF approval', 'Market cycle']
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      currentPrice: 2456.75,
      predictedPrice: 2589.30,
      confidence: 76,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 81,
      factors: ['Energy sector growth', 'Refining margins', 'Digital expansion']
    }
  ];

  // Generate sample chart data for predictions
  const generatePredictionData = (currentPrice, predictedPrice) => {
    const data = [];
    const days = 7;
    const priceChange = predictedPrice - currentPrice;
    const dailyChange = priceChange / days;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      let price;
      if (i === 0) {
        price = currentPrice;
      } else if (i === days) {
        price = predictedPrice;
      } else {
        // Add some realistic volatility
        const basePrice = currentPrice + (dailyChange * i);
        const volatility = (Math.random() - 0.5) * (currentPrice * 0.02);
        price = basePrice + volatility;
      }
      
      data.push({
        timestamp: date.toISOString(),
        price: price,
        type: i === 0 ? 'current' : 'predicted'
      });
    }
    return data;
  };

  const selectedPrediction = predictions.find(p => p.symbol === selectedStock) || predictions[0];
  const chartData = generatePredictionData(selectedPrediction.currentPrice, selectedPrediction.predictedPrice);

  const filteredPredictions = predictions.filter(prediction =>
    prediction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prediction.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendColor = (trend) => {
    return trend === 'bullish' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Price Predictions</h1>
            <p className="text-gray-600 mt-1">Advanced machine learning models for market forecasting</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Model Active</span>
            </div>
            <div className="text-sm text-gray-600">Last Updated: 2 min ago</div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search stocks or crypto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={predictionPeriod}
            onChange={(e) => setPredictionPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1d">1 Day</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>
      </div>

      {/* Main Prediction Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPrediction.name}</h3>
                <p className="text-sm text-gray-600">Price Prediction - {selectedPrediction.timeframe}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-lg font-semibold">${selectedPrediction.currentPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Predicted</p>
                  <p className={`text-lg font-semibold ${getTrendColor(selectedPrediction.trend)}`}>
                    ${selectedPrediction.predictedPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <StockChart 
              data={chartData} 
              symbol={selectedPrediction.symbol}
              type="area"
            />
          </div>
        </div>

        {/* Prediction Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confidence</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedPrediction.confidence)}`}>
                  {selectedPrediction.confidence}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trend</span>
                <div className={`flex items-center ${getTrendColor(selectedPrediction.trend)}`}>
                  {selectedPrediction.trend === 'bullish' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="capitalize font-medium">{selectedPrediction.trend}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Model Accuracy</span>
                <span className="font-medium">{selectedPrediction.accuracy}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price Change</span>
                <span className={`font-medium ${getTrendColor(selectedPrediction.trend)}`}>
                  {selectedPrediction.trend === 'bullish' ? '+' : ''}
                  {((selectedPrediction.predictedPrice - selectedPrediction.currentPrice) / selectedPrediction.currentPrice * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Factors</h3>
            <div className="space-y-2">
              {selectedPrediction.factors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Predictions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPredictions.map((prediction) => (
            <div 
              key={prediction.symbol}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedStock === prediction.symbol ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedStock(prediction.symbol)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{prediction.symbol}</h4>
                  <p className="text-sm text-gray-600 truncate">{prediction.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium">${prediction.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                    ${prediction.predictedPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                    {prediction.trend === 'bullish' ? '+' : ''}
                    {((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboard;
