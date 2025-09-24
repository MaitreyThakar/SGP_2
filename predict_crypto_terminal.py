import sys
import datetime
import requests
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from models import train_lstm_model

def fetch_crypto_data(coin_id, end_date, days=365):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
        "interval": "daily"
    }
    resp = requests.get(url, params=params)
    if resp.status_code != 200:
        print(f"Error fetching data for {coin_id}: {resp.text}")
        return None
    data = resp.json()
    prices = data.get("prices", [])
    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("date", inplace=True)
    df = df[["price"]]
    df = df[df.index <= end_date]
    return df

def fetch_crypto_data_yf(symbol, end_date, period="max"):
    try:
        df = yf.download(symbol, period=period)
        if df.empty:
            print(f"No data found for symbol: {symbol}. Try BTC-USD, ETH-USD, DOGE-USD, etc.")
            return None
        df = df[df.index <= end_date]
        return df[["Close"]].rename(columns={"Close": "price"})
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

def preprocess_data(df, time_step=60):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df["price"].values.reshape(-1, 1))
    X, y = [], []
    for i in range(len(scaled_data) - time_step):
        X.append(scaled_data[i:(i + time_step), 0])
        y.append(scaled_data[i + time_step, 0])
    return np.array(X), np.array(y), scaler, scaled_data

def predict_and_print(df, pred_start_date, scaler, scaled_data, time_step, model):
    last_seq = scaled_data[-time_step:].reshape(1, time_step, 1)
    predictions = []
    input_seq = last_seq.copy()
    for _ in range(5):
        pred = model.predict(input_seq)
        predictions.append(pred[0][0])
        input_seq = np.concatenate((input_seq[:, 1:, :], pred.reshape(1, 1, 1)), axis=1)

    predictions = np.array(predictions).reshape(-1, 1)
    predicted_prices = scaler.inverse_transform(predictions).flatten().tolist()

    print(f"\nPredicted prices for the next 5 days after {pred_start_date.strftime('%Y-%m-%d')}:")
    print("Date         : Predicted Price (USD)")
    for i, price in enumerate(predicted_prices, 1):
        next_day = pred_start_date + datetime.timedelta(days=i)
        print(f"{next_day.strftime('%Y-%m-%d')}: {price:.2f}")
    print("Last 5 actual closing prices before prediction date:")
    print(df['price'].tail())
    print("Last 5 scaled values:")
    print(scaled_data[-5:])
    print("Predicted next 5 days (scaled):")
    print(predictions)
    print("Predicted next 5 days (actual):")
    print(predicted_prices)
    print("Scaler min:", scaler.data_min_)
    print("Scaler max:", scaler.data_max_)
    print("Predicted (scaled):", predictions)

def main():
    coin_id = input("Enter CoinGecko coin id (e.g. bitcoin, ethereum, dogecoin): ").strip().lower()
    date_str = input("Enter prediction start date (YYYY-MM-DD): ").strip()
    try:
        pred_start_date = datetime.datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        print("Invalid date format. Please use YYYY-MM-DD.")
        sys.exit(1)

    end_date = pred_start_date.strftime('%Y-%m-%d')
    df = fetch_crypto_data(coin_id, end_date)
    if df is None or df.empty or len(df) < 61:
        print("\nNo data found for the given coin or not enough data from CoinGecko.")
        print("Please enter Yahoo Finance symbol (e.g. BTC-USD, ETH-USD, DOGE-USD):")
        symbol = input("Enter Yahoo Finance symbol: ").strip().upper()
        df = fetch_crypto_data_yf(symbol, end_date)
        if df is None or df.empty or len(df) < 61:
            print("No data found for the given symbol or not enough data from Yahoo Finance. Exiting.")
            sys.exit(1)

    time_step = 60
    X, y, scaler, scaled_data = preprocess_data(df, time_step)
    X = X.reshape(X.shape[0], time_step, 1)

    model = train_lstm_model(X, y, time_step)
    predict_and_print(df, pred_start_date, scaler, scaled_data, time_step, model)

if __name__ == "__main__":
    main()