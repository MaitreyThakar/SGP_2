# FinPridict ML Implementation TODO

## Phase 1: Sentiment Analysis Integration
- [x] Integrate GoogleNews + NLTK VADER from scrape_news_sentiment.py into utils.py analyze_sentiment function
- [ ] Test sentiment analysis for sample stocks

## Phase 2: LSTM Implementation
- [x] Implement LSTMPredictor class with TensorFlow/Keras
- [x] Add model training logic with historical data
- [x] Add prediction logic for price forecasting
- [ ] Test LSTM on sample US and crypto stocks

## Phase 3: Dynamic Prediction Pipeline
- [x] Create combine_predictions function (LSTM + sentiment + technical indicators)
- [x] Update get_predictions to use real ML instead of mock database
- [x] Implement confidence scoring based on model accuracy

## Phase 4: Search Functionality
- [x] Add /api/search/<symbol> endpoint to validate any stock symbol
- [x] Update prediction endpoints to handle dynamic symbols
- [x] Remove hardcoded PREDICTION_DATABASE dependency

## Phase 5: Frontend Updates
- [ ] Update PredictionDashboard to handle dynamic data
- [ ] Add search input for any stock symbol
- [ ] Update usePredictions hook for search functionality

## Phase 6: Testing & Validation
- [ ] Test complete pipeline for US stocks (AAPL, MSFT, etc.)
- [ ] Test complete pipeline for crypto (BTC-USD, ETH-USD, etc.)
- [ ] Verify sentiment impact on predictions
- [ ] Performance optimization and error handling
