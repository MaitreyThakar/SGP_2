import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

/**
 * Searches for cryptocurrencies using Finnhub Crypto Search API
 * @param {string} query - Search query (crypto name or symbol)
 * @returns {Promise<Array>} Array of search results
 */
async function searchCryptos(query) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache search results for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Crypto search API request failed');
    }
    
    const data = await response.json();
    
    // Filter crypto pairs that match the search query and are USDT pairs
    const matchingCryptos = (data || []).filter(crypto => {
      const symbol = crypto.symbol || '';
      const description = crypto.description || '';
      
      return (
        symbol.includes('USDT') && // Only USDT pairs for consistent pricing
        !symbol.includes('DOWN') && // Exclude leveraged tokens
        !symbol.includes('UP') &&
        !symbol.includes('BULL') &&
        !symbol.includes('BEAR') &&
        (
          symbol.toLowerCase().includes(query.toLowerCase()) ||
          description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }).slice(0, 25); // Limit to top 25 results
    
    // Convert to our format
    return matchingCryptos.map(crypto => {
      const baseSymbol = crypto.symbol.replace('USDT', '');
      return {
        symbol: baseSymbol,
        name: crypto.description || baseSymbol,
        finnhubSymbol: `BINANCE:${crypto.symbol}`
      };
    });
  } catch (error) {
    console.error('Error searching cryptos:', error.message);
    return [];
  }
}

// Extended dummy crypto market data for comprehensive searching
const dummyCryptoMarketData = [
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
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 1.23,
    change: 0.08,
    changePercent: 6.96,
    volume: 445567890,
    marketCap: 12100000000,
    category: 'Layer 2',
    supply: 9800000000,
    rank: 9
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 89.45,
    change: -2.34,
    changePercent: -2.55,
    volume: 234567890,
    marketCap: 6500000000,
    category: 'Store of Value',
    supply: 74000000,
    rank: 10
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.23,
    change: 0.87,
    changePercent: 6.51,
    volume: 456789123,
    marketCap: 8100000000,
    category: 'Oracle',
    supply: 570000000,
    rank: 11
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    price: 7.89,
    change: -0.34,
    changePercent: -4.13,
    volume: 234567890,
    marketCap: 5900000000,
    category: 'DeFi',
    supply: 748000000,
    rank: 12
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    price: 98.45,
    change: 5.67,
    changePercent: 6.11,
    volume: 123456789,
    marketCap: 1400000000,
    category: 'DeFi',
    supply: 14200000,
    rank: 13
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    price: 12.34,
    change: 0.56,
    changePercent: 4.75,
    volume: 178945623,
    marketCap: 3600000000,
    category: 'Interoperability',
    supply: 292000000,
    rank: 14
  },
  {
    symbol: 'ALGO',
    name: 'Algorand',
    price: 0.34,
    change: 0.02,
    changePercent: 6.25,
    volume: 145632789,
    marketCap: 2400000000,
    category: 'Smart Contract',
    supply: 7100000000,
    rank: 15
  },
  {
    symbol: 'VET',
    name: 'VeChain',
    price: 0.025,
    change: -0.001,
    changePercent: -3.85,
    volume: 87654321,
    marketCap: 1800000000,
    category: 'Supply Chain',
    supply: 72000000000,
    rank: 16
  },
  {
    symbol: 'FIL',
    name: 'Filecoin',
    price: 5.67,
    change: 0.23,
    changePercent: 4.23,
    volume: 156789234,
    marketCap: 2100000000,
    category: 'Storage',
    supply: 370000000,
    rank: 17
  },
  {
    symbol: 'SAND',
    name: 'The Sandbox',
    price: 0.45,
    change: 0.03,
    changePercent: 7.14,
    volume: 234567890,
    marketCap: 1000000000,
    category: 'Gaming',
    supply: 2200000000,
    rank: 18
  },
  {
    symbol: 'MANA',
    name: 'Decentraland',
    price: 0.67,
    change: -0.04,
    changePercent: -5.63,
    volume: 134567890,
    marketCap: 1300000000,
    category: 'Gaming',
    supply: 1940000000,
    rank: 19
  },
  {
    symbol: 'CRO',
    name: 'Cronos',
    price: 0.089,
    change: 0.005,
    changePercent: 5.95,
    volume: 67890123,
    marketCap: 2300000000,
    category: 'Exchange Token',
    supply: 25900000000,
    rank: 20
  }
];

// Crypto market overview stats
const cryptoMarketStats = {
  totalMarketCap: 2100000000000,
  totalMarketCapChange: 2.15,
  totalVolume: 89500000000,
  volumeChange: -5.23,
  btcDominance: 52.3,
  btcDominanceChange: 0.8,
  fearGreedIndex: 74,
  fearGreedLabel: 'Greed'
};

/**
 * Generate realistic crypto market data with price variations
 * @returns {Array} Enhanced crypto market data
 */
function generateEnhancedCryptoData() {
  return dummyCryptoMarketData.map(crypto => {
    // Add some realistic price variation
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const volumeVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
    
    return {
      ...crypto,
      price: crypto.price * (1 + priceVariation),
      change: crypto.change * (1 + priceVariation),
      changePercent: crypto.changePercent * (1 + priceVariation),
      volume: crypto.volume * (1 + volumeVariation),
      lastUpdated: new Date().toISOString()
    };
  });
}

/**
 * Fetches crypto data from Finnhub API with enhanced error handling
 * @param {string} symbol - Crypto symbol
 * @param {string} finnhubSymbol - Finnhub-specific symbol format
 * @param {Object} dummyData - Fallback dummy data
 * @returns {Promise<Object|null>} Crypto data or null
 */
async function fetchCryptoFromFinnhub(symbol, finnhubSymbol = null, dummyData = null) {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error('Finnhub API key not available');
    }

    // Use provided finnhubSymbol or construct default
    const apiSymbol = finnhubSymbol || `BINANCE:${symbol}USDT`;
    
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${apiSymbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} from Finnhub`);
    }
    
    const data = await response.json();
    
    // Validate price data
    if (!data.c || data.c <= 0) {
      throw new Error(`No valid price data for ${symbol}`);
    }
    
    // Determine category based on symbol or use dummy data
    const categoryMapping = {
      'BTC': 'Store of Value',
      'ETH': 'Smart Contract', 
      'BNB': 'Exchange Token',
      'SOL': 'Smart Contract',
      'ADA': 'Smart Contract',
      'DOT': 'Interoperability',
      'LINK': 'Oracle',
      'UNI': 'DeFi',
      'AAVE': 'DeFi'
    };

    const baseSymbol = symbol.replace('USDT', '');
    
    return {
      symbol: baseSymbol,
      name: dummyData?.name || `${baseSymbol} Token`,
      price: parseFloat(data.c) || 0,
      change: parseFloat(data.d) || 0,
      changePercent: parseFloat(data.dp) || 0,
      volume: data.v || (dummyData?.volume || Math.floor(Math.random() * 1000000000)),
      marketCap: dummyData?.marketCap || null,
      category: categoryMapping[baseSymbol] || dummyData?.category || 'Digital Asset',
      supply: dummyData?.supply || null,
      rank: dummyData?.rank || 999,
      source: 'finnhub',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching crypto ${symbol} from Finnhub:`, error.message);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const searchSymbols = searchParams.get('symbols'); // Comma-separated list of symbols
    
    console.log('Fetching crypto market data from Finnhub API...');
    
    let targetCryptos = [];
    let isSearchMode = false;
    
    // Handle different request types
    if (searchQuery) {
      // Search mode: Find cryptos by name/symbol
      console.log(`Searching for cryptos matching: ${searchQuery}`);
      isSearchMode = true;
      
      const searchResults = await searchCryptos(searchQuery);
      targetCryptos = searchResults;
      
      if (targetCryptos.length === 0) {
        // If no search results, try exact symbol match
        targetCryptos = [{
          symbol: searchQuery.toUpperCase(),
          name: `${searchQuery.toUpperCase()} Token`,
          finnhubSymbol: `BINANCE:${searchQuery.toUpperCase()}USDT`
        }];
      }
    } else if (searchSymbols) {
      // Specific symbols requested
      const symbols = searchSymbols.split(',').map(s => s.trim().toUpperCase());
      targetCryptos = symbols.map(symbol => ({
        symbol,
        name: `${symbol} Token`,
        finnhubSymbol: `BINANCE:${symbol}USDT`
      }));
      isSearchMode = true;
    } else {
      // Default mode: Popular cryptocurrencies (limited to 10 for first page)
      const majorCryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LTC'];
      targetCryptos = majorCryptos.map(symbol => ({
        symbol,
        name: dummyCryptoMarketData.find(c => c.symbol === symbol)?.name || `${symbol} Token`,
        finnhubSymbol: `BINANCE:${symbol}USDT`
      }));
    }
    
    console.log(`Fetching data for ${targetCryptos.length} cryptos`);
    
    // Fetch all crypto data in parallel with timeout
    const cryptoPromises = targetCryptos.map(crypto => {
      const dummyData = dummyCryptoMarketData.find(d => d.symbol === crypto.symbol);
      return Promise.race([
        fetchCryptoFromFinnhub(crypto.symbol, crypto.finnhubSymbol, dummyData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), isSearchMode ? 8000 : 5000)
        )
      ]);
    });

    const cryptoResults = await Promise.allSettled(cryptoPromises);
    const validCryptos = [];
    
    // Process results and fallback to dummy data when needed
    cryptoResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        validCryptos.push(result.value);
      } else {
        // Fallback to dummy data if available
        const dummyData = dummyCryptoMarketData.find(d => d.symbol === targetCryptos[index].symbol);
        if (dummyData) {
          validCryptos.push({
            ...generateEnhancedSingleCrypto(dummyData),
            source: 'dummy'
          });
        }
      }
    });

    const minValidCryptos = isSearchMode ? 1 : 5;
    
    // If we have valid data, use it; otherwise fall back to all dummy data
    if (validCryptos.length >= minValidCryptos) {
      console.log(`Successfully fetched ${validCryptos.length} cryptos`);
      
      // Add some variation to market stats
      const enhancedMarketStats = {
        ...cryptoMarketStats,
        totalMarketCap: cryptoMarketStats.totalMarketCap * (1 + (Math.random() - 0.5) * 0.1),
        totalVolume: cryptoMarketStats.totalVolume * (1 + (Math.random() - 0.5) * 0.2),
        btcDominance: cryptoMarketStats.btcDominance * (1 + (Math.random() - 0.5) * 0.05),
        fearGreedIndex: Math.max(1, Math.min(100, cryptoMarketStats.fearGreedIndex + (Math.random() - 0.5) * 20))
      };

      const liveCount = validCryptos.filter(c => c.source === 'finnhub').length;
      const dataSource = liveCount > 0 ? (isSearchMode ? 'finnhub_search' : 'hybrid') : 'dummy';
      
      return NextResponse.json({
        success: true,
        source: dataSource,
        searchQuery: searchQuery || null,
        data: {
          cryptos: validCryptos,
          marketStats: enhancedMarketStats,
          marketStatus: {
            isOpen: true,
            tradingType: '24/7 Global Trading',
            lastUpdated: new Date().toISOString()
          }
        },
        timestamp: new Date().toISOString(),
        totalResults: validCryptos.length,
        note: liveCount > 0 
          ? `Enhanced data with ${liveCount} live crypto prices` 
          : 'Using dummy data - API limitations or search failures'
      });
    } else {
      throw new Error('Insufficient valid crypto data received');
    }
    
  } catch (error) {
    console.error('Error fetching crypto market data:', error.message);
    
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      // For search queries, return empty results instead of dummy data
      return NextResponse.json({
        success: false,
        source: 'search_failed',
        searchQuery,
        data: {
          cryptos: [],
          marketStats: cryptoMarketStats,
          marketStatus: {
            isOpen: true,
            tradingType: '24/7 Global Trading',
            lastUpdated: new Date().toISOString()
          }
        },
        timestamp: new Date().toISOString(),
        error: 'No cryptocurrencies found matching your search',
        totalResults: 0
      });
    }
    
    console.log('Falling back to dummy crypto market data');
    
    return NextResponse.json({
      success: true,
      source: 'dummy',
      data: {
        cryptos: generateEnhancedCryptoData(),
        marketStats: cryptoMarketStats,
        marketStatus: {
          isOpen: true,
          tradingType: '24/7 Global Trading',
          lastUpdated: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString(),
      note: 'Using dummy data due to API limitations',
      totalResults: dummyCryptoMarketData.length
    });
  }
}

/**
 * Generate realistic crypto market data with price variations for a single crypto
 * @param {Object} crypto - Single crypto data
 * @returns {Object} Enhanced crypto data
 */
function generateEnhancedSingleCrypto(crypto) {
  const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const volumeVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
  
  return {
    ...crypto,
    price: crypto.price * (1 + priceVariation),
    change: crypto.change * (1 + priceVariation),
    changePercent: crypto.changePercent * (1 + priceVariation),
    volume: crypto.volume * (1 + volumeVariation),
    lastUpdated: new Date().toISOString()
  };
}