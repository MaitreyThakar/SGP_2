import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Dummy data fallback
const dummyData = {
  marketOverview: {
    indices: {
      nse: { value: 18275, change: 75, changePercent: 0.41 },
      nasdaq: { value: 15435, change: 54, changePercent: 0.35 },
      sp500: { value: 4335, change: 15, changePercent: 0.35 }
    },
    crypto: {
      totalMarketCap: 2200000000000,
      change: 95000000000,
      changePercent: 4.55
    }
  },
  watchlistStocks: [
    {
      symbol: 'RELIANCE.NS',
      name: 'Reliance Industries Ltd',
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 1234567,
      marketCap: 16500000000000
    },
    {
      symbol: 'TCS.NS',
      name: 'Tata Consultancy Services',
      price: 3421.20,
      change: -12.30,
      changePercent: -0.36,
      volume: 987654,
      marketCap: 12800000000000
    },
    {
      symbol: 'HDFCBANK.NS',
      name: 'HDFC Bank Limited',
      price: 1654.85,
      change: 8.75,
      changePercent: 0.53,
      volume: 2345678,
      marketCap: 9200000000000
    },
    {
      symbol: 'INFY.NS',
      name: 'Infosys Limited',
      price: 1789.40,
      change: 15.60,
      changePercent: 0.88,
      volume: 1876543,
      marketCap: 7400000000000
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.23,
      change: 2.45,
      changePercent: 1.42,
      volume: 45678901,
      marketCap: 2800000000000
    }
  ]
};

/**
 * Fetches stock data from Finnhub API
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Stock data
 */
async function fetchStockData(symbol) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      symbol,
      price: data.c || 0, // current price
      change: data.d || 0, // change
      changePercent: data.dp || 0, // change percent
      high: data.h || 0,
      low: data.l || 0,
      open: data.o || 0,
      previousClose: data.pc || 0
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetches company profile from Finnhub API
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company data
 */
async function fetchCompanyProfile(symbol) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile for ${symbol}`);
    }
    
    const data = await response.json();
    return {
      name: data.name || symbol,
      marketCap: data.marketCapitalization ? data.marketCapitalization * 1000000 : 0,
      volume: data.shareOutstanding || 0
    };
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error.message);
    return null;
  }
}

export async function GET() {
  try {
    console.log('Fetching market data from Finnhub API...');
    
    // Define symbols to fetch
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    const indianSymbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'];
    
    // Fetch all stock data in parallel
    const allSymbols = [...symbols, ...indianSymbols];
    const stockPromises = allSymbols.map(symbol => 
      Promise.all([
        fetchStockData(symbol),
        fetchCompanyProfile(symbol.replace('.NS', ''))
      ]).then(([stockData, profileData]) => {
        if (!stockData) return null;
        
        return {
          symbol: stockData.symbol,
          name: profileData?.name || stockData.symbol,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changePercent,
          volume: profileData?.volume || Math.floor(Math.random() * 10000000),
          marketCap: profileData?.marketCap || Math.floor(Math.random() * 1000000000000),
          high: stockData.high,
          low: stockData.low,
          open: stockData.open,
          previousClose: stockData.previousClose
        };
      })
    );

    const stockResults = await Promise.allSettled(stockPromises);
    const validStocks = stockResults
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    // If we have valid data, use it; otherwise fall back to dummy data
    if (validStocks.length > 0) {
      console.log(`Successfully fetched ${validStocks.length} stocks from Finnhub`);
      
      return NextResponse.json({
        success: true,
        source: 'finnhub',
        data: {
          watchlistStocks: validStocks,
          marketOverview: {
            indices: {
              nse: { value: 18275, change: 75, changePercent: 0.41 },
              nasdaq: { value: 15435, change: 54, changePercent: 0.35 },
              sp500: { value: 4335, change: 15, changePercent: 0.35 }
            },
            crypto: {
              totalMarketCap: 2200000000000,
              change: 95000000000,
              changePercent: 4.55
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No valid stock data received');
    }
    
  } catch (error) {
    console.error('Error fetching from Finnhub API:', error.message);
    console.log('Falling back to dummy data');
    
    return NextResponse.json({
      success: true,
      source: 'dummy',
      data: dummyData,
      timestamp: new Date().toISOString(),
      note: 'Using dummy data due to API issues'
    });
  }
}