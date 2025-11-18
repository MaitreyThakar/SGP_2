# 🔍 Custom Stock & Crypto Search & Prediction Feature

## Overview
The Prediction Dashboard now includes a powerful **Custom Search** feature that allows you to search for ANY US stock symbol or cryptocurrency, train an LSTM model in real-time, and generate AI-powered price predictions.

---

## ✨ Features

### 1. **Search Any Stock/Crypto Button**
- Located in the US Market and Crypto Market tabs of the Prediction Dashboard
- Blue button (US market) or Purple button (Crypto market) with sparkle icon
- "Search Any Stock" for US market
- "Search Any Crypto" for Crypto market

### 2. **Smart Search Modal**
- Clean, modern UI with dark theme
- Real-time symbol validation
- Live training progress indicator
- Error handling with helpful messages

### 3. **AI Model Training**
- **Automatic LSTM model training** for searched stocks
- Uses 90 days of historical data
- Trains a neural network in 30-60 seconds
- Generates 7-day price predictions

### 4. **Comprehensive Prediction**
- Current price
- Predicted price (7-day forecast)
- Confidence score (0-100%)
- Trend analysis (bullish/bearish/neutral)
- Key factors influencing prediction
- Sentiment analysis from news

---

## 🚀 How to Use

### Step 1: Open the Search Modal
1. Navigate to **Prediction** page
2. Select **US Stock Market** or **Cryptocurrency Market** tab
3. Click **"Search Any Stock"** (blue) or **"Search Any Crypto"** (purple) button

### Step 2: Enter Symbol
1. **For US Stocks**: Type any valid US stock symbol (e.g., `NVDA`, `AMD`, `META`)
2. **For Crypto**: Type cryptocurrency with -USD suffix (e.g., `BTC-USD`, `DOGE-USD`, `XRP-USD`)
3. Symbol automatically converts to uppercase
4. Press **Enter** or click **"Train & Predict"** button

### Step 3: Wait for Training
1. System searches for stock in Yahoo Finance
2. Fetches 90 days of historical data
3. Trains LSTM neural network (30-60 seconds)
4. Analyzes news sentiment
5. Generates prediction

### Step 4: View Results
1. Modal automatically closes on success
2. Prediction appears in the main dashboard
3. Chart updates with predicted price trajectory
4. View detailed metrics and confidence score

---

## 📊 What Gets Analyzed

### Data Sources
- **Yahoo Finance**: Historical price data, volume, technical indicators
- **News Sentiment**: Recent news articles (7 days)
- **Technical Indicators**: RSI, MACD, Moving Averages

### ML Model
- **Architecture**: LSTM (Long Short-Term Memory) Neural Network
- **Lookback Period**: 20 days
- **Training Epochs**: 20 iterations
- **Features**: Close price, volume, technical indicators

### Prediction Output
```json
{
  "symbol": "NVDA",
  "name": "NVIDIA Corporation",
  "currentPrice": 875.50,
  "predictedPrice": 892.30,
  "confidence": 78,
  "trend": "bullish",
  "accuracy": 78,
  "factors": [
    "Positive MACD momentum",
    "Positive news sentiment",
    "LSTM price prediction model"
  ],
  "sector": "Technology",
  "timeframe": "7 days",
  "priceChange": 1.92,
  "sentiment_score": 0.15,
  "lstm_prediction": 890.45,
  "sentiment_adjustment": 0.0075
}
```

---

## 🛠️ Technical Architecture

### Frontend Components

#### 1. **useStockSearch Hook** (`/hooks/useStockSearch.js`)
```javascript
const {
  searchSymbol,      // Search for a symbol
  trainAndPredict,   // Train model & predict
  searchAndTrain,    // Combined search + train
  reset,             // Clear all states
  searching,         // Boolean: is searching
  training,          // Boolean: is training
  searchResult,      // Search result data
  prediction,        // Prediction data
  error              // Error message
} = useStockSearch();
```

#### 2. **Search Modal** (in `PredictionDashboard.jsx`)
- Modal with symbol input
- Loading states for search and training
- Error display
- Training progress indicator

#### 3. **API Route** (`/api/search/route.js`)
- Proxies requests to Flask backend
- Validates symbol parameter
- Returns search results or errors

### Backend Endpoints

#### 1. **Search Symbol** (`GET /api/search/<symbol>`)
```python
GET /api/search/NVDA?market=us

Response:
{
  "symbol": "NVDA",
  "name": "NVIDIA Corporation",
  "market": "us",
  "sector": "Technology",
  "currentPrice": 875.50,
  "currency": "USD",
  "found": true,
  "timestamp": "2025-11-18T..."
}
```

#### 2. **Train & Predict** (`POST /api/predictions`)
```python
POST /api/predictions
Body: {
  "symbol": "NVDA",
  "market": "us",
  "period": "7d"
}

Response: {
  ... (full prediction object)
}
```

### Data Flow

```
User Input (NVDA)
    ↓
Search Symbol
    ↓
Validate in Yahoo Finance
    ↓
Fetch Historical Data (90 days)
    ↓
Train LSTM Model (20 epochs)
    ↓
Analyze Sentiment (7 days news)
    ↓
Generate Prediction
    ↓
Display Results
```

---

## ⚙️ Configuration

### Environment Variables
No additional configuration needed! Uses existing:
- `NEXT_PUBLIC_FLASK_URL` (Frontend)
- Backend runs on `http://localhost:5000`

### Model Parameters (can be adjusted in `models.py`)
```python
lookback = 20       # Days to look back for pattern
epochs = 20         # Training iterations (reduced for speed)
batch_size = 32     # Training batch size
```

---

## 🎯 Supported Assets

### Any US Stock Symbol
- Tech: AAPL, MSFT, GOOGL, NVDA, AMD, META
- Auto: TSLA, F, GM
- Finance: JPM, BAC, GS, V, MA
- Retail: AMZN, WMT, TGT
- Healthcare: JNJ, PFE, MRNA
- Energy: XOM, CVX, COP
- **And thousands more!**

### Any Cryptocurrency
- Major: BTC-USD, ETH-USD, BNB-USD
- Altcoins: SOL-USD, ADA-USD, XRP-USD, DOT-USD
- DeFi: UNI-USD, LINK-USD, AAVE-USD
- Meme: DOGE-USD, SHIB-USD
- Layer 2: MATIC-USD, AVAX-USD
- Payment: LTC-USD, XLM-USD
- **And hundreds more!**

### Symbol Format
- **US Stocks**: Just the ticker (e.g., `AAPL`, `NVDA`)
- **Cryptocurrencies**: Symbol with -USD suffix (e.g., `BTC-USD`, `DOGE-USD`)
- **IMPORTANT**: Always use -USD for crypto (not -USDT or other pairs)

---

## 🐛 Error Handling

### Common Errors & Solutions

#### "Symbol not found"
- **Cause**: Invalid ticker symbol
- **Solution**: Double-check symbol on Yahoo Finance

#### "Failed to generate prediction"
- **Cause**: Insufficient historical data
- **Solution**: Try a different, more established stock

#### "Training timeout"
- **Cause**: Large dataset or slow connection
- **Solution**: Wait longer or try again

#### "Connection failed"
- **Cause**: Backend not running
- **Solution**: Start Flask backend with `python app.py`

---

## 📈 Performance

### Training Time
- **Fast stocks** (volatile, lots of data): 30-45 seconds
- **Slow stocks** (stable, less data): 45-60 seconds
- **Average**: ~40 seconds

### Accuracy
- **High confidence (80%+)**: More reliable predictions
- **Medium confidence (60-79%)**: Moderate reliability
- **Low confidence (<60%)**: Take with caution

### Factors Affecting Accuracy
1. **Data Quality**: More historical data = better predictions
2. **Market Conditions**: Volatile markets harder to predict
3. **News Sentiment**: Recent news heavily influences predictions
4. **Technical Patterns**: Clear trends improve accuracy

---

## 🔄 Workflow Example

```
1. User clicks "Search Any Stock"
2. Types "NVDA"
3. System shows "Searching for stock..."
4. Validates symbol exists
5. Shows "Training LSTM model... (30-60s)"
6. Trains neural network on 90 days data
7. Analyzes recent news sentiment
8. Calculates prediction with confidence
9. Modal closes, results display
10. User sees predicted price, trend, factors
```

---

## 💡 Pro Tips

### General
1. **Use well-known assets** for better predictions
2. **Check confidence score** before making decisions
3. **Compare with existing predictions** in the list
4. **Consider news sentiment** shown in factors
5. **Retry if training fails** (occasional API issues)

### Crypto-Specific
1. **Always use -USD suffix** (e.g., `BTC-USD` not `BTC`)
2. **Crypto is more volatile** - expect lower confidence scores
3. **Major coins** (BTC, ETH) typically have better predictions
4. **Meme coins** (DOGE, SHIB) are highly unpredictable
5. **DeFi tokens** may have limited historical data

---

## 🚧 Limitations

### Current Version (v2.0)
- ✅ US Market support
- ✅ Crypto Market support
- ✅ 7-day predictions
- ✅ Single asset at a time
- ❌ No batch training
- ❌ No model caching (retrains each time)
- ❌ No comparison mode

### Future Enhancements
- [ ] Support for Indian market (`.NS` suffix)
- [ ] Custom time periods (1d, 30d, 90d)
- [ ] Model caching for faster repeated predictions
- [ ] Batch processing (multiple assets)
- [ ] Comparison mode (compare predictions)
- [ ] Historical accuracy tracking
- [ ] More crypto trading pairs (BTC-ETH, ETH-BTC, etc.)

---

## 🔧 Developer Notes

### Files Modified/Created

**Frontend:**
- `frontend/src/hooks/useStockSearch.js` (NEW)
- `frontend/src/app/api/search/route.js` (NEW)
- `frontend/src/components/prediction/PredictionDashboard.jsx` (MODIFIED)

**Backend:**
- `app.py` - Added `/api/search/<symbol>` endpoint
- `models.py` - Enhanced `get_company_name()` and `get_sector_from_symbol()`

### Testing the Feature

```bash
# 1. Start Backend
cd d:\PROJECTS\FinPridict\SGP_2
python app.py

# 2. Start Frontend (new terminal)
cd d:\PROJECTS\FinPridict\SGP_2\frontend
npm run dev

# 3. Open Browser
http://localhost:3000/prediction

# 4. Test Symbols

## US Stocks:
- NVDA (NVIDIA)
- AMD (Advanced Micro Devices)
- META (Meta Platforms)
- DIS (Disney)

## Cryptocurrencies:
- BTC-USD (Bitcoin)
- ETH-USD (Ethereum)
- DOGE-USD (Dogecoin)
- XRP-USD (Ripple)
```

---

## 📞 Support

If you encounter issues:
1. Check Flask backend is running
2. Check browser console for errors (F12)
3. Verify symbol exists on Yahoo Finance
4. Try a different stock symbol
5. Restart both backend and frontend

---

**Built with ❤️ using:**
- React + Next.js 15
- TensorFlow LSTM
- Yahoo Finance API
- News Sentiment Analysis

**Happy Predicting! 🚀📈**
