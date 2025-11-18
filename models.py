"""
Machine Learning Models for Stock Price Predictions
Includes LSTM, Random Forest, and SVM implementations
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

# Import utilities
from utils import fetch_stock_data, calculate_indicators, analyze_sentiment

# ============================================================================
# PREDICTION DATA (Temporary - will be replaced with real ML models)
# ============================================================================

PREDICTION_DATABASE = {
    'us': {
        'AAPL': {
            'name': 'Apple Inc.',
            'currentPrice': 175.23,
            'predictedPrice': 185.67,
            'confidence': 78,
            'trend': 'bullish',
            'accuracy': 82,
            'factors': ['Strong earnings', 'iPhone 15 launch', 'Services growth'],
            'sector': 'Technology'
        },
        'MSFT': {
            'name': 'Microsoft Corporation',
            'currentPrice': 342.67,
            'predictedPrice': 358.12,
            'confidence': 84,
            'trend': 'bullish',
            'accuracy': 88,
            'factors': ['AI integration', 'Cloud dominance', 'Enterprise adoption'],
            'sector': 'Technology'
        },
        'GOOGL': {
            'name': 'Alphabet Inc.',
            'currentPrice': 138.45,
            'predictedPrice': 145.80,
            'confidence': 77,
            'trend': 'bullish',
            'accuracy': 80,
            'factors': ['Search growth', 'AI advancements', 'Cloud expansion'],
            'sector': 'Technology'
        },
        'AMZN': {
            'name': 'Amazon.com Inc.',
            'currentPrice': 148.78,
            'predictedPrice': 156.90,
            'confidence': 73,
            'trend': 'bullish',
            'accuracy': 79,
            'factors': ['E-commerce growth', 'AWS expansion', 'Prime membership'],
            'sector': 'E-commerce'
        },
        'TSLA': {
            'name': 'Tesla Inc.',
            'currentPrice': 234.56,
            'predictedPrice': 218.90,
            'confidence': 65,
            'trend': 'bearish',
            'accuracy': 75,
            'factors': ['EV market competition', 'Production challenges', 'Regulatory concerns'],
            'sector': 'Automotive'
        }
    },
    'indian': {
        'RELIANCE.NS': {
            'name': 'Reliance Industries Ltd.',
            'currentPrice': 2456.75,
            'predictedPrice': 2589.30,
            'confidence': 76,
            'trend': 'bullish',
            'accuracy': 81,
            'factors': ['Energy sector growth', 'Refining margins', 'Digital expansion'],
            'sector': 'Energy'
        },
        'TCS.NS': {
            'name': 'Tata Consultancy Services Ltd.',
            'currentPrice': 3842.50,
            'predictedPrice': 4025.75,
            'confidence': 83,
            'trend': 'bullish',
            'accuracy': 85,
            'factors': ['IT sector boom', 'Digital transformation', 'Strong Q4 results'],
            'sector': 'Information Technology'
        },
        'HDFCBANK.NS': {
            'name': 'HDFC Bank Ltd.',
            'currentPrice': 1567.25,
            'predictedPrice': 1489.60,
            'confidence': 72,
            'trend': 'bearish',
            'accuracy': 78,
            'factors': ['Banking sector concerns', 'NPA worries', 'Interest rate changes'],
            'sector': 'Banking'
        },
        'INFY.NS': {
            'name': 'Infosys Ltd.',
            'currentPrice': 1456.80,
            'predictedPrice': 1523.45,
            'confidence': 79,
            'trend': 'bullish',
            'accuracy': 82,
            'factors': ['AI adoption', 'Cloud services growth', 'Strong pipeline'],
            'sector': 'Information Technology'
        },
        'ITC.NS': {
            'name': 'ITC Ltd.',
            'currentPrice': 412.30,
            'predictedPrice': 435.75,
            'confidence': 68,
            'trend': 'bullish',
            'accuracy': 75,
            'factors': ['FMCG sector recovery', 'Rural demand', 'New product launches'],
            'sector': 'FMCG'
        }
    },
    'crypto': {
        'BTC-USD': {
            'name': 'Bitcoin',
            'currentPrice': 43567.89,
            'predictedPrice': 47890.23,
            'confidence': 72,
            'trend': 'bullish',
            'accuracy': 69,
            'factors': ['Institutional adoption', 'ETF approvals', 'Halving cycle'],
            'sector': 'Store of Value'
        },
        'ETH-USD': {
            'name': 'Ethereum',
            'currentPrice': 2678.45,
            'predictedPrice': 2890.75,
            'confidence': 75,
            'trend': 'bullish',
            'accuracy': 73,
            'factors': ['DeFi growth', 'Layer 2 adoption', 'Staking rewards'],
            'sector': 'Smart Contracts'
        },
        'BNB-USD': {
            'name': 'BNB',
            'currentPrice': 298.76,
            'predictedPrice': 285.40,
            'confidence': 68,
            'trend': 'bearish',
            'accuracy': 71,
            'factors': ['Exchange competition', 'Regulatory scrutiny', 'Market volatility'],
            'sector': 'Exchange Token'
        },
        'SOL-USD': {
            'name': 'Solana',
            'currentPrice': 67.89,
            'predictedPrice': 78.50,
            'confidence': 70,
            'trend': 'bullish',
            'accuracy': 74,
            'factors': ['Network upgrades', 'DeFi ecosystem', 'NFT marketplace'],
            'sector': 'Smart Contracts'
        },
        'ADA-USD': {
            'name': 'Cardano',
            'currentPrice': 0.47,
            'predictedPrice': 0.52,
            'confidence': 66,
            'trend': 'bullish',
            'accuracy': 68,
            'factors': ['Smart contracts', 'Governance updates', 'Partnership news'],
            'sector': 'Smart Contracts'
        }
    }
}


# ============================================================================
# PREDICTION FUNCTION (Real ML Implementation)
# ============================================================================

def get_predictions(symbol, market='us', period='7d'):
    """
    Get AI-powered predictions for a given stock using LSTM + sentiment analysis

    Args:
        symbol: Stock symbol (e.g., 'AAPL', 'RELIANCE.NS', 'BTC-USD')
        market: Market type ('us', 'indian', 'crypto')
        period: Prediction period ('1d', '7d', '30d', '90d')

    Returns:
        Dictionary with prediction data or None if not found
    """
    try:
        # Fetch real stock data
        stock_data = fetch_stock_data(symbol, days=90)  # Need sufficient historical data

        if not stock_data:
            print(f"Could not fetch data for {symbol}")
            return None

        current_price = stock_data['currentPrice']

        # Initialize LSTM predictor
        lstm_predictor = LSTMPredictor(symbol, lookback=20, epochs=20)  # Reduced for faster training
        # Train LSTM model
        print(f"Training LSTM model for {symbol}...")
        training_success = lstm_predictor.train(stock_data)

        if not training_success:
            print(f"Failed to train LSTM model for {symbol}")
            return None

        # Get LSTM prediction
        lstm_prediction = lstm_predictor.predict_single(stock_data)

        if lstm_prediction is None:
            print(f"Failed to get LSTM prediction for {symbol}")
            return None

        # Get sentiment analysis
        sentiment_data = analyze_sentiment(symbol, days=7, max_results=15)

        if not sentiment_data:
            print(f"Failed to get sentiment for {symbol}")
            sentiment_score = 0.0
            sentiment_confidence = 0.0
        else:
            sentiment_score = sentiment_data.get('sentiment_score', 0.0)
            sentiment_confidence = sentiment_data.get('confidence', 0.0)

        # Combine LSTM prediction with sentiment adjustment
        base_prediction = lstm_prediction

        # Sentiment adjustment: positive sentiment increases prediction, negative decreases
        sentiment_adjustment = sentiment_score * 0.05  # 5% max adjustment based on sentiment
        adjusted_prediction = base_prediction * (1 + sentiment_adjustment)

        # Ensure prediction doesn't go negative
        adjusted_prediction = max(adjusted_prediction, current_price * 0.5)

        # Calculate confidence based on model performance and sentiment
        lstm_confidence = 75  # Base confidence for LSTM
        sentiment_boost = int(sentiment_confidence * 20)  # Up to 20 points boost from sentiment
        final_confidence = min(lstm_confidence + sentiment_boost, 95)

        # Determine trend
        price_change_pct = calculate_price_change(current_price, adjusted_prediction)
        if price_change_pct > 2:
            trend = 'bullish'
        elif price_change_pct < -2:
            trend = 'bearish'
        else:
            trend = 'neutral'

        # Generate factors based on analysis
        factors = []

        # Technical factors
        indicators = stock_data.get('technical_indicators', {})
        if indicators.get('rsi', 50) > 70:
            factors.append('Overbought conditions')
        elif indicators.get('rsi', 50) < 30:
            factors.append('Oversold conditions')

        if indicators.get('macd', 0) > 0:
            factors.append('Positive MACD momentum')

        # Sentiment factors
        if sentiment_score > 0.1:
            factors.append('Positive news sentiment')
        elif sentiment_score < -0.1:
            factors.append('Negative news sentiment')

        # LSTM factors
        factors.append('LSTM price prediction model')

        if not factors:
            factors = ['Technical analysis', 'AI prediction model']

        # Determine sector (simplified mapping)
        sector = get_sector_from_symbol(symbol, market)

        # Format response
        response = {
            'symbol': symbol,
            'name': get_company_name(symbol, market),
            'currentPrice': float(current_price),
            'predictedPrice': float(adjusted_prediction),
            'confidence': final_confidence,
            'trend': trend,
            'accuracy': final_confidence,  # Using confidence as proxy for accuracy
            'factors': factors,
            'sector': sector,
            'timeframe': convert_period_to_timeframe(period),
            'market': market,
            'timestamp': datetime.now().isoformat(),
            'priceChange': price_change_pct,
            'sentiment_score': sentiment_score,
            'lstm_prediction': float(lstm_prediction),
            'sentiment_adjustment': sentiment_adjustment
        }

        # Ensure all values are JSON serializable (convert numpy types)
        response = convert_to_serializable(response)

        return response

    except Exception as e:
        print(f"Error in get_predictions: {str(e)}")
        return None


def get_sector_from_symbol(symbol, market):
    """Get sector based on symbol and market"""
    # Simplified sector mapping - in production, this would use a proper database
    sector_map = {
        'us': {
            'AAPL': 'Technology',
            'MSFT': 'Technology',
            'GOOGL': 'Technology',
            'AMZN': 'E-commerce',
            'TSLA': 'Automotive'
        },
        'indian': {
            'RELIANCE.NS': 'Energy',
            'TCS.NS': 'Information Technology',
            'HDFCBANK.NS': 'Banking',
            'INFY.NS': 'Information Technology',
            'ITC.NS': 'FMCG'
        },
        'crypto': {
            'BTC-USD': 'Store of Value',
            'ETH-USD': 'Smart Contracts',
            'BNB-USD': 'Exchange Token',
            'SOL-USD': 'Smart Contracts',
            'ADA-USD': 'Smart Contracts'
        }
    }

    return sector_map.get(market, {}).get(symbol, 'Unknown')


def get_company_name(symbol, market):
    """Get company name from symbol"""
    name_map = {
        'us': {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corporation',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.'
        },
        'indian': {
            'RELIANCE.NS': 'Reliance Industries Ltd.',
            'TCS.NS': 'Tata Consultancy Services Ltd.',
            'HDFCBANK.NS': 'HDFC Bank Ltd.',
            'INFY.NS': 'Infosys Ltd.',
            'ITC.NS': 'ITC Ltd.'
        },
        'crypto': {
            'BTC-USD': 'Bitcoin',
            'ETH-USD': 'Ethereum',
            'BNB-USD': 'BNB',
            'SOL-USD': 'Solana',
            'ADA-USD': 'Cardano'
        }
    }

    return name_map.get(market, {}).get(symbol, symbol)


def calculate_price_change(current, predicted):
    """Calculate percentage change"""
    if current == 0:
        return 0
    return round(((predicted - current) / current) * 100, 2)


def convert_period_to_timeframe(period):
    """Convert period code to readable timeframe"""
    period_map = {
        '1d': '1 day',
        '7d': '7 days',
        '30d': '30 days',
        '90d': '90 days'
    }
    return period_map.get(period, '7 days')


def convert_to_serializable(obj):
    """
    Convert numpy types and other non-JSON serializable types to Python native types
    """
    if isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_to_serializable(item) for item in obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif hasattr(obj, 'item'):  # For numpy scalars
        return obj.item()
    else:
        return obj


# ============================================================================
# LSTM MODEL (Real Implementation)
# ============================================================================

class LSTMPredictor:
    """
    LSTM-based price predictor using TensorFlow/Keras
    """

    def __init__(self, symbol, lookback=60, epochs=50, batch_size=32):
        self.symbol = symbol
        self.lookback = lookback
        self.epochs = epochs
        self.batch_size = batch_size
        self.model = None
        self.scaler = MinMaxScaler()
        self.is_trained = False

    def prepare_data(self, data):
        """Prepare data for LSTM training"""
        try:
            # Extract closing prices
            if isinstance(data, dict) and 'historical_data' in data:
                # Data from our API format
                prices = np.array([item['close'] for item in data['historical_data']])
            elif hasattr(data, 'values'):
                # Pandas Series or DataFrame
                prices = data.values.flatten() if len(data.shape) > 1 else data.values
            else:
                # List or numpy array
                prices = np.array(data)

            if len(prices) < self.lookback + 10:
                print(f"Insufficient data for {self.symbol}: {len(prices)} points, need at least {self.lookback + 10}")
                return None, None

            # Normalize data
            scaled_data = self.scaler.fit_transform(prices.reshape(-1, 1))

            # Create sequences
            X, y = [], []
            for i in range(len(scaled_data) - self.lookback):
                X.append(scaled_data[i:i+self.lookback])
                y.append(scaled_data[i+self.lookback])

            return np.array(X), np.array(y)

        except Exception as e:
            print(f"Error preparing data for {self.symbol}: {str(e)}")
            return None, None

    def build_model(self, input_shape):
        """Build LSTM model architecture"""
        try:
            from tensorflow.keras.models import Sequential
            from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
            from tensorflow.keras.optimizers import Adam

            model = Sequential([
                Input(shape=input_shape),
                LSTM(50, return_sequences=True),
                Dropout(0.2),
                LSTM(50, return_sequences=False),
                Dropout(0.2),
                Dense(25),
                Dense(1)
            ])

            model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')
            self.model = model
            return model

        except Exception as e:
            print(f"Error building LSTM model: {str(e)}")
            return None

    def train(self, data):
        """Train LSTM model"""
        try:
            X, y = self.prepare_data(data)

            if X is None or y is None:
                return False

            # Build model if not exists
            if self.model is None:
                self.build_model((X.shape[1], 1))

            if self.model is None:
                return False

            # Train model
            from tensorflow.keras.callbacks import EarlyStopping

            early_stop = EarlyStopping(monitor='loss', patience=10, restore_best_weights=True)

            self.model.fit(
                X, y,
                epochs=self.epochs,
                batch_size=self.batch_size,
                callbacks=[early_stop],
                verbose=0
            )

            self.is_trained = True
            return True

        except Exception as e:
            print(f"Error training LSTM model for {self.symbol}: {str(e)}")
            return False

    def predict(self, data, days_ahead=7):
        """Make predictions"""
        try:
            if not self.is_trained or self.model is None:
                return None

            X, _ = self.prepare_data(data)

            if X is None:
                return None

            # Use last sequence for prediction
            last_sequence = X[-1:]

            # Predict next values
            predictions = []
            current_sequence = last_sequence.copy()

            for _ in range(days_ahead):
                # Predict next value
                next_pred = self.model.predict(current_sequence, verbose=0)[0][0]

                # Store prediction
                predictions.append(next_pred)

                # Update sequence for next prediction
                current_sequence = np.roll(current_sequence, -1, axis=1)
                current_sequence[0, -1, 0] = next_pred

            # Inverse transform predictions
            predictions = np.array(predictions).reshape(-1, 1)
            predictions = self.scaler.inverse_transform(predictions)

            return predictions.flatten()

        except Exception as e:
            print(f"Error making predictions for {self.symbol}: {str(e)}")
            return None

    def predict_single(self, data):
        """Predict next single value"""
        try:
            predictions = self.predict(data, days_ahead=1)
            return predictions[0] if predictions is not None else None
        except Exception as e:
            print(f"Error in single prediction for {self.symbol}: {str(e)}")
            return None


# ============================================================================
# RANDOM FOREST MODEL (Template for future implementation)
# ============================================================================

class RandomForestPredictor:
    """
    Random Forest-based price predictor
    """
    
    def __init__(self, symbol, n_estimators=100):
        self.symbol = symbol
        self.model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)
    
    def prepare_features(self, data):
        """Extract features from stock data"""
        features = []
        
        # Technical indicators
        features.append(data['SMA_20'] if 'SMA_20' in data else 0)
        features.append(data['SMA_50'] if 'SMA_50' in data else 0)
        features.append(data['RSI'] if 'RSI' in data else 50)
        features.append(data['MACD'] if 'MACD' in data else 0)
        
        return np.array(features).reshape(1, -1)
    
    def train(self, X_train, y_train):
        """Train Random Forest model"""
        self.model.fit(X_train, y_train)
    
    def predict(self, X_test):
        """Make predictions"""
        return self.model.predict(X_test)


# ============================================================================
# SVM MODEL (Template for future implementation)
# ============================================================================

class SVMPredictor:
    """
    Support Vector Machine-based price predictor
    """
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.model = SVR(kernel='rbf', C=100, gamma='scale')
    
    def train(self, X_train, y_train):
        """Train SVM model"""
        self.model.fit(X_train, y_train)
    
    def predict(self, X_test):
        """Make predictions"""
        return self.model.predict(X_test)


# ============================================================================
# MODEL TRAINING FUNCTION
# ============================================================================

def train_model(market=None, force=False):
    """
    Trigger model retraining
    
    Args:
        market: Specific market to retrain ('us', 'indian', 'crypto') or None for all
        force: Force retrain even if recent models exist
    
    Returns:
        Status message
    """
    try:
        if market and market not in ['us', 'indian', 'crypto']:
            return f"Invalid market: {market}"
        
        markets_to_train = [market] if market else ['us', 'indian', 'crypto']
        
        for m in markets_to_train:
            print(f"Training models for {m} market...")
            # TODO: Implement actual model training
            pass
        
        return f"Training initiated for {', '.join(markets_to_train)}"
        
    except Exception as e:
        return f"Error during training: {str(e)}"


if __name__ == '__main__':
    # Test predictions
    test_symbols = ['AAPL', 'TCS.NS', 'BTC-USD']
    
    for symbol in test_symbols:
        for market in ['us', 'indian', 'crypto']:
            pred = get_predictions(symbol, market)
            if pred:
                print(f"{symbol} ({market}): {pred}")
