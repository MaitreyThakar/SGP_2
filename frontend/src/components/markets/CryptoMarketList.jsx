'use client';

import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';
import StockCard from '../common/StockCard';
import { LoadingCard } from '../common/Loading';

/**
 * Crypto Market List component with dark theme
 * Displays cryptocurrencies with filtering and sorting capabilities
 * @returns {JSX.Element} Crypto market assets list
 */
const CryptoMarketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const cryptoAssets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43567.89,
      change: 1234.56,
      changePercent: 2.92,
      volume: 12345678901,
      marketCap: 850000000000,
      category: 'Store of Value',
      supply: 19800000,
      rank: 1
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2678.45,
      change: -45.67,
      changePercent: -1.68,
      volume: 8901234567,
      marketCap: 321000000000,
      category: 'Smart Contract',
      supply: 120000000,
      rank: 2
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      price: 298.76,
      change: 8.90,
      changePercent: 3.07,
      volume: 1234567890,
      marketCap: 45600000000,
      category: 'Exchange Token',
      supply: 153000000,
      rank: 3
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 67.89,
      change: 3.45,
      changePercent: 5.35,
      volume: 2345678901,
      marketCap: 29400000000,
      category: 'Smart Contract',
      supply: 433000000,
      rank: 4
    },
    {
      symbol: 'XRP',
      name: 'XRP',
      price: 0.56,
      change: 0.02,
      changePercent: 3.70,
      volume: 987654321,
      marketCap: 30200000000,
      category: 'Payments',
      supply: 54000000000,
      rank: 5
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.47,
      change: -0.01,
      changePercent: -2.08,
      volume: 345678901,
      marketCap: 16800000000,
      category: 'Smart Contract',
      supply: 36000000000,
      rank: 6
    },
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 38.90,
      change: 2.10,
      changePercent: 5.71,
      volume: 567890123,
      marketCap: 14300000000,
      category: 'Smart Contract',
      supply: 367000000,
      rank: 7
    },
    {
      symbol: 'DOT',
      name: 'Polkadot',
      price: 6.78,
      change: 0.23,
      changePercent: 3.51,
      volume: 234567890,
      marketCap: 8900000000,
      category: 'Interoperability',
      supply: 1310000000,
      rank: 8
    }
  ];

  const categories = ['all', 'Store of Value', 'Smart Contract', 'Exchange Token', 'Payments', 'Interoperability'];

  const filteredCrypto = cryptoAssets
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(crypto => filterBy === 'all' || crypto.category === filterBy)
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
        case 'rank':
          return a.rank - b.rank;
        default:
          return 0;
      }
    });

  const handleCryptoClick = (crypto) => {
    console.log('Crypto clicked:', crypto.symbol);
    // Navigate to detailed view
  };

  const formatSupply = (supply) => {
    if (supply >= 1e9) return (supply / 1e9).toFixed(1) + 'B';  
    if (supply >= 1e6) return (supply / 1e6).toFixed(1) + 'M';
    if (supply >= 1e3) return (supply / 1e3).toFixed(1) + 'K';
    return supply?.toFixed(0) || '0';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white placeholder-gray-400"
            />
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
              <p className="text-2xl font-bold text-white mt-1">$2.1T</p>
            </div>
            <div className="flex items-center text-green-300">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">+2.15%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100 opacity-90">24h Volume</p>
              <p className="text-2xl font-bold text-white mt-1">$89.5B</p>
            </div>
            <div className="flex items-center text-red-300">
              <TrendingDown className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">-5.23%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100 opacity-90">BTC Dominance</p>
              <p className="text-2xl font-bold text-white mt-1">52.3%</p>
            </div>
            <div className="flex items-center text-green-300">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="text-sm font-semibold">+0.8%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-100 opacity-90">Fear & Greed</p>
              <p className="text-2xl font-bold text-white mt-1">74</p>
            </div>
            <div className="text-green-300">
              <span className="text-sm font-semibold">Greed</span>
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

      {/* Crypto List */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Cryptocurrencies ({filteredCrypto.length})
          </h2>
          <div className="flex items-center space-x-3 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
            <Bitcoin className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Digital Assets</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCrypto.map((crypto) => (
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
        )}
      </div>
    </div>
  );
};

export default CryptoMarketList;
