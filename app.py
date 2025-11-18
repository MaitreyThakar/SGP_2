"""
FinPridict Flask Backend API
Serves AI-powered stock predictions and market data
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set TensorFlow environment variable to prevent reloader issues
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Import models and utilities
from models import get_predictions, train_model
from utils import fetch_stock_data, calculate_indicators, format_prediction_response

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
app.config['JSON_SORT_KEYS'] = False
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
DEBUG = FLASK_ENV == 'development'

print("=" * 60)
print("FinPridict Backend Server Starting...")
print("=" * 60)
print(f"Environment: {FLASK_ENV}")
print(f"Debug Mode: {DEBUG}")


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'active',
        'timestamp': datetime.now().isoformat(),
        'service': 'FinPridict API'
    }), 200


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================

@app.route('/api/predictions', methods=['POST'])
def get_prediction():
    """
    Get AI predictions for a stock using LSTM + sentiment analysis

    Request body:
    {
        "symbol": "AAPL",
        "market": "us",  # 'us', 'indian', 'crypto'
        "period": "7d"   # '1d', '7d', '30d', '90d'
    }

    Response:
    {
        "symbol": "AAPL",
        "currentPrice": 175.23,
        "predictedPrice": 185.67,
        "confidence": 78,
        "trend": "bullish",
        "accuracy": 82,
        "factors": [...],
        "sentiment_score": 0.15,
        "lstm_prediction": 182.45,
        "sentiment_adjustment": 0.0075,
        "timeframe": "7 days"
    }
    """
    try:
        data = request.get_json()

        # Validate input
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        symbol = data.get('symbol', '').upper()
        market = data.get('market', 'us').lower()
        period = data.get('period', '7d')

        if not symbol:
            return jsonify({'error': 'Symbol is required'}), 400

        if market not in ['us', 'indian', 'crypto']:
            return jsonify({'error': 'Invalid market. Use: us, indian, crypto'}), 400

        # Get prediction from ML model
        prediction = get_predictions(symbol, market, period)

        if not prediction:
            return jsonify({'error': f'Could not generate prediction for {symbol}. Please check the symbol and try again.'}), 400

        return jsonify(prediction), 200

    except Exception as e:
        print(f"Error in get_prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/search/<symbol>', methods=['GET'])
def search_symbol(symbol):
    """
    Search and validate any stock symbol

    Query params:
    - market: 'us', 'indian', 'crypto' (optional, will try all if not specified)

    Returns symbol information if found
    """
    try:
        symbol = symbol.upper()
        market = request.args.get('market', '').lower()

        markets_to_try = [market] if market in ['us', 'indian', 'crypto'] else ['us', 'indian', 'crypto']

        for m in markets_to_try:
            try:
                # Try to fetch data for this symbol in this market
                stock_data = fetch_stock_data(symbol, days=30)

                if stock_data:
                    # Get company name
                    from models import get_company_name, get_sector_from_symbol
                    name = get_company_name(symbol, m)
                    sector = get_sector_from_symbol(symbol, m)

                    return jsonify({
                        'symbol': symbol,
                        'name': name,
                        'market': m,
                        'sector': sector,
                        'currentPrice': stock_data['currentPrice'],
                        'currency': stock_data.get('currency', 'USD'),
                        'found': True,
                        'timestamp': datetime.now().isoformat()
                    }), 200

            except Exception as e:
                print(f"Error searching {symbol} in {m}: {str(e)}")
                continue

        return jsonify({
            'symbol': symbol,
            'found': False,
            'error': 'Symbol not found in any market',
            'timestamp': datetime.now().isoformat()
        }), 404

    except Exception as e:
        print(f"Error in search_symbol: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/predictions/<market>', methods=['GET'])
def get_market_predictions(market):
    """
    Get all predictions for a specific market
    
    Query params:
    - period: '1d', '7d', '30d', '90d' (default: '7d')
    
    Returns list of predictions for all stocks in that market
    """
    try:
        if market not in ['us', 'indian', 'crypto']:
            return jsonify({'error': 'Invalid market'}), 400
        
        period = request.args.get('period', '7d')
        
        # Define stocks for each market
        market_stocks = {
            'us': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
            'indian': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ITC.NS'],
            'crypto': ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'ADA-USD']
        }
        
        stocks = market_stocks.get(market, [])
        predictions = []
        
        for symbol in stocks:
            try:
                pred = get_predictions(symbol, market, period)
                if pred:
                    predictions.append(pred)
            except Exception as e:
                print(f"Error getting prediction for {symbol}: {str(e)}")
                continue
        
        return jsonify({
            'market': market,
            'count': len(predictions),
            'predictions': predictions,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Error in get_market_predictions: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# STOCK DATA ENDPOINTS
# ============================================================================

@app.route('/api/stock-data/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    """
    Get current stock data and technical indicators
    
    Query params:
    - days: number of historical days (default: 30)
    """
    try:
        symbol = symbol.upper()
        days = request.args.get('days', 30, type=int)
        
        # Fetch stock data
        stock_data = fetch_stock_data(symbol, days)
        
        if not stock_data:
            return jsonify({'error': f'Could not fetch data for {symbol}'}), 400
        
        return jsonify(stock_data), 200
        
    except Exception as e:
        print(f"Error in get_stock_data: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/technical-indicators/<symbol>', methods=['GET'])
def get_technical_indicators(symbol):
    """
    Get technical indicators for a stock (RSI, MACD, Bollinger Bands, etc.)
    
    Query params:
    - period: '1d', '1w', '1m', '3m', '1y' (default: '1m')
    """
    try:
        symbol = symbol.upper()
        period = request.args.get('period', '1m')
        
        indicators = calculate_indicators(symbol, period)
        
        if not indicators:
            return jsonify({'error': f'Could not calculate indicators for {symbol}'}), 400
        
        return jsonify(indicators), 200
        
    except Exception as e:
        print(f"Error in get_technical_indicators: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# MODEL MANAGEMENT ENDPOINTS
# ============================================================================

@app.route('/api/models/train', methods=['POST'])
def train_models():
    """
    Trigger model retraining (admin endpoint)
    
    Request body:
    {
        "market": "us",  # optional
        "force": true    # force retrain
    }
    """
    try:
        data = request.get_json() or {}
        market = data.get('market', None)
        force = data.get('force', False)
        
        result = train_model(market, force)
        
        return jsonify({
            'status': 'training_initiated',
            'market': market,
            'message': result,
            'timestamp': datetime.now().isoformat()
        }), 202
        
    except Exception as e:
        print(f"Error in train_models: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\nStarting FinPridict Flask Server...")
    print("API Documentation: http://localhost:5000")
    print("Health Check: http://localhost:5000/health")
    print("\nAvailable Endpoints:")
    print("  POST   /api/predictions - Get single stock prediction")
    print("  GET    /api/predictions/<market> - Get all predictions for market")
    print("  GET    /api/stock-data/<symbol> - Get stock data")
    print("  GET    /api/technical-indicators/<symbol> - Get indicators")
    print("  POST   /api/models/train - Retrain models")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=DEBUG,
        use_reloader=False  # Disable reloader to prevent TensorFlow file change restarts
    )
