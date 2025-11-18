'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Globe, DollarSign, Bitcoin, AlertCircle, RefreshCw, Loader, Sparkles, X } from 'lucide-react';
import StockChart from '../common/StockChart';
import { usePredictions, usePrediction } from '@/hooks/usePredictions';
import { useStockSearch } from '@/hooks/useStockSearch';

/**
 * PredictionDashboard component with dark theme
 * AI-powered price predictions with comprehensive analysis and visualization for multiple markets
 * Integrates with Flask backend for real predictions
 * @returns {JSX.Element} Multi-market prediction dashboard component
 */
const PredictionDashboard = () => {
  const [selectedMarket, setSelectedMarket] = useState('us');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [predictionPeriod, setPredictionPeriod] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [customSearchTerm, setCustomSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Fetch predictions from backend
  const { predictions: allPredictions, loading: predictionsLoading, error: predictionsError, refetch: refetchPredictions } = usePredictions(selectedMarket, predictionPeriod);
  const { prediction: selectedPredictionData, loading: selectedLoading } = usePrediction(selectedStock, selectedMarket);
  
  // Stock search hook
  const { 
    searchAndTrain, 
    training, 
    searching, 
    prediction: customPrediction, 
    error: searchError,
    reset: resetSearch
  } = useStockSearch();

  // Market configurations
  const markets = {
    indian: {
      name: 'Indian Stock Market',
      currency: '₹',
      icon: Globe,
      color: 'from-orange-600 to-orange-700',
      accentColor: 'orange',
      defaultSymbol: 'RELIANCE.NS'
    },
    us: {
      name: 'US Stock Market',
      currency: '$',
      icon: DollarSign,
      color: 'from-blue-600 to-blue-700',
      accentColor: 'blue',
      defaultSymbol: 'AAPL'
    },
    crypto: {
      name: 'Cryptocurrency Market',
      currency: '$',
      icon: Bitcoin,
      color: 'from-purple-600 to-purple-700',
      accentColor: 'purple',
      defaultSymbol: 'BTC-USD'
    }
  };

  const currentMarket = markets[selectedMarket];

  // Handle market change
  const handleMarketChange = (market) => {
    setSelectedMarket(market);
    setSelectedStock(markets[market].defaultSymbol);
    setSearchTerm('');
    resetSearch();
  };

  // Handle custom stock search and prediction
  const handleCustomSearch = async () => {
    if (!customSearchTerm.trim()) {
      return;
    }

    try {
      const result = await searchAndTrain(customSearchTerm, selectedMarket, predictionPeriod);
      if (result && result.prediction) {
        // Set the custom stock as selected
        setSelectedStock(result.prediction.symbol);
        setShowSearchModal(false);
        setCustomSearchTerm('');
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomSearch();
    }
  };

  // Use custom prediction if available, otherwise use selected prediction data
  const selectedPrediction = customPrediction || selectedPredictionData || allPredictions.find(p => p.symbol === selectedStock) || {
    symbol: selectedStock,
    name: 'Loading...',
    currentPrice: 0,
    predictedPrice: 0,
    confidence: 0,
    trend: 'neutral',
    accuracy: 0,
    factors: [],
    sector: 'N/A',
    timeframe: '7 days'
  };

  // Generate chart data for predictions
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

  const chartData = generatePredictionData(selectedPrediction.currentPrice, selectedPrediction.predictedPrice);

  // Filter predictions based on search
  const filteredPredictions = allPredictions.filter(prediction =>
    prediction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prediction.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Utility functions
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
      {/* Error Alert */}
      {predictionsError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold">Connection Error</h3>
            <p className="text-red-300 text-sm mt-1">
              Unable to connect to prediction service. Please ensure the Flask backend is running on localhost:5000
            </p>
            <button
              onClick={refetchPredictions}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
              <div className={`w-2 h-2 rounded-full animate-pulse ${predictionsLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              <span>{predictionsLoading ? 'Loading...' : 'AI Model Active'}</span>
            </div>
            <button
              onClick={refetchPredictions}
              disabled={predictionsLoading}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh predictions"
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${predictionsLoading ? 'animate-spin' : ''}`} />
            </button>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          {(selectedMarket === 'us' || selectedMarket === 'crypto' || selectedMarket === 'indian') && (
            <button
              onClick={() => setShowSearchModal(true)}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${
                selectedMarket === 'us' 
                  ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  : selectedMarket === 'crypto'
                  ? 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                  : 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
              } text-white rounded-lg font-medium transition-all duration-200 shadow-lg`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Search Any {selectedMarket === 'us' ? 'Stock' : selectedMarket === 'crypto' ? 'Crypto' : 'Indian Stock'}</span>
            </button>
          )}
          <select
            value={predictionPeriod}
            onChange={(e) => setPredictionPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
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
            {selectedLoading ? (
              <div className="flex items-center justify-center h-80">
                <Loader className="h-8 w-8 text-blue-400 animate-spin" />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Prediction Details */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Prediction Details</h3>

            {selectedLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 text-blue-400 animate-spin" />
              </div>
            ) : (
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
            )}
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Key Factors</h3>
            {selectedPrediction.factors && selectedPrediction.factors.length > 0 ? (
              <>
                <div className="space-y-2">
                  {selectedPrediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">{factor}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sector</span>
                    <span className="font-medium text-white">{selectedPrediction.sector}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">No factors available</p>
            )}
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">All Predictions</h2>

        {predictionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-blue-400 animate-spin mr-3" />
            <span className="text-gray-400">Loading predictions...</span>
          </div>
        ) : filteredPredictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPredictions.map((prediction) => (
              <div
                key={prediction.symbol}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedStock === prediction.symbol
                    ? 'border-blue-500 bg-gray-700'
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
        ) : searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No predictions found matching your search</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No predictions available</p>
          </div>
        )}
      </div>

      {/* Custom Stock Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Search & Train Model
              </h3>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setCustomSearchTerm('');
                  resetSearch();
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {selectedMarket === 'us' 
                    ? 'Enter US Stock Symbol' 
                    : selectedMarket === 'crypto'
                    ? 'Enter Cryptocurrency Symbol'
                    : 'Enter Indian Stock Symbol'
                  }
                </label>
                <input
                  type="text"
                  value={customSearchTerm}
                  onChange={(e) => setCustomSearchTerm(e.target.value.toUpperCase())}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={
                    selectedMarket === 'us' 
                      ? 'e.g., AAPL, TSLA, NVDA'
                      : selectedMarket === 'crypto'
                      ? 'e.g., BTC-USD, ETH-USD, DOGE-USD'
                      : 'e.g., RELIANCE.NS, TCS.NS, INFY.NS'
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                  disabled={searching || training}
                />
                <p className="text-xs text-gray-400 mt-2">
                  {selectedMarket === 'us' 
                    ? "We'll search for the stock, train an LSTM model, and generate a prediction"
                    : selectedMarket === 'crypto'
                    ? "We'll search for the cryptocurrency, train an LSTM model, and generate a prediction. Use format: SYMBOL-USD (e.g., BTC-USD)"
                    : "We'll search for the Indian stock, train an LSTM model, and generate a prediction. Use format: SYMBOL.NS (e.g., RELIANCE.NS)"
                  }
                </p>
              </div>

              {searchError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{searchError}</p>
                </div>
              )}

              {(searching || training) && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader className="h-5 w-5 text-blue-400 animate-spin" />
                    <div className="flex-1">
                      <p className="text-blue-300 font-medium">
                        {searching ? 'Searching for stock...' : 'Training LSTM model...'}
                      </p>
                      <p className="text-blue-400 text-sm mt-1">
                        {training ? 'This may take 30-60 seconds' : 'Please wait'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setCustomSearchTerm('');
                    resetSearch();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={searching || training}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomSearch}
                  disabled={!customSearchTerm.trim() || searching || training}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {searching || training ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Train & Predict</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                <p className="text-xs text-gray-400">
                  <strong className="text-gray-300">Note:</strong> The model will fetch historical data,
                  train an LSTM neural network, and generate a 7-day {selectedMarket === 'crypto' ? 'price' : 'price'} prediction with confidence score.
                  {selectedMarket === 'crypto' && (
                    <span className="block mt-1">
                      <strong className="text-yellow-400">Crypto tip:</strong> Always use -USD suffix (e.g., BTC-USD, ETH-USD, DOGE-USD)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDashboard;
