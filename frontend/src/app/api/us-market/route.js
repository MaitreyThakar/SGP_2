import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

/**
 * Searches for stocks using Finnhub Symbol Search API
 * @param {string} query - Search query (company name or symbol)
 * @returns {Promise<Array>} Array of search results
 */
async function searchStocks(query) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache search results for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Search API request failed');
    }
    
    const data = await response.json();
    
    // Filter for US stocks only (NYSE, NASDAQ)
    const usStocks = (data.result || []).filter(stock => 
      stock.type === 'Common Stock' && 
      (stock.symbol.match(/^[A-Z]{1,5}$/) || stock.symbol.includes('.')) && // US format symbols
      !stock.symbol.includes(':') // Exclude foreign exchanges
    ).slice(0, 20); // Limit to top 20 results
    
    return usStocks;
  } catch (error) {
    console.error('Error searching stocks:', error.message);
    return [];
  }
}

// Extended dummy US market data for comprehensive searching
const dummyUSMarketData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.23,
    change: 2.45,
    changePercent: 1.42,
    volume: 45678901,
    marketCap: 2800000000000,
    sector: 'Technology',
    pe: 28.4,
    pb: 39.8
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 342.67,
    change: -1.23,
    changePercent: -0.36,
    volume: 23456789,
    marketCap: 2550000000000,
    sector: 'Technology',
    pe: 32.1,
    pb: 12.9
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.45,
    change: 3.21,
    changePercent: 2.37,
    volume: 34567890,
    marketCap: 1750000000000,
    sector: 'Technology',
    pe: 25.7,
    pb: 5.4
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 148.78,
    change: 5.67,
    changePercent: 3.96,
    volume: 56789012,
    marketCap: 1540000000000,
    sector: 'Consumer Discretionary',
    pe: 52.8,
    pb: 8.1
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 234.56,
    change: -8.90,
    changePercent: -3.65,
    volume: 78901234,
    marketCap: 745000000000,
    sector: 'Consumer Discretionary',
    pe: 73.2,
    pb: 14.6
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 456.78,
    change: 12.34,
    changePercent: 2.78,
    volume: 34567890,
    marketCap: 1120000000000,
    sector: 'Technology',
    pe: 64.5,
    pb: 28.3
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 298.45,
    change: 4.56,
    changePercent: 1.55,
    volume: 23456789,
    marketCap: 760000000000,
    sector: 'Technology',
    pe: 22.8,
    pb: 4.9
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 167.89,
    change: 1.23,
    changePercent: 0.74,
    volume: 12345678,
    marketCap: 485000000000,
    sector: 'Financial Services',
    pe: 11.2,
    pb: 1.7
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group Inc.',
    price: 512.34,
    change: 7.89,
    changePercent: 1.56,
    volume: 3456789,
    marketCap: 480000000000,
    sector: 'Healthcare',
    pe: 24.7,
    pb: 6.2
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    price: 156.78,
    change: -2.34,
    changePercent: -1.47,
    volume: 8901234,
    marketCap: 410000000000,
    sector: 'Healthcare',
    pe: 15.8,
    pb: 3.1
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 234.56,
    change: 1.89,
    changePercent: 0.81,
    volume: 7654321,
    marketCap: 520000000000,
    sector: 'Financial Services',
    pe: 31.2,
    pb: 13.7
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 159.87,
    change: -0.78,
    changePercent: -0.49,
    volume: 9876543,
    marketCap: 435000000000,
    sector: 'Consumer Staples',
    pe: 28.9,
    pb: 5.1
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    price: 154.32,
    change: 2.15,
    changePercent: 1.41,
    volume: 5432167,
    marketCap: 365000000000,
    sector: 'Consumer Staples',
    pe: 24.6,
    pb: 8.3
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    price: 398.76,
    change: 4.32,
    changePercent: 1.10,
    volume: 2765432,
    marketCap: 380000000000,
    sector: 'Financial Services',
    pe: 33.8,
    pb: 46.2
  },
  {
    symbol: 'HD',
    name: 'Home Depot Inc.',
    price: 312.45,
    change: -2.67,
    changePercent: -0.85,
    volume: 3987654,
    marketCap: 320000000000,
    sector: 'Consumer Discretionary',
    pe: 19.8,
    pb: 12.4
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp.',
    price: 29.87,
    change: 0.45,
    changePercent: 1.53,
    volume: 45623789,
    marketCap: 245000000000,
    sector: 'Financial Services',
    pe: 12.3,
    pb: 1.1
  },
  {
    symbol: 'DIS',
    name: 'Walt Disney Co.',
    price: 87.65,
    change: -1.23,
    changePercent: -1.38,
    volume: 15432876,
    marketCap: 160000000000,
    sector: 'Communication',
    pe: 15.7,
    pb: 1.8
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 445.32,
    change: 8.76,
    changePercent: 2.01,
    volume: 4567821,
    marketCap: 195000000000,
    sector: 'Communication',
    pe: 44.2,
    pb: 12.9
  },
  {
    symbol: 'CRM',
    name: 'Salesforce Inc.',
    price: 198.45,
    change: 3.21,
    changePercent: 1.64,
    volume: 6789543,
    marketCap: 190000000000,
    sector: 'Technology',
    pe: 52.8,
    pb: 2.9
  },
  {
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    price: 567.89,
    change: -4.56,
    changePercent: -0.80,
    volume: 2345678,
    marketCap: 265000000000,
    sector: 'Technology',
    pe: 41.5,
    pb: 11.2
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corp.',
    price: 112.34,
    change: 2.78,
    changePercent: 2.54,
    volume: 18765432,
    marketCap: 465000000000,
    sector: 'Energy',
    pe: 14.6,
    pb: 1.9
  },
  {
    symbol: 'CVX',
    name: 'Chevron Corp.',
    price: 156.78,
    change: 1.45,
    changePercent: 0.93,
    volume: 8765432,
    marketCap: 295000000000,
    sector: 'Energy',
    pe: 15.2,
    pb: 1.7
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc.',
    price: 34.56,
    change: -0.89,
    changePercent: -2.51,
    volume: 32165478,
    marketCap: 195000000000,
    sector: 'Healthcare',
    pe: 13.8,
    pb: 2.1
  },
  {
    symbol: 'KO',
    name: 'Coca-Cola Co.',
    price: 58.23,
    change: 0.67,
    changePercent: 1.16,
    volume: 14567823,
    marketCap: 252000000000,
    sector: 'Consumer Staples',
    pe: 26.4,
    pb: 9.8
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo Inc.',
    price: 168.45,
    change: 1.23,
    changePercent: 0.74,
    volume: 4567890,
    marketCap: 233000000000,
    sector: 'Consumer Staples',
    pe: 25.7,
    pb: 12.3
  }
];

// Market index data
const marketIndices = {
  sp500: { value: 4327.89, change: -23.12, changePercent: -0.53 },
  nasdaq: { value: 13456.78, change: 45.67, changePercent: 0.34 },
  dow: { value: 34789.12, change: 112.34, changePercent: 0.32 }
};

/**
 * Fetches stock data from Finnhub API with enhanced error handling
 * @param {string} symbol - Stock symbol
 * @param {boolean} includeProfile - Whether to fetch company profile
 * @returns {Promise<Object>} Stock data with profile
 */
async function fetchUSStockData(symbol, includeProfile = true) {
  try {
    const requests = [
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      })
    ];

    if (includeProfile) {
      requests.push(
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
          next: { revalidate: 3600 } // Cache for 1 hour
        })
      );
    }

    const responses = await Promise.all(requests);
    
    // Check if all requests were successful
    if (!responses.every(response => response.ok)) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }

    const quoteData = await responses[0].json();
    const profileData = includeProfile ? await responses[1].json() : {};

    // Validate quote data
    if (!quoteData.c || quoteData.c === 0) {
      throw new Error(`No valid quote data for ${symbol}`);
    }

    // Map sector names
    const sectorMapping = {
      'Information Technology': 'Technology',
      'Consumer Cyclical': 'Consumer Discretionary',
      'Financial Services': 'Financial Services',
      'Communication Services': 'Communication',
      'Healthcare': 'Healthcare',
      'Consumer Defensive': 'Consumer Staples',
      'Industrials': 'Industrials',
      'Energy': 'Energy',
      'Utilities': 'Utilities',
      'Real Estate': 'Real Estate',
      'Basic Materials': 'Materials'
    };

    return {
      symbol: symbol.toUpperCase(),
      name: profileData.name || symbol,
      price: parseFloat(quoteData.c) || 0, // current price
      change: parseFloat(quoteData.d) || 0, // change
      changePercent: parseFloat(quoteData.dp) || 0, // change percent
      volume: quoteData.volume || Math.floor((quoteData.c || 100) * 1000000), // Use actual volume or estimate
      marketCap: profileData.marketCapitalization ? profileData.marketCapitalization * 1000000 : null,
      sector: sectorMapping[profileData.finnhubIndustry] || profileData.finnhubIndustry || 'Technology',
      pe: Math.round(Math.random() * 50 + 10), // Mock P/E ratio (Finnhub doesn't provide this in quote)
      pb: Math.round(Math.random() * 20 + 1), // Mock P/B ratio
      exchange: profileData.exchange || 'Unknown',
      country: profileData.country || 'US',
      weburl: profileData.weburl || null,
      logo: profileData.logo || null,
      currency: profileData.currency || 'USD'
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const searchSymbols = searchParams.get('symbols'); // Comma-separated list of symbols
    
    console.log('Fetching US market data from Finnhub API...');
    
    let targetSymbols = [];
    let isSearchMode = false;
    
    // Handle different request types
    if (searchQuery) {
      // Search mode: Find stocks by name/symbol
      console.log(`Searching for stocks matching: ${searchQuery}`);
      isSearchMode = true;
      
      const searchResults = await searchStocks(searchQuery);
      targetSymbols = searchResults.map(stock => stock.symbol);
      
      if (targetSymbols.length === 0) {
        // If no search results, try exact symbol match
        targetSymbols = [searchQuery.toUpperCase()];
      }
    } else if (searchSymbols) {
      // Specific symbols requested
      targetSymbols = searchSymbols.split(',').map(s => s.trim().toUpperCase());
      isSearchMode = true;
    } else {
      // Default mode: Popular US stocks (limited to 10 for first page)
      targetSymbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
        'NVDA', 'META', 'JPM', 'UNH', 'JNJ'
      ];
    }
    
    console.log(`Fetching data for ${targetSymbols.length} symbols`);
    
    // Fetch all stock data in parallel with timeout
    const stockPromises = targetSymbols.map(symbol => 
      Promise.race([
        fetchUSStockData(symbol, !isSearchMode), // Include profile for default mode only
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), isSearchMode ? 8000 : 5000)
        )
      ])
    );

    const stockResults = await Promise.allSettled(stockPromises);
    const validStocks = stockResults
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    const minValidStocks = isSearchMode ? 1 : 5;
    
    // If we have valid data, use it; otherwise fall back to dummy data
    if (validStocks.length >= minValidStocks) {
      console.log(`Successfully fetched ${validStocks.length} US stocks from Finnhub`);
      
      return NextResponse.json({
        success: true,
        source: isSearchMode ? 'finnhub_search' : 'finnhub',
        searchQuery: searchQuery || null,
        data: {
          stocks: validStocks,
          indices: marketIndices,
          marketStatus: {
            isOpen: true,
            nextClose: '4:00 PM ET',
            timeUntilClose: '3h 45m'
          }
        },
        timestamp: new Date().toISOString(),
        totalResults: validStocks.length
      });
    } else {
      throw new Error('Insufficient valid stock data received');
    }
    
  } catch (error) {
    console.error('Error fetching from Finnhub API:', error.message);
    
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    
    if (searchQuery) {
      // For search queries, return empty results instead of dummy data
      return NextResponse.json({
        success: false,
        source: 'search_failed',
        searchQuery,
        data: {
          stocks: [],
          indices: marketIndices,
          marketStatus: {
            isOpen: true,
            nextClose: '4:00 PM ET',
            timeUntilClose: '3h 45m'
          }
        },
        timestamp: new Date().toISOString(),
        error: 'No stocks found matching your search',
        totalResults: 0
      });
    }
    
    console.log('Falling back to dummy US market data');
    
    return NextResponse.json({
      success: true,
      source: 'dummy',
      data: {
        stocks: dummyUSMarketData,
        indices: marketIndices,
        marketStatus: {
          isOpen: true,
          nextClose: '4:00 PM ET',
          timeUntilClose: '3h 45m'
        }
      },
      timestamp: new Date().toISOString(),
      note: 'Using dummy data due to API issues',
      totalResults: dummyUSMarketData.length
    });
  }
}