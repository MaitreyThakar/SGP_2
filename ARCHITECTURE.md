# FinPridict Full-Stack Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                   (Web Browser - Frontend)                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    HTTP/REST API Requests
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    FRONTEND LAYER                               │
│               (Next.js 15 - React Framework)                    │
│                                                                  │
│  ├── Page: /prediction                                          │
│  │   └── Component: PredictionDashboard                         │
│  │       ├── Uses Hook: usePredictions()                        │
│  │       └── Uses Hook: usePrediction()                         │
│  │                                                              │
│  └── API Route: /api/predictions                                │
│      └── Proxy to Flask Backend                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         HTTP POST/GET Requests (CORS Enabled)
                 http://localhost:5000
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                  BACKEND API LAYER                              │
│               (Flask - Python Framework)                        │
│                                                                  │
│  Endpoints:                                                     │
│  ├── POST   /api/predictions                                    │
│  ├── GET    /api/predictions/<market>                           │
│  ├── GET    /api/stock-data/<symbol>                            │
│  ├── GET    /api/technical-indicators/<symbol>                  │
│  ├── GET    /health                                             │
│  └── POST   /api/models/train                                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         Function Calls & Data Processing
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│                  (Python Modules)                               │
│                                                                  │
│  ├── models.py                                                  │
│  │   ├── get_predictions()     - Main prediction function      │
│  │   ├── LSTMPredictor         - Deep Learning Model           │
│  │   ├── RandomForestPredictor - Ensemble Model               │
│  │   └── SVMPredictor          - SVM Model                     │
│  │                                                              │
│  └── utils.py                                                   │
│      ├── fetch_stock_data()    - Fetch from Yahoo Finance     │
│      ├── calculate_indicators()- Technical Analysis            │
│      ├── analyze_sentiment()   - Sentiment Analysis            │
│      └── format_prediction_response()                           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
           API Calls to External Services
                                 │
        ┌────────────┬───────────┴──────────┬────────────┐
        │            │                       │            │
        ▼            ▼                       ▼            ▼
   ┌─────────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐
   │  Yahoo  │ │   Alpha    │ │ CoinGecko│ │   News   │
   │ Finance │ │  Vantage   │ │   API    │ │   APIs   │
   └─────────┘ └────────────┘ └──────────┘ └──────────┘
      (Stocks)   (Indicators)   (Crypto)    (Sentiment)
```

---

## 📁 Project File Structure

```
SGP_2-main/
│
├── 🐍 BACKEND (Python/Flask)
│   ├── app.py                    # Flask application entry point
│   │   └── Initializes Flask app, defines routes, error handlers
│   │
│   ├── models.py                 # Machine Learning Models
│   │   ├── get_predictions()     # Main prediction logic
│   │   ├── PREDICTION_DATABASE   # Mock data (fallback)
│   │   ├── LSTMPredictor         # TensorFlow LSTM model
│   │   ├── RandomForestPredictor # Scikit-learn ensemble
│   │   └── SVMPredictor          # Support Vector Machine
│   │
│   ├── utils.py                  # Data Processing Utilities
│   │   ├── fetch_stock_data()    # Yahoo Finance/Alpha Vantage
│   │   ├── calculate_indicators()# RSI, MACD, Bollinger Bands
│   │   ├── analyze_sentiment()   # News sentiment analysis
│   │   └── Cache functions
│   │
│   ├── requirements.txt          # Python dependencies
│   │   ├── flask, flask-cors
│   │   ├── pandas, numpy
│   │   ├── scikit-learn
│   │   ├── tensorflow
│   │   ├── yfinance
│   │   └── alpha-vantage
│   │
│   ├── .env                      # Backend environment variables
│   │   └── ALPHA_VANTAGE_API_KEY
│   │
│   ├── start-dev.bat             # Windows batch starter
│   └── start-dev.ps1             # PowerShell starter
│
├── 📦 FRONTEND (Next.js/React)
│   └── frontend/
│       │
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.js                  # Landing page
│       │   │   ├── layout.js                # Root layout
│       │   │   ├── globals.css              # Global styles
│       │   │   │
│       │   │   ├── prediction/
│       │   │   │   └── page.js              # Prediction page (Protected)
│       │   │   │
│       │   │   ├── dashboard/
│       │   │   │   └── page.js              # Dashboard page
│       │   │   │
│       │   │   ├── us-market/, indian-market/, crypto-market/
│       │   │   │   └── page.js              # Market views
│       │   │   │
│       │   │   └── api/
│       │   │       └── predictions/
│       │   │           └── route.js         # 🔌 API PROXY (Crucial!)
│       │   │               ├── POST /api/predictions
│       │   │               └── GET /api/predictions?market=us&period=7d
│       │   │
│       │   ├── components/
│       │   │   ├── prediction/
│       │   │   │   └── PredictionDashboard.jsx  # 🎯 MAIN COMPONENT
│       │   │   │       ├── Imports usePredictions hook
│       │   │   │       ├── Renders market tabs
│       │   │   │       ├── Displays chart
│       │   │   │       ├── Shows prediction cards
│       │   │   │       └── Handles errors & loading
│       │   │   │
│       │   │   ├── common/
│       │   │   │   ├── StockChart.jsx       # Recharts visualization
│       │   │   │   ├── Navbar.jsx
│       │   │   │   ├── Footer.jsx
│       │   │   │   ├── Loading.jsx
│       │   │   │   └── ProtectedRoute.jsx
│       │   │   │
│       │   │   ├── dashboard/
│       │   │   │   ├── DashboardStats.jsx
│       │   │   │   ├── MarketOverview.jsx
│       │   │   │   ├── WatchList.jsx
│       │   │   │   └── StockWatchlistChart.jsx
│       │   │   │
│       │   │   ├── markets/
│       │   │   │   ├── USMarketList.jsx
│       │   │   │   ├── IndianMarketList.jsx
│       │   │   │   └── CryptoMarketList.jsx
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   ├── Login.jsx
│       │   │   │   └── Signup.jsx
│       │   │   │
│       │   │   └── home/
│       │   │       ├── Hero.jsx
│       │   │       ├── Features.jsx
│       │   │       └── Statistics.jsx
│       │   │
│       │   ├── hooks/
│       │   │   ├── useMarketData.js         # Fetch market data
│       │   │   └── usePredictions.js        # 🔌 CRITICAL HOOK
│       │   │       ├── usePredictions()     - Fetch all predictions
│       │   │       └── usePrediction()      - Fetch single prediction
│       │   │
│       │   ├── contexts/
│       │   │   └── AuthContext.jsx          # Auth state management
│       │   │
│       │   └── lib/
│       │       └── supabase.js              # Supabase client
│       │
│       ├── public/                          # Static assets
│       │
│       ├── .env.local                       # Frontend env vars
│       │   └── NEXT_PUBLIC_FLASK_URL=http://localhost:5000
│       │
│       ├── package.json                     # Node dependencies
│       │   ├── next, react, react-dom
│       │   ├── tailwindcss
│       │   ├── recharts
│       │   ├── lucide-react
│       │   └── @supabase/*
│       │
│       ├── next.config.mjs
│       ├── tailwind.config.js
│       ├── postcss.config.mjs
│       └── tsconfig.json
│
├── 📋 DOCUMENTATION
│   ├── README.md                 # Project overview
│   ├── SETUP_GUIDE.md            # Installation & running guide
│   ├── PROJECT_KINGDOM_MAP.md    # Detailed architecture
│   └── ARCHITECTURE.md           # This file
│
└── 🔧 CONFIGURATION
    ├── .env                      # Backend env vars
    ├── .gitignore
    └── .git/                     # Version control
```

---

## 🔄 Data Flow Diagram

### **Scenario: User Switches Market & Views Stock Prediction**

```
1. USER ACTION
   └─► Click on "Indian Stock Market" tab

2. FRONTEND STATE UPDATE
   └─► setSelectedMarket('indian')

3. REACT HOOK TRIGGER
   └─► usePredictions('indian', '7d')

4. HTTP REQUEST
   └─► fetch('/api/predictions?market=indian&period=7d')

5. NEXT.JS API PROXY ROUTE
   └─► /api/predictions/route.js
       └─► Validates query params
       └─► Calls fetch(http://localhost:5000/api/predictions/indian)

6. FLASK BACKEND PROCESSING
   └─► GET /api/predictions/indian
       └─► get_market_predictions('indian')
           └─► Loop through market stocks
               └─► get_predictions(symbol, 'indian', '7d')
                   └─► PREDICTION_DATABASE['indian'][symbol]
                   └─► Return formatted prediction

7. API RESPONSE
   └─► {
         "market": "indian",
         "count": 5,
         "predictions": [
           {
             "symbol": "RELIANCE.NS",
             "name": "Reliance Industries Ltd.",
             "currentPrice": 2456.75,
             "predictedPrice": 2589.30,
             "confidence": 76,
             ...
           },
           ...
         ]
       }

8. FRONTEND RECEIVES DATA
   └─► Hook updates state: setPredictions(data.predictions)
       └─► Component re-renders

9. UI UPDATES
   └─► Prediction cards display with Indian market data
   └─► Stock symbols in ₹ (Indian Rupee)
   └─► Chart updates if stock selected
```

---

## 🔐 Authentication Flow

```
User Clicks "Sign in with Google"
           │
           ▼
┌─────────────────────────┐
│   Supabase Auth UI      │
│   (Google OAuth)        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Google Authorization   │
│  (User Login)           │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Redirect to /profile   │
│  with auth token        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  AuthContext stores:    │
│  - user                 │
│  - session token        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ ProtectedRoute checks:  │
│ - user exists?          │
│ - Allow access          │
└─────────────────────────┘
```

---

## 🌐 API Endpoint Reference

### **Predictions API**

```
POST /api/predictions
Request:
{
  "symbol": "AAPL",
  "market": "us",
  "period": "7d"
}

Response:
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "currentPrice": 175.23,
  "predictedPrice": 185.67,
  "confidence": 78,
  "trend": "bullish",
  "accuracy": 82,
  "factors": ["Strong earnings", "iPhone 15 launch", "Services growth"],
  "sector": "Technology",
  "timeframe": "7 days",
  "priceChange": 5.96,
  "timestamp": "2025-11-17T..."
}
```

```
GET /api/predictions/<market>?period=7d
Response:
{
  "market": "us",
  "count": 5,
  "predictions": [
    { ...prediction data... },
    { ...prediction data... },
    ...
  ],
  "timestamp": "2025-11-17T..."
}
```

### **Stock Data API**

```
GET /api/stock-data/<symbol>?days=30
Response:
{
  "symbol": "AAPL",
  "currentPrice": 175.23,
  "currency": "USD",
  "dayHigh": 176.50,
  "dayLow": 174.80,
  "volume": 52500000,
  "marketCap": 2800000000000,
  "pe_ratio": 28.5,
  "technical_indicators": {
    "sma_20": 172.35,
    "sma_50": 170.12,
    "rsi": 65.5,
    "macd": 0.82
  },
  "historical_data": [ ... ]
}
```

### **System API**

```
GET /health
Response:
{
  "status": "active",
  "timestamp": "2025-11-17T...",
  "service": "FinPridict API"
}
```

---

## 🛠️ Technology Stack Details

### **Frontend Technologies**

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 15.4.3 | React framework with server-side rendering |
| React | 19.1.0 | UI component library |
| Tailwind CSS | 4.0 | Utility-first CSS styling |
| Recharts | 3.1.2 | Interactive chart library |
| Lucide React | 0.525.0 | Icon library |
| Supabase | 2.55.0 | Auth & database |
| Framer Motion | 12.23.7 | Animation library |

### **Backend Technologies**

| Tech | Version | Purpose |
|------|---------|---------|
| Flask | 3.0.0 | Lightweight Python web framework |
| Flask-CORS | 4.0.0 | Cross-origin request handling |
| Pandas | 2.0.0 | Data manipulation & analysis |
| NumPy | 1.23.5 | Numerical computing |
| Scikit-learn | 1.3.0 | Machine learning algorithms |
| TensorFlow | 2.13.0 | Deep learning (LSTM/RNN) |
| yfinance | 0.2.28 | Yahoo Finance data fetching |
| Alpha Vantage | 2.3.1 | Stock market data API |

---

## 🚀 Deployment Architecture

### **Production Setup**

```
┌──────────────────────────────────────────────────────┐
│           Frontend (Vercel)                          │
│  - Auto-deploy from GitHub                          │
│  - Global CDN distribution                          │
│  - Environment variables: NEXT_PUBLIC_FLASK_URL     │
│  - URL: https://finpridict.vercel.app               │
└────────────────┬─────────────────────────────────────┘
                 │
        HTTPS API Requests
                 │
┌────────────────▼─────────────────────────────────────┐
│           Backend (Railway/Heroku)                   │
│  - Flask API deployment                             │
│  - Auto-deploy from GitHub                          │
│  - Environment variables: ALPHA_VANTAGE_API_KEY     │
│  - URL: https://finpridict-api.railway.app          │
│  - Database: PostgreSQL (for future)                │
└──────────────────────────────────────────────────────┘
```

---

## 🔮 Future Enhancements

### **Short Term**
1. Replace mock data with real ML models
2. Add caching layer (Redis)
3. Implement user watchlists (Database)
4. Real-time WebSocket updates

### **Medium Term**
1. Mobile app (React Native)
2. Advanced technical indicators
3. Portfolio optimization
4. Risk assessment module

### **Long Term**
1. Distributed training pipeline
2. Multi-model ensemble voting
3. Sentiment analysis integration
4. Advanced charting (TradingView)

---

## 📊 Performance Considerations

### **Frontend**
- Code splitting with Next.js
- Image optimization
- Lazy loading components
- Client-side caching with React hooks

### **Backend**
- API response caching (5 min default)
- Database connection pooling (future)
- Async request handling
- Rate limiting

### **Optimization Goals**
- Frontend load time: < 2 seconds
- API response time: < 500ms
- Mobile rendering: 60 FPS
- Lighthouse score: 90+

---

This architecture is designed to be **scalable**, **maintainable**, and **extensible** for future enhancements!
