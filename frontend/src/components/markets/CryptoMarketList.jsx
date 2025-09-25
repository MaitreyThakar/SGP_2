'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Loader2, 
  Bitcoin,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import StockCard from '../common/StockCard';
import { LoadingCard } from '../common/Loading';
import { useCryptoMarketData } from '@/hooks/useMarketData';

/**
 * Crypto Market List component with dark theme
 * Displays cryptocurrencies with filtering and sorting capabilities
 * @returns {JSX.Element} Crypto market assets list
 */
const CryptoMarketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiveSearchMode, setIsLiveSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const cryptosPerPage = 10;

  // Fetch crypto market data with search capabilities
  const { 
    data, 
    loading, 
    error, 
    source, 
    lastUpdated, 
    searchResults,
    refetch,
    searchCryptos,
    clearSearch
  } = useCryptoMarketData();

  const categories = ['all', 'Store of Value', 'Smart Contract', 'Exchange Token', 'Payments', 'DeFi', 'Gaming', 'Layer 2', 'Interoperability', 'Oracle', 'Supply Chain'];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query && query.length >= 2) {
        setSearchLoading(true);
        setIsLiveSearchMode(true);
        await searchCryptos(query);
        setSearchLoading(false);
      } else if (query.length === 0) {
        setIsLiveSearchMode(false);
        clearSearch();
      }
    }, 500),
    [searchCryptos, clearSearch]
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
  const activeCryptos = isLiveSearchMode && searchResults ? searchResults.results : (data?.cryptos || []);
  const activeSource = isLiveSearchMode && searchResults ? searchResults.source : source;

  // Memoized filtered and sorted cryptos
  const { filteredCryptos, totalCryptos } = useMemo(() => {
    if (!activeCryptos) return { filteredCryptos: [], totalCryptos: 0 };
    
    let filtered = [...activeCryptos];
    
    // For live search mode, don't apply additional search filtering since API already did it
    // For default mode, apply local search filtering
    if (!isLiveSearchMode && searchTerm) {
      filtered = filtered.filter(crypto => 
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(crypto => crypto.category === filterBy);
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
        case 'rank':
          return (a.rank || 999) - (b.rank || 999);
        default:
          return 0;
      }
    });
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * cryptosPerPage;
    const paginatedCryptos = filtered.slice(startIndex, startIndex + cryptosPerPage);
    
    return { 
      filteredCryptos: paginatedCryptos, 
      totalCryptos: filtered.length 
    };
  }, [activeCryptos, searchTerm, filterBy, sortBy, currentPage, cryptosPerPage, isLiveSearchMode]);

  // Reset to first page when search/filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const totalPages = Math.ceil(totalCryptos / cryptosPerPage);

  const handleCryptoClick = (crypto) => {
    console.log('Crypto clicked:', crypto.symbol);
    // Navigate to detailed view
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

  const formatSupply = (supply) => {
    if (supply >= 1e9) return (supply / 1e9).toFixed(1) + 'B';  
    if (supply >= 1e6) return (supply / 1e6).toFixed(1) + 'M';
    if (supply >= 1e3) return (supply / 1e3).toFixed(1) + 'K';
    return supply?.toFixed(0) || '0';
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading crypto market data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state without fallback data
  if (error && !data) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Failed to load crypto market data</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const marketStats = data?.marketStats || {};

  return (
    <div className="space-y-6">
      {/* Header with Data Source Indicator */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Cryptocurrency Market</h1>
          <p className="text-gray-300 mt-2">Digital Assets & Blockchain Technologies</p>
        </div>
        <div className="flex items-center space-x-4">
          {activeSource && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              activeSource === 'hybrid' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : activeSource === 'finnhub' || activeSource === 'finnhub_search'
                ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {activeSource === 'hybrid' ? '🔄 Hybrid Data' : 
               activeSource === 'finnhub' ? '🟢 Live Data' :
               activeSource === 'finnhub_search' ? '🔍 Live Search' :
               '📊 Demo Data'}
            </span>
          )}
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium px-4 py-2 rounded-lg border border-purple-600/50 hover:bg-purple-600/10 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        {isLiveSearchMode && (
          <div className="mb-4 p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
            <p className="text-purple-400 text-sm">
              🔍 Live search active - Searching through cryptocurrency markets in real-time
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search any cryptocurrency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
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
                <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
            >
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">Change %</option>
              <option value="volume">Volume</option>
              <option value="rank">Rank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100 opacity-90">Total Market Cap</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${((marketStats.totalMarketCap || 2100000000000) / 1000000000000).toFixed(1)}T
              </p>
            </div>
            <div className={`flex items-center ${
              (marketStats.totalMarketCapChange || 2.15) >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {(marketStats.totalMarketCapChange || 2.15) >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              <span className="text-sm font-semibold">
                {(marketStats.totalMarketCapChange || 2.15) >= 0 ? '+' : ''}
                {(marketStats.totalMarketCapChange || 2.15).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100 opacity-90">24h Volume</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${((marketStats.totalVolume || 89500000000) / 1000000000).toFixed(1)}B
              </p>
            </div>
            <div className={`flex items-center ${
              (marketStats.volumeChange || -5.23) >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {(marketStats.volumeChange || -5.23) >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              <span className="text-sm font-semibold">
                {(marketStats.volumeChange || -5.23) >= 0 ? '+' : ''}
                {(marketStats.volumeChange || -5.23).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100 opacity-90">BTC Dominance</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(marketStats.btcDominance || 52.3).toFixed(1)}%
              </p>
            </div>
            <div className={`flex items-center ${
              (marketStats.btcDominanceChange || 0.8) >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {(marketStats.btcDominanceChange || 0.8) >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              <span className="text-sm font-semibold">
                {(marketStats.btcDominanceChange || 0.8) >= 0 ? '+' : ''}
                {(marketStats.btcDominanceChange || 0.8).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-100 opacity-90">Fear & Greed</p>
              <p className="text-2xl font-bold text-white mt-1">
                {Math.round(marketStats.fearGreedIndex || 74)}
              </p>
            </div>
            <div className="text-green-300">
              <span className="text-sm font-semibold">
                {marketStats.fearGreedLabel || 'Greed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Bitcoin className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cryptocurrency Market</h3>
              <p className="text-sm text-gray-400">24/7 Global Trading</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-400">Live Trading</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Real-time data</p>
          </div>
        </div>
      </div>

      {/* Error indicator if there's an error but data exists */}
      {error && data && (
        <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">
              API partially unavailable - showing cached data
            </span>
          </div>
        </div>
      )}

      {/* Crypto List */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLiveSearchMode ? (
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span>Live Search: {totalCryptos} results</span>
                {totalPages > 1 && <span className="text-sm text-gray-400">- Page {currentPage} of {totalPages}</span>}
              </div>
            ) : (
              <>Cryptocurrencies ({totalCryptos}) - Page {currentPage} of {totalPages}</>
            )}
          </h2>
          <div className="flex items-center space-x-3 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
            <Bitcoin className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Digital Assets</span>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCryptos.map((crypto) => (
                <StockCard
                  key={crypto.symbol}
                  symbol={crypto.symbol}
                  name={crypto.name}
                  price={crypto.price}
                  change={crypto.change}
                  changePercent={crypto.changePercent}
                  volume={crypto.volume}
                  marketCap={crypto.marketCap}
                  onClick={() => handleCryptoClick(crypto)}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* No results message */}
            {totalCryptos === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No cryptocurrencies found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with data source info */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
          <span>
            {activeSource === 'hybrid' 
              ? 'Enhanced data with some live prices' 
              : activeSource === 'finnhub' || activeSource === 'finnhub_search'
              ? 'Data provided by Finnhub API' 
              : 'Demo data for preview purposes'
            }
            {isLiveSearchMode && ' • Live search results'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CryptoMarketList;
