'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUSMarketData } from '@/hooks/useMarketData';
import StockCard from '@/components/common/StockCard';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown,
  Loader2,
  AlertCircle,
  DollarSign,
  BarChart3,
  X
} from 'lucide-react';

/**
 * US Market List component with dark theme
 * Displays NYSE/NASDAQ stocks with filtering and sorting capabilities
 * @returns {JSX.Element} US market stocks list
 */
const USMarketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiveSearchMode, setIsLiveSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const stocksPerPage = 10;

  // Fetch US market data with search capabilities
  const { 
    data, 
    loading, 
    error, 
    source, 
    lastUpdated, 
    searchResults,
    refetch,
    searchStocks,
    clearSearch
  } = useUSMarketData();

  const sectors = ['all', 'Technology', 'Consumer Discretionary', 'Financial Services', 'Healthcare', 'Energy', 'Communication', 'Consumer Staples'];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query && query.length >= 2) {
        setSearchLoading(true);
        setIsLiveSearchMode(true);
        await searchStocks(query);
        setSearchLoading(false);
      } else if (query.length === 0) {
        setIsLiveSearchMode(false);
        clearSearch();
      }
    }, 500),
    [searchStocks, clearSearch]
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Choose data source: search results or default data
  const activeStocks = isLiveSearchMode && searchResults ? searchResults.results : (data?.stocks || []);
  const activeSource = isLiveSearchMode && searchResults ? searchResults.source : source;

  // Memoized filtered and sorted stocks
  const { filteredStocks, totalStocks } = useMemo(() => {
    if (!activeStocks) return { filteredStocks: [], totalStocks: 0 };
    
    let filtered = [...activeStocks];
    
    // For live search mode, don't apply additional search filtering since API already did it
    // For default mode, apply local search filtering
    if (!isLiveSearchMode && searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sector filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(stock => stock.sector === filterBy);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        case 'price':
          return (b.price || 0) - (a.price || 0);
        case 'volume':
          return (b.volume || 0) - (a.volume || 0);
        case 'change':
          return (b.changePercent || 0) - (a.changePercent || 0);
        case 'alphabetical':
          return a.symbol.localeCompare(b.symbol);
        default:
          return 0;
      }
    });
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * stocksPerPage;
    const paginatedStocks = filtered.slice(startIndex, startIndex + stocksPerPage);
    
    return { 
      filteredStocks: paginatedStocks, 
      totalStocks: filtered.length 
    };
  }, [activeStocks, searchTerm, filterBy, sortBy, currentPage, stocksPerPage, isLiveSearchMode]);

  // Reset to first page when search/filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const totalPages = Math.ceil(totalStocks / stocksPerPage);

  const handleStockClick = (stock) => {
    console.log('Stock clicked:', stock.symbol);
    // Navigate to detailed view or perform action
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsLiveSearchMode(false);
    clearSearch();
    setCurrentPage(1);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    return timestamp.toLocaleDateString();
  };

  // Format large numbers for display
  const formatNumber = (num) => {
    if (!num || num === null || num === undefined || isNaN(num)) return '$0.00';
    
    const numValue = parseFloat(num);
    if (numValue >= 1e12) return `$${(numValue / 1e12).toFixed(1)}T`;
    if (numValue >= 1e9) return `$${(numValue / 1e9).toFixed(1)}B`;
    if (numValue >= 1e6) return `$${(numValue / 1e6).toFixed(1)}M`;
    if (numValue >= 1e3) return `$${(numValue / 1e3).toFixed(1)}K`;
    return `$${numValue.toFixed(2)}`;
  };

  // Format volume numbers
  const formatVolume = (volume) => {
    if (!volume || volume === null || volume === undefined || isNaN(volume)) return '0';
    
    const volValue = parseFloat(volume);
    if (volValue >= 1e9) return `${(volValue / 1e9).toFixed(1)}B`;
    if (volValue >= 1e6) return `${(volValue / 1e6).toFixed(1)}M`;
    if (volValue >= 1e3) return `${(volValue / 1e3).toFixed(1)}K`;
    return volValue.toLocaleString();
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading US Market Data</h2>
          <p className="text-gray-400">Fetching latest stock information...</p>
        </div>
      </div>
    );
  }

  // Error state without fallback data
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Market Data</h2>
          <p className="text-gray-400 mb-6">Unable to fetch US market information</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const marketIndices = data?.indices || {};
  const marketStatus = data?.marketStatus || { isOpen: false, nextOpenTime: 'Market Closed' };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">US Stock Market</h1>
              <p className="text-gray-300 text-lg">
                NYSE & NASDAQ listed companies with real-time data
                {activeSource && (
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                    activeSource === 'finnhub' || activeSource === 'finnhub_search'
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {activeSource === 'finnhub' ? '🟢 Live Data' : 
                     activeSource === 'finnhub_search' ? '🔍 Live Search' :
                     '📊 Demo Data'}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${
                marketStatus.isOpen 
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-600/20 text-red-400 border border-red-500/30'
              }`}>
                <span className="text-sm font-medium">
                  {marketStatus.isOpen ? '🟢 Market Open' : '🔴 Market Closed'}
                </span>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Market Indices Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">S&P 500</p>
                <p className="text-2xl font-bold text-white">
                  {marketIndices.sp500?.value?.toLocaleString() || '4,335'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${
                (marketIndices.sp500?.change || 0) >= 0 
                  ? 'text-green-400 bg-green-500/10' 
                  : 'text-red-400 bg-red-500/10'
              }`}>
                <span className="text-sm font-medium">
                  {(marketIndices.sp500?.change || 0) >= 0 ? '+' : ''}
                  {marketIndices.sp500?.changePercent?.toFixed(2) || '0.35'}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">NASDAQ</p>
                <p className="text-2xl font-bold text-white">
                  {marketIndices.nasdaq?.value?.toLocaleString() || '15,435'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${
                (marketIndices.nasdaq?.change || 0) >= 0 
                  ? 'text-green-400 bg-green-500/10' 
                  : 'text-red-400 bg-red-500/10'
              }`}>
                <span className="text-sm font-medium">
                  {(marketIndices.nasdaq?.change || 0) >= 0 ? '+' : ''}
                  {marketIndices.nasdaq?.changePercent?.toFixed(2) || '0.54'}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">DOW JONES</p>
                <p className="text-2xl font-bold text-white">
                  {marketIndices.dow?.value?.toLocaleString() || '34,725'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${
                (marketIndices.dow?.change || 0) >= 0 
                  ? 'text-green-400 bg-green-500/10' 
                  : 'text-red-400 bg-red-500/10'
              }`}>
                <span className="text-sm font-medium">
                  {(marketIndices.dow?.change || 0) >= 0 ? '+' : ''}
                  {marketIndices.dow?.changePercent?.toFixed(2) || '0.28'}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
          {isLiveSearchMode && (
            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                🔍 Live search active - Searching through thousands of US stocks in real-time
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search any US stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchLoading && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Sector Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector} className="bg-gray-800">
                    {sector === 'all' ? 'All Sectors' : sector}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="marketCap" className="bg-gray-800">Market Cap</option>
                <option value="price" className="bg-gray-800">Price</option>
                <option value="volume" className="bg-gray-800">Volume</option>
                <option value="change" className="bg-gray-800">% Change</option>
                <option value="alphabetical" className="bg-gray-800">A-Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-700/30 rounded-lg px-4 py-3 border border-gray-600">
              <span className="text-sm text-gray-300">
                {isLiveSearchMode ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="font-semibold text-blue-400">Live Search:</span>
                    <span className="font-semibold text-white">{totalStocks}</span>
                    <span>results</span>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-white">{totalStocks}</span> stocks found
                    {totalStocks > stocksPerPage && (
                      <span className="text-xs text-gray-400 block">
                        Showing {((currentPage - 1) * stocksPerPage) + 1}-{Math.min(currentPage * stocksPerPage, totalStocks)} of {totalStocks}
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Stocks Grid using Stock Cards */}
        <section className="mb-8">
          {filteredStocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredStocks.map((stock) => (
                <div key={stock.symbol} className="transform hover:scale-105 transition-all duration-300">
                  <StockCard
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                    volume={stock.volume}
                    marketCap={stock.marketCap}
                    onClick={() => handleStockClick(stock)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-12">
              <div className="text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No stocks found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm 
                    ? `No stocks match "${searchTerm}"` 
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex justify-center items-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNum = Math.max(1, currentPage - 2) + index;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </section>
        )}

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-gray-400">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              <span>
                {activeSource === 'finnhub' || activeSource === 'finnhub_search'
                  ? 'Data provided by Finnhub Financial API' 
                  : 'Demo data for preview purposes'
                }
                {isLiveSearchMode && ' • Live search results'}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default USMarketList;
