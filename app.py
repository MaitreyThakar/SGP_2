import argparse
import sys
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from utils import fetch_stock_data, preprocess_data
from models import (
    train_lstm_model, train_rnn_model, train_svm_model, 
    train_random_forest_model, make_predictions, evaluate_model
)
import warnings
warnings.filterwarnings('ignore')

# Since we're not using Streamlit, we need to handle the API key differently
# You can set this as an environment variable or hardcode it (not recommended for production)
import os
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')

if not ALPHA_VANTAGE_API_KEY:
    print("Error: Please set ALPHA_VANTAGE_API_KEY environment variable")
    print("Example: export ALPHA_VANTAGE_API_KEY='your_api_key_here'")
    sys.exit(1)

def parse_arguments():
    parser = argparse.ArgumentParser(description='Stock Price Prediction Tool')
    parser.add_argument('--stock', '-s', type=str, required=True,
                        help='Stock ticker symbol (e.g., AAPL, GOOGL, TSLA)')
    parser.add_argument('--days', '-d', type=int, default=30,
                        help='Number of days to predict (default: 30)')
    parser.add_argument('--model', '-m', type=str, default='lstm',
                        choices=['lstm', 'rnn', 'svm', 'rf'],
                        help='Model to use: lstm, rnn, svm, or rf (random forest)')
    parser.add_argument('--time_step', '-t', type=int, default=60,
                        help='Time step for sequence models (default: 60)')
    parser.add_argument('--train_period', '-p', type=int, default=365,
                        help='Training period in days (default: 365)')
    return parser.parse_args()

def fetch_and_prepare_data(ticker, train_period, time_step):
    """Fetch and prepare data for training"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=train_period + time_step + 30)
    
    print(f"Fetching data for {ticker} from {start_date.date()} to {end_date.date()}...")
    
    # We need to modify the fetch_stock_data function to work without Streamlit
    try:
        from alpha_vantage.timeseries import TimeSeries
        ts = TimeSeries(key=ALPHA_VANTAGE_API_KEY, output_format='pandas')
        data, meta_data = ts.get_daily(symbol=ticker, outputsize='full')
        
        df = data['4. close']
        df = df.iloc[::-1]  # Reverse to have oldest data first
        df.index = pd.to_datetime(df.index)
        
        # Filter by date range
        df = df[(df.index >= start_date) & (df.index <= end_date)]
        df = df.to_frame(name='Close')
        
        if len(df) < time_step + 50:
            print(f"Error: Insufficient data. Got {len(df)} records, need at least {time_step + 50}")
            return None
            
        return df
        
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        print("Please check your API key and internet connection, or verify the ticker symbol is valid.")
        return None

def prepare_training_data(df, time_step, model_type):
    """Prepare data for different model types"""
    X, y, scaler, scaled_data = preprocess_data(df, time_step)
    
    # Split into training and testing sets
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    # Reshape for different models
    if model_type in ['lstm', 'rnn']:
        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
    elif model_type in ['svm', 'rf']:
        # For traditional ML models, flatten the sequences
        X_train = X_train.reshape(X_train.shape[0], -1)
        X_test = X_test.reshape(X_test.shape[0], -1)
    
    return X_train, X_test, y_train, y_test, scaler, scaled_data

def train_model(model_type, X_train, y_train, time_step):
    """Train the specified model"""
    print(f"Training {model_type.upper()} model...")
    
    if model_type == 'lstm':
        model = train_lstm_model(X_train, y_train, time_step)
    elif model_type == 'rnn':
        model = train_rnn_model(X_train, y_train, time_step)
    elif model_type == 'svm':
        model = train_svm_model(X_train, y_train)
    elif model_type == 'rf':
        model = train_random_forest_model(X_train, y_train)
    else:
        raise ValueError(f"Unknown model type: {model_type}")
    
    return model

def predict_future_prices(model, last_sequence, scaler, days_to_predict, model_type):
    """Predict future prices"""
    predictions = []
    current_sequence = last_sequence.copy()
    
    for _ in range(days_to_predict):
        if model_type in ['lstm', 'rnn']:
            # For sequence models
            pred_input = current_sequence.reshape(1, current_sequence.shape[0], 1)
            next_pred = model.predict(pred_input)[0][0]
        else:
            # For traditional ML models
            pred_input = current_sequence.reshape(1, -1)
            next_pred = model.predict(pred_input)[0]
        
        predictions.append(next_pred)
        
        # Update sequence for next prediction
        current_sequence = np.append(current_sequence[1:], next_pred)
    
    # Convert back to original scale
    predictions = np.array(predictions).reshape(-1, 1)
    predictions = scaler.inverse_transform(predictions)
    
    return predictions.flatten()

def display_results(ticker, predictions, days_to_predict, current_price, model_type):
    """Display prediction results"""
    print(f"\n{'='*60}")
    print(f"STOCK PRICE PREDICTIONS FOR {ticker.upper()}")
    print(f"{'='*60}")
    print(f"Model Used: {model_type.upper()}")
    print(f"Current Price: ${current_price:.2f}")
    print(f"Predictions for next {days_to_predict} days:")
    print(f"{'='*60}")
    
    future_dates = pd.date_range(start=datetime.now() + timedelta(days=1), periods=days_to_predict)
    
    for i, (date, price) in enumerate(zip(future_dates, predictions)):
        change = price - current_price
        change_pct = (change / current_price) * 100
        print(f"Day {i+1:2d} ({date.strftime('%Y-%m-%d')}): ${price:7.2f} "
              f"({change:+6.2f}, {change_pct:+5.1f}%)")
    
    print(f"{'='*60}")
    print(f"Predicted price range: ${predictions.min():.2f} - ${predictions.max():.2f}")
    print(f"Average predicted price: ${predictions.mean():.2f}")
    
    final_change = predictions[-1] - current_price
    final_change_pct = (final_change / current_price) * 100
    print(f"Expected change after {days_to_predict} days: ${final_change:+.2f} ({final_change_pct:+.1f}%)")

def main():
    args = parse_arguments()
    
    print("Stock Price Prediction Tool")
    print("=" * 40)
    print(f"Stock: {args.stock.upper()}")
    print(f"Prediction Days: {args.days}")
    print(f"Model: {args.model.upper()}")
    print(f"Time Step: {args.time_step}")
    print("=" * 40)
    
    # Fetch and prepare data
    df = fetch_and_prepare_data(args.stock, args.train_period, args.time_step)
    if df is None:
        sys.exit(1)
    
    current_price = df['Close'].iloc[-1]
    print(f"Data fetched successfully: {len(df)} records")
    print(f"Current price: ${current_price:.2f}")
    
    # Prepare training data
    X_train, X_test, y_train, y_test, scaler, scaled_data = prepare_training_data(
        df, args.time_step, args.model
    )
    
    print(f"Training set size: {len(X_train)}, Test set size: {len(X_test)}")
    
    # Train model
    model = train_model(args.model, X_train, y_train, args.time_step)
    
    # Evaluate on test set
    if args.model in ['lstm', 'rnn']:
        test_predictions = model.predict(X_test)
    else:
        test_predictions = model.predict(X_test).reshape(-1, 1)
    
    test_predictions = scaler.inverse_transform(test_predictions)
    y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))
    rmse = evaluate_model(y_test_actual, test_predictions)
    print(f"Model RMSE on test set: ${rmse:.2f}")
    
    # Predict future prices
    print(f"Generating predictions for next {args.days} days...")
    last_sequence = scaled_data[-args.time_step:]
    
    if args.model in ['svm', 'rf']:
        last_sequence = last_sequence.flatten()
    else:
        last_sequence = last_sequence.flatten()
    
    future_predictions = predict_future_prices(
        model, last_sequence, scaler, args.days, args.model
    )
    
    # Display results
    display_results(args.stock, future_predictions, args.days, current_price, args.model)

if __name__ == "__main__":
    main()
