from flask import Flask, request, jsonify
from models import train_lstm_model, make_predictions
from utils import get_stock_data, preprocess_data, scaler
import numpy as np
import datetime

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    stock_title = data.get('stock_title')
    if not stock_title:
        return jsonify({'error': 'Stock title is required'}), 400

    # Fetch historical data from earliest to today
    end_date = datetime.datetime.today().strftime('%Y-%m-%d')
    start_date = '1900-01-01'  # Or use earliest available
    df = get_stock_data(stock_title, start_date, end_date)
    if df is None or df.empty:
        return jsonify({'error': 'No data found for the given stock'}), 404

    # Preprocess data
    X_train, y_train, X_test, time_step = preprocess_data(df)

    # Train LSTM model
    lstm_model = train_lstm_model(X_train, y_train, time_step)

    # Predict next 5 days
    last_data = X_test[-1].reshape(1, time_step, 1)
    predictions = []
    input_seq = last_data.copy()
    for _ in range(5):
        pred = lstm_model.predict(input_seq)
        predictions.append(pred[0][0])
        # Update input_seq for next prediction
        input_seq = np.append(input_seq[:, 1:, :], [[pred]], axis=1)

    # Inverse transform predictions
    predictions = np.array(predictions).reshape(-1, 1)
    predicted_prices = scaler.inverse_transform(predictions).flatten().tolist()

    return jsonify({'next_5_days_prices': predicted_prices})

if __name__ == '__main__':
    app.run(debug=True)
