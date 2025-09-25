import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Dummy historical data
const dummyHistoricalData = {
  'AAPL': [
    { date: 'Sep 16', price: 170.25 },
    { date: 'Sep 17', price: 171.50 },
    { date: 'Sep 18', price: 172.80 },
    { date: 'Sep 19', price: 171.75 },
    { date: 'Sep 20', price: 172.60 },
    { date: 'Sep 23', price: 173.45 },
    { date: 'Sep 24', price: 175.23 }
  ],
  'RELIANCE.NS': [
    { date: 'Sep 16', price: 2420.50 },
    { date: 'Sep 17', price: 2435.75 },
    { date: 'Sep 18', price: 2445.20 },
    { date: 'Sep 19', price: 2430.10 },
    { date: 'Sep 20', price: 2440.60 },
    { date: 'Sep 23', price: 2455.30 },
    { date: 'Sep 24', price: 2456.75 }
  ],
  'TCS.NS': [
    { date: 'Sep 16', price: 3380.25 },
    { date: 'Sep 17', price: 3395.50 },
    { date: 'Sep 18', price: 3410.75 },
    { date: 'Sep 19', price: 3400.30 },
    { date: 'Sep 20', price: 3415.80 },
    { date: 'Sep 23', price: 3425.60 },
    { date: 'Sep 24', price: 3421.20 }
  ]
};

/**
 * Fetches historical stock data from Finnhub
 * @param {string} symbol - Stock symbol
 * @param {number} days - Number of days back
 * @returns {Promise<Array>} Historical data array
 */
async function fetchHistoricalData(symbol, days = 7) {
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 24 * 60 * 60);
    
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
    
    const data = await response.json();
    
    if (data.s === 'no_data' || !data.c || data.c.length === 0) {
      throw new Error(`No historical data available for ${symbol}`);
    }
    
    // Transform data to our format
    const historicalData = data.c.map((price, index) => ({
      date: new Date(data.t[index] * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: parseFloat(price.toFixed(2))
    }));
    
    return historicalData;
    
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error.message);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  
  try {
    console.log(`Fetching historical data for ${symbol} from Finnhub...`);
    
    const historicalData = await fetchHistoricalData(symbol);
    
    if (historicalData && historicalData.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'finnhub',
        symbol,
        data: historicalData,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No valid historical data received');
    }
    
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error.message);
    console.log('Falling back to dummy historical data');
    
    return NextResponse.json({
      success: true,
      source: 'dummy',
      symbol,
      data: dummyHistoricalData[symbol] || dummyHistoricalData['AAPL'],
      timestamp: new Date().toISOString(),
      note: 'Using dummy data due to API issues'
    });
  }
}