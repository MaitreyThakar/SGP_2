'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Target, Calendar, BarChart3, Globe, DollarSign, Bitcoin } from 'lucide-react';
import StockChart from '../common/StockChart';

/**
 * PredictionDashboard component with dark theme
 * AI-powered price predictions with comprehensive analysis and visualization for multiple markets
 * @returns {JSX.Element} Multi-market prediction dashboard component
 */
const PredictionDashboard = () => {
  const [selectedMarket, setSelectedMarket] = useState('us'); // 'indian', 'us', 'crypto'
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [predictionPeriod, setPredictionPeriod] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');

  // Market configurations
  const markets = {
    indian: {
      name: 'Indian Stock Market',
      currency: '₹',
      icon: Globe,
      color: 'from-orange-600 to-orange-700',
      accentColor: 'orange'
    },
    us: {
      name: 'US Stock Market',
      currency: '$',
      icon: DollarSign,
      color: 'from-blue-600 to-blue-700',
      accentColor: 'blue'
    },
    crypto: {
      name: 'Cryptocurrency Market',
      currency: '$',
      icon: Bitcoin,
      color: 'from-purple-600 to-purple-700',
      accentColor: 'purple'
    }
  };

  // Indian Stock Market Predictions
  const indianPredictions = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      currentPrice: 2456.75,
      predictedPrice: 2589.30,
      confidence: 76,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 81,
      factors: ['Energy sector growth', 'Refining margins', 'Digital expansion'],
      sector: 'Energy'
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Ltd.',
      currentPrice: 3842.50,
      predictedPrice: 4025.75,
      confidence: 83,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 85,
      factors: ['IT sector boom', 'Digital transformation', 'Strong Q4 results'],
      sector: 'Information Technology'
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      currentPrice: 1567.25,
      predictedPrice: 1489.60,
      confidence: 72,
      timeframe: '7 days',
      trend: 'bearish',
      accuracy: 78,
      factors: ['Banking sector concerns', 'NPA worries', 'Interest rate changes'],
      sector: 'Banking'
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd.',
      currentPrice: 1456.80,
      predictedPrice: 1523.45,
      confidence: 79,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 82,
      factors: ['AI adoption', 'Cloud services growth', 'Strong pipeline'],
      sector: 'Information Technology'
    },
    {
      symbol: 'ITC',
      name: 'ITC Ltd.',
      currentPrice: 412.30,
      predictedPrice: 435.75,
      confidence: 68,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 75,
      factors: ['FMCG sector recovery', 'Rural demand', 'New product launches'],
      sector: 'FMCG'
    }
  ];

  // US Stock Market Predictions  
  const usPredictions = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 175.23,
      predictedPrice: 185.67,
      confidence: 78,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 82,
      factors: ['Strong earnings', 'iPhone 15 launch', 'Services growth'],
      sector: 'Technology'
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
      factors: ['EV market competition', 'Production challenges', 'Regulatory concerns'],
      sector: 'Automotive'
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
      factors: ['AI integration', 'Cloud dominance', 'Enterprise adoption'],
      sector: 'Technology'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      currentPrice: 138.45,
      predictedPrice: 145.80,
      confidence: 77,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 80,
      factors: ['Search growth', 'AI advancements', 'Cloud expansion'],
      sector: 'Technology'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      currentPrice: 148.78,
      predictedPrice: 156.90,
      confidence: 73,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 79,
      factors: ['E-commerce growth', 'AWS expansion', 'Prime membership'],
      sector: 'E-commerce'
    }
  ];

  // Cryptocurrency Market Predictions
  const cryptoPredictions = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: 43567.89,
      predictedPrice: 47890.23,
      confidence: 72,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 69,
      factors: ['Institutional adoption', 'ETF approvals', 'Halving cycle'],
      sector: 'Store of Value'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      currentPrice: 2678.45,
      predictedPrice: 2890.75,
      confidence: 75,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 73,
      factors: ['DeFi growth', 'Layer 2 adoption', 'Staking rewards'],
      sector: 'Smart Contracts'
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      currentPrice: 298.76,
      predictedPrice: 285.40,
      confidence: 68,
      timeframe: '7 days',
      trend: 'bearish',
      accuracy: 71,
      factors: ['Exchange competition', 'Regulatory scrutiny', 'Market volatility'],
      sector: 'Exchange Token'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      currentPrice: 67.89,
      predictedPrice: 78.50,
      confidence: 70,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 74,
      factors: ['Network upgrades', 'DeFi ecosystem', 'NFT marketplace'],
      sector: 'Smart Contracts'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      currentPrice: 0.47,
      predictedPrice: 0.52,
      confidence: 66,
      timeframe: '7 days',
      trend: 'bullish',
      accuracy: 68,
      factors: ['Smart contracts', 'Governance updates', 'Partnership news'],
      sector: 'Smart Contracts'
    }
  ];

  // Get current market data
  const getCurrentMarketData = () => {
    switch (selectedMarket) {
      case 'indian':
        return indianPredictions;
      case 'us':
        return usPredictions;
      case 'crypto':
        return cryptoPredictions;
      default:
        return usPredictions;
    }
  };

  const predictions = getCurrentMarketData();
  const currentMarket = markets[selectedMarket];

  // Update selected stock when market changes
  const handleMarketChange = (market) => {
    setSelectedMarket(market);
    const marketData = market === 'indian' ? indianPredictions : 
                     market === 'us' ? usPredictions : cryptoPredictions;
    setSelectedStock(marketData[0]?.symbol || 'AAPL');
    setSearchTerm('');
  };

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
    if (confidence >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (confidence >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getTrendColor = (trend) => {
    return trend === 'bullish' ? 'text-green-400' : 'text-red-400';
  };

  const formatPrice = (price) => {
    if (selectedMarket === 'crypto' && price > 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header with Market Selection */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        {/* Market Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(markets).map(([key, market]) => {
            const IconComponent = market.icon;
            return (
              <button
                key={key}
                onClick={() => handleMarketChange(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedMarket === key
                    ? `bg-gradient-to-r ${market.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{market.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Price Predictions</h1>
            <p className="text-gray-400 mt-1">
              {currentMarket.name} - Advanced machine learning models for market forecasting
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-2 h-2 bg-${currentMarket.accentColor}-400 rounded-full animate-pulse`}></div>
              <span>AI Model Active</span>
            </div>
            <div className="text-sm text-gray-400">Last Updated: 2 min ago</div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={`Search ${currentMarket.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-${currentMarket.accentColor}-500 focus:border-${currentMarket.accentColor}-500 bg-gray-700 text-white placeholder-gray-400`}
            />
          </div>
          <select
            value={predictionPeriod}
            onChange={(e) => setPredictionPeriod(e.target.value)}
            className={`px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-${currentMarket.accentColor}-500 focus:border-${currentMarket.accentColor}-500 bg-gray-700 text-white`}
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
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedPrediction.name}</h3>
                <p className="text-sm text-gray-400">Price Prediction - {selectedPrediction.timeframe}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Current</p>
                  <p className="text-lg font-semibold text-white">
                    {currentMarket.currency}{formatPrice(selectedPrediction.currentPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Predicted</p>
                  <p className={`text-lg font-semibold ${getTrendColor(selectedPrediction.trend)}`}>
                    {currentMarket.currency}{formatPrice(selectedPrediction.predictedPrice)}
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
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Prediction Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Confidence</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(selectedPrediction.confidence)}`}>
                  {selectedPrediction.confidence}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trend</span>
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
                <span className="text-gray-400">Model Accuracy</span>
                <span className="font-medium text-white">{selectedPrediction.accuracy}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price Change</span>
                <span className={`font-medium ${getTrendColor(selectedPrediction.trend)}`}>
                  {selectedPrediction.trend === 'bullish' ? '+' : ''}
                  {((selectedPrediction.predictedPrice - selectedPrediction.currentPrice) / selectedPrediction.currentPrice * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Key Factors</h3>
            <div className="space-y-2">
              {selectedPrediction.factors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${currentMarket.accentColor}-400 rounded-full`}></div>
                  <span className="text-sm text-gray-300">{factor}</span>
                </div>
              ))}
            </div>
            
            {/* Market-specific additional info */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sector</span>
                <span className="font-medium text-white">{selectedPrediction.sector}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">All Predictions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPredictions.map((prediction) => (
            <div 
              key={prediction.symbol}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedStock === prediction.symbol 
                  ? `border-${currentMarket.accentColor}-500 bg-gray-700` 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedStock(prediction.symbol)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">{prediction.symbol}</h4>
                  <p className="text-sm text-gray-400 truncate">{prediction.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{prediction.sector}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Current</span>
                  <span className="text-sm font-medium text-white">
                    {currentMarket.currency}{formatPrice(prediction.currentPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Predicted</span>
                  <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                    {currentMarket.currency}{formatPrice(prediction.predictedPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Change</span>
                  <span className={`text-sm font-medium ${getTrendColor(prediction.trend)}`}>
                    {prediction.trend === 'bullish' ? '+' : ''}
                    {((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* No results message */}
        {filteredPredictions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No predictions found matching your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 bg-${currentMarket.accentColor}-600 text-white rounded-lg hover:bg-${currentMarket.accentColor}-700 transition-colors`}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDashboard;
