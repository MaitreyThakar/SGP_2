import sys
import datetime
import numpy as np
from utils import fetch_stock_data, preprocess_data
from models import train_lstm_model

def main():
    ticker = input("Enter stock ticker: ").strip().upper()
    date_str = input("Enter prediction start date (YYYY-MM-DD): ").strip()
    try:
        pred_start_date = datetime.datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        print("Invalid date format. Please use YYYY-MM-DD.")
        sys.exit(1)

    end_date = pred_start_date.strftime('%Y-%m-%d')
    start_date = '1900-01-01'

    df = fetch_stock_data(ticker, start_date, end_date)
    if df is None or df.empty:
        print("No data found for the given stock.")
        sys.exit(1)

    time_step = 60  # You can adjust this
    X, y, scaler, scaled_data = preprocess_data(df, time_step)
    X = X.reshape(X.shape[0], time_step, 1)

    # Train LSTM
    model = train_lstm_model(X, y, time_step)

    # Predict next 5 days from the given date
    last_seq = scaled_data[-time_step:].reshape(1, time_step, 1)
    predictions = []
    input_seq = last_seq.copy()
    for _ in range(5):
        pred = model.predict(input_seq)
        predictions.append(pred[0][0])
        input_seq = np.concatenate((input_seq[:, 1:, :], pred.reshape(1, 1, 1)), axis=1)

    predictions = np.array(predictions).reshape(-1, 1)
    predicted_prices = scaler.inverse_transform(predictions).flatten().tolist()

    print(f"Predicted prices for the next 5 days after {end_date}:")
    for i, price in enumerate(predicted_prices, 1):
        next_day = pred_start_date + datetime.timedelta(days=i)
        print(f"{next_day.strftime('%Y-%m-%d')}: {price:.2f}")
    print("Last 5 actual closing prices before prediction date:")
    print(df['Close'].tail())
    print("Last 5 scaled values:")
    print(scaled_data[-5:])

if __name__ == "__main__":
    main()