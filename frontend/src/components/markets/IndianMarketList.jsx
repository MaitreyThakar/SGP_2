'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/**
 * Indian Market List component with dark theme
 * Displays NSE/BSE stocks with filtering and sorting capabilities
 * Requires user authentication
 * @returns {JSX.Element} Indian market stocks list
 */
const IndianMarketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);
        setAuthLoading(false);
        
        // Simulate loading stocks data
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else {
          setUser(session.user);
          setAuthLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  // Mock data - in real app, this would come from an API
  const indianStocks = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Limited',
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      marketCap: 16500000000000,
      sector: 'Energy',
      pe: 24.5,
      pb: 2.8
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3421.20,
      change: -12.30,
      changePercent: -0.36,
      volume: 987654,
      marketCap: 12800000000000,
      sector: 'IT',
      pe: 28.3,
      pb: 12.1
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Limited',
      price: 1654.85,
      change: 8.75,
      changePercent: 0.53,
      volume: 2345678,
      marketCap: 9200000000000,
      sector: 'Banking',
      pe: 18.7,
      pb: 2.1
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1789.40,
      change: 15.60,
      changePercent: 0.88,
      volume: 1876543,
      marketCap: 7400000000000,
      sector: 'IT',
      pe: 26.4,
      pb: 8.9
    },
    {
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever Limited',
      price: 2678.90,
      change: -5.45,
      changePercent: -0.20,
      volume: 567890,
      marketCap: 6300000000000,
      sector: 'FMCG',
      pe: 62.1,
      pb: 12.8
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Limited',
      price: 987.65,
      change: 12.30,
      changePercent: 1.26,
      volume: 3456789,
      marketCap: 6900000000000,
      sector: 'Banking',
      pe: 16.2,
      pb: 2.8
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Limited',
      price: 876.45,
      change: 3.20,
      changePercent: 0.37,
      volume: 1987654,
      marketCap: 4800000000000,
      sector: 'Telecom',
      pe: 45.6,
      pb: 3.2
    },
    {
      symbol: 'ITC',
      name: 'ITC Limited',
      price: 456.78,
      change: -2.15,
      changePercent: -0.47,
      volume: 4567890,
      marketCap: 5700000000000,
      sector: 'FMCG',
      pe: 28.9,
      pb: 4.1
    }
  ];

  const sectors = ['all', 'IT', 'Banking', 'Energy', 'FMCG', 'Telecom'];

  const filteredStocks = indianStocks
    .filter(stock => 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(stock => filterBy === 'all' || stock.sector === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.marketCap - a.marketCap;
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        case 'volume':
          return b.volume - a.volume;
        default:
          return 0;
      }
    });

  const handleStockClick = (stock) => {
    console.log('Stock clicked:', stock.symbol);
    // Navigate to detailed view - you can add navigation logic here
    // router.push(`/stocks/${stock.symbol}`);
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `₹${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `₹${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)}L`;
    return `₹${num.toFixed(2)}`;
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (should redirect but this is a fallback)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-300">
            Explore the Indian stock market with AI-powered insights
          </p>
        </div>

        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search Indian stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'all' ? 'All Sectors' : sector}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                >
                  <option value="marketCap">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="change">Change %</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100 opacity-90">NIFTY 50</p>
                  <p className="text-2xl font-bold text-white mt-1">18,245.30</p>
                </div>
                <div className="flex items-center text-green-300">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  <span className="text-sm font-semibold">+125.45 (0.69%)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100 opacity-90">SENSEX</p>
                  <p className="text-2xl font-bold text-white mt-1">61,235.75</p>
                </div>
                <div className="flex items-center text-green-300">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  <span className="text-sm font-semibold">+423.12 (0.70%)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-100 opacity-90">BANK NIFTY</p>
                  <p className="text-2xl font-bold text-white mt-1">43,567.89</p>
                </div>
                <div className="flex items-center text-red-300">
                  <TrendingDown className="h-5 w-5 mr-1" />
                  <span className="text-sm font-semibold">-89.23 (-0.20%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stocks List */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Indian Stocks ({filteredStocks.length})
              </h2>
              <div className="flex items-center space-x-3 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-400">NSE/BSE Listed</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock)}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">{stock.symbol}</h3>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        {stock.sector}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{stock.name}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Price:</span>
                        <span className="text-white font-semibold">₹{stock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Change:</span>
                        <span className={`font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Market Cap:</span>
                        <span className="text-white font-semibold">{formatNumber(stock.marketCap)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredStocks.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No stocks found matching your criteria</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndianMarketList;