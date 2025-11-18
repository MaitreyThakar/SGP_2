"""
Utility functions for data fetching, processing, and technical indicators
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import yfinance as yf
from alpha_vantage.timeseries import TimeSeries
import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
ALPHA_VANTAGE_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', '')

# ============================================================================
# DATA FETCHING FUNCTIONS
# ============================================================================

def fetch_stock_data(symbol, days=30, source='yfinance'):
    """
    Fetch historical stock data
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL', 'RELIANCE.NS', 'BTC-USD')
        days: Number of historical days to fetch
        source: Data source ('yfinance' or 'alpha_vantage')
    
    Returns:
        Dictionary with stock data and technical indicators
    """
    try:
        if source == 'yfinance':
            return _fetch_from_yfinance(symbol, days)
        elif source == 'alpha_vantage':
            return _fetch_from_alpha_vantage(symbol, days)
        else:
            return None
    
    except Exception as e:
        print(f"Error fetching stock data: {str(e)}")
        return None


def _fetch_from_yfinance(symbol, days):
    """Fetch data from Yahoo Finance"""
    try:
        # Download historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        df = yf.download(symbol, start=start_date, end=end_date, progress=False)

        if df.empty:
            return None

        # Flatten MultiIndex columns if present (for single symbol)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.droplevel(1)
        
        # Get current price
        ticker = yf.Ticker(symbol)
        current_price = df['Close'].iloc[-1]
        
        # Calculate technical indicators
        df = calculate_technical_indicators(df)
        
        # Format response
        data = {
            'symbol': symbol,
            'currentPrice': float(current_price),
            'currency': 'USD',
            'dayHigh': float(df['High'].iloc[-1]),
            'dayLow': float(df['Low'].iloc[-1]),
            'volume': int(df['Volume'].iloc[-1]),
            'marketCap': getattr(ticker.info.get('marketCap'), '__float__', lambda: 0)() if ticker.info.get('marketCap') else 0,
            'pe_ratio': ticker.info.get('trailingPE', 0),
            'historical_data': format_historical_data(df),
            'technical_indicators': {
                'sma_20': float(df['SMA_20'].iloc[-1]) if 'SMA_20' in df else None,
                'sma_50': float(df['SMA_50'].iloc[-1]) if 'SMA_50' in df else None,
                'rsi': float(df['RSI'].iloc[-1]) if 'RSI' in df else None,
                'macd': float(df['MACD'].iloc[-1]) if 'MACD' in df else None,
            },
            'timestamp': datetime.now().isoformat()
        }
        
        return data
        
    except Exception as e:
        print(f"Error fetching from Yahoo Finance: {str(e)}")
        return None


def _fetch_from_alpha_vantage(symbol, days):
    """Fetch data from Alpha Vantage"""
    try:
        if not ALPHA_VANTAGE_KEY:
            print("Alpha Vantage API key not configured")
            return None
        
        ts = TimeSeries(key=ALPHA_VANTAGE_KEY, output_format='pandas')
        data, meta_data = ts.get_daily(symbol=symbol)
        
        if data.empty:
            return None
        
        # Sort by date
        data = data.sort_index()
        
        # Get recent data
        recent_data = data[-days:]
        
        # Format response
        return {
            'symbol': symbol,
            'currentPrice': float(recent_data['4. close'].iloc[-1]),
            'historical_data': format_historical_data(recent_data),
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error fetching from Alpha Vantage: {str(e)}")
        return None


def format_historical_data(df):
    """Format historical data for API response"""
    formatted_data = []
    
    for index, row in df.iterrows():
        formatted_data.append({
            'date': str(index.date()) if hasattr(index, 'date') else str(index),
            'open': float(row.get('Open', 0)) if 'Open' in row else float(row.get('1. open', 0)),
            'high': float(row.get('High', 0)) if 'High' in row else float(row.get('2. high', 0)),
            'low': float(row.get('Low', 0)) if 'Low' in row else float(row.get('3. low', 0)),
            'close': float(row.get('Close', 0)) if 'Close' in row else float(row.get('4. close', 0)),
            'volume': int(row.get('Volume', 0)) if 'Volume' in row else int(row.get('6. volume', 0))
        })
    
    return formatted_data[-30:]  # Return last 30 days


# ============================================================================
# TECHNICAL INDICATORS
# ============================================================================

def calculate_technical_indicators(df):
    """Calculate technical indicators"""
    try:
        # Simple Moving Average
        df['SMA_20'] = df['Close'].rolling(window=20).mean()
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        
        # Exponential Moving Average
        df['EMA_12'] = df['Close'].ewm(span=12).mean()
        df['EMA_26'] = df['Close'].ewm(span=26).mean()
        
        # MACD
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['Signal_Line'] = df['MACD'].ewm(span=9).mean()
        
        # RSI (Relative Strength Index)
        df['RSI'] = calculate_rsi(df['Close'])
        
        # Bollinger Bands
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (std * 2)
        df['BB_Lower'] = df['BB_Middle'] - (std * 2)
        
        return df
        
    except Exception as e:
        print(f"Error calculating indicators: {str(e)}")
        return df


def calculate_rsi(prices, period=14):
    """Calculate Relative Strength Index"""
    try:
        deltas = np.diff(prices)
        seed = deltas[:period+1]
        up = seed[seed >= 0].sum() / period
        down = -seed[seed < 0].sum() / period
        rs = up / down if down != 0 else 0
        rsi = np.zeros_like(prices)
        rsi[:period] = 100. - 100. / (1. + rs)
        
        for i in range(period, len(prices)):
            delta = deltas[i-1]
            if delta > 0:
                upval = delta
                downval = 0.
            else:
                upval = 0.
                downval = -delta
            
            up = (up * (period - 1) + upval) / period
            down = (down * (period - 1) + downval) / period
            
            rs = up / down if down != 0 else 0
            rsi[i] = 100. - 100. / (1. + rs)
        
        return rsi
        
    except Exception as e:
        print(f"Error calculating RSI: {str(e)}")
        return None


def calculate_indicators(symbol, period='1m'):
    """
    Calculate all technical indicators for a stock
    
    Args:
        symbol: Stock symbol
        period: Time period ('1d', '1w', '1m', '3m', '1y')
    
    Returns:
        Dictionary with indicators
    """
    try:
        # Fetch data
        days_map = {
            '1d': 1,
            '1w': 7,
            '1m': 30,
            '3m': 90,
            '1y': 365
        }
        days = days_map.get(period, 30)
        
        data = fetch_stock_data(symbol, days)
        
        if not data:
            return None
        
        return {
            'symbol': symbol,
            'period': period,
            'indicators': data.get('technical_indicators', {}),
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error in calculate_indicators: {str(e)}")
        return None


# ============================================================================
# SENTIMENT ANALYSIS
# ============================================================================

def analyze_sentiment(symbol, days=7, max_results=20):
    """
    Analyze sentiment for a stock using Google News and NLTK VADER

    Args:
        symbol: Stock symbol (e.g., 'AAPL', 'BTC-USD')
        days: Number of days to look back for news
        max_results: Maximum number of articles to analyze

    Returns:
        Dictionary with sentiment analysis results
    """
    try:
        from GoogleNews import GoogleNews
        from nltk.sentiment.vader import SentimentIntensityAnalyzer
        from nltk import download
        import nltk

        # Download NLTK data if needed
        try:
            nltk.data.find('vader_lexicon')
        except LookupError:
            download('vader_lexicon')

        sia = SentimentIntensityAnalyzer()

        print(f"Fetching latest news for: {symbol}")

        # Initialize Google News
        googlenews = GoogleNews(period=f"{days}d")
        googlenews.search(symbol)
        news = googlenews.result()[:max_results]

        if not news:
            print(f"No news found for {symbol}")
            return {
                'symbol': symbol,
                'sentiment_score': 0.0,
                'sentiment_label': 'neutral',
                'articles_analyzed': 0,
                'confidence': 0.0,
                'timestamp': datetime.now().isoformat()
            }

        sentiment_scores = []
        headlines = []

        # Analyze sentiment for each article
        for item in news:
            title = item.get('title', '')
            if title:
                sentiment = sia.polarity_scores(title)['compound']
                sentiment_scores.append(sentiment)
                headlines.append({
                    'title': title,
                    'sentiment': sentiment,
                    'date': item.get('date', ''),
                    'link': item.get('link', '')
                })

        # Calculate aggregate sentiment
        avg_sentiment = np.mean(sentiment_scores) if sentiment_scores else 0.0

        # Determine sentiment label
        if avg_sentiment >= 0.05:
            label = 'positive'
        elif avg_sentiment <= -0.05:
            label = 'negative'
        else:
            label = 'neutral'

        # Calculate confidence based on number of articles and sentiment variance
        confidence = min(len(sentiment_scores) / max_results, 1.0) * (1 - np.var(sentiment_scores)) if sentiment_scores else 0.0

        return {
            'symbol': symbol,
            'sentiment_score': float(avg_sentiment),  # -1 (very negative) to 1 (very positive)
            'sentiment_label': label,
            'articles_analyzed': len(sentiment_scores),
            'confidence': float(confidence),
            'headlines': headlines[:5],  # Top 5 headlines
            'timestamp': datetime.now().isoformat()
        }

    except Exception as e:
        print(f"Error analyzing sentiment: {str(e)}")
        return {
            'symbol': symbol,
            'sentiment_score': 0.0,
            'sentiment_label': 'neutral',
            'articles_analyzed': 0,
            'confidence': 0.0,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }


# ============================================================================
# FORMATTING FUNCTIONS
# ============================================================================

def format_prediction_response(prediction, market='us'):
    """Format prediction for API response"""
    return {
        'symbol': prediction.get('symbol'),
        'name': prediction.get('name'),
        'market': market,
        'currentPrice': prediction.get('currentPrice'),
        'predictedPrice': prediction.get('predictedPrice'),
        'priceChange': prediction.get('priceChange'),
        'confidence': prediction.get('confidence'),
        'trend': prediction.get('trend'),
        'accuracy': prediction.get('accuracy'),
        'factors': prediction.get('factors'),
        'sector': prediction.get('sector'),
        'timeframe': prediction.get('timeframe'),
        'timestamp': datetime.now().isoformat()
    }


# ============================================================================
# CACHE FUNCTIONS (for future optimization)
# ============================================================================

_cache = {}
_cache_timestamp = {}

def get_from_cache(key, max_age_seconds=300):
    """Get value from cache if not expired"""
    if key in _cache:
        if datetime.now().timestamp() - _cache_timestamp.get(key, 0) < max_age_seconds:
            return _cache[key]
    return None


def set_cache(key, value):
    """Set value in cache"""
    _cache[key] = value
    _cache_timestamp[key] = datetime.now().timestamp()


def clear_cache():
    """Clear entire cache"""
    global _cache, _cache_timestamp
    _cache = {}
    _cache_timestamp = {}


if __name__ == '__main__':
    # Test utilities
    print("Testing utilities...")
    
    # Test stock data fetching
    data = fetch_stock_data('AAPL', days=30)
    if data:
        print(f"Fetched {data['symbol']}: ${data['currentPrice']}")
    
    # Test sentiment analysis
    sentiment = analyze_sentiment('AAPL')
    if sentiment:
        print(f"Sentiment: {sentiment}")
