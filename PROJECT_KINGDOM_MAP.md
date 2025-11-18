# 🏰 FinPridict Kingdom Map - Complete Architecture & Understanding

## Your Kingdom Overview

**FinPridict** is a full-stack financial technology platform that combines **Next.js frontend** with **Flask backend** to deliver AI-powered stock market predictions across US, Indian, and Cryptocurrency markets.

---

## 🗂️ Kingdom Regions (Folder Structure)

### **FRONTEND KINGDOM** (`/frontend`)
**The Visual Realm - Next.js 14 with Tailwind CSS**

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router (Pages & Routes)
│   │   ├── page.js                   # 🏠 Home/Landing Page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.js                 # Root layout wrapper
│   │   │
│   │   ├── auth/                     # 🔐 Authentication Pages
│   │   │   └── callback/page.jsx     # OAuth callback handler
│   │   │
│   │   ├── dashboard/page.js         # 📊 Main Dashboard
│   │   │   └── Shows market overview, watchlist, performance
│   │   │
│   │   ├── prediction/page.js        # 🤖 AI Prediction Page (YOUR FOCUS)
│   │   │   └── Multi-market price prediction interface
│   │   │
│   │   ├── us-market/page.js         # 🇺🇸 US Stock Market View
│   │   ├── indian-market/page.js     # 🇮🇳 Indian Stock Market View
│   │   ├── crypto-market/page.js     # ₿ Cryptocurrency Market View
│   │   │
│   │   ├── login/page.js             # 🔑 Login Page
│   │   ├── signup/page.js            # 📝 Registration Page
│   │   ├── profile/page.js           # 👤 User Profile
│   │   ├── pricing/page.js           # 💳 Pricing Plans
│   │   │
│   │   └── api/                      # 🔌 Backend Proxy Routes (Next.js API Routes)
│   │       ├── finnhub/              # Finnhub stock data
│   │       │   ├── quote/route.js    # Current stock prices
│   │       │   ├── company/route.js  # Company info
│   │       │   └── indices/route.js  # Market indices
│   │       ├── crypto-market/route.js    # Crypto data
│   │       ├── market-data/route.js      # General market data
│   │       ├── stock-history/route.js    # Historical prices
│   │       ├── us-market/route.js        # US market aggregation
│   │       └── profile/route.js          # User profile API
│   │
│   ├── components/                   # 🧩 Reusable UI Components
│   │   ├── auth/                     # Authentication components
│   │   │   ├── Login.jsx             # Login form
│   │   │   └── Signup.jsx            # Registration form
│   │   │
│   │   ├── common/                   # Shared/Global Components
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   ├── Footer.jsx            # Footer
│   │   │   ├── ThemeToggle.jsx       # Dark/Light mode toggle
│   │   │   ├── Loading.jsx           # Loading spinner
│   │   │   ├── ProtectedRoute.jsx    # Auth-gated routes
│   │   │   ├── StockCard.jsx         # Stock information card
│   │   │   └── StockChart.jsx        # Chart visualization (uses Recharts)
│   │   │
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── DashboardStats.jsx    # KPI cards
│   │   │   ├── MarketOverview.jsx    # Market indices display
│   │   │   ├── WatchList.jsx         # User watchlist widget
│   │   │   └── StockWatchlistChart.jsx # Portfolio performance chart
│   │   │
│   │   ├── markets/                  # Market view components
│   │   │   ├── USMarketList.jsx      # US stocks grid
│   │   │   ├── IndianMarketList.jsx  # Indian stocks grid
│   │   │   └── CryptoMarketList.jsx  # Crypto assets grid
│   │   │
│   │   ├── prediction/               # 🤖 PREDICTION DASHBOARD COMPONENTS
│   │   │   └── PredictionDashboard.jsx # Main prediction page component ⭐
│   │   │
│   │   ├── home/                     # Landing page components
│   │   │   ├── Hero.jsx              # Hero section
│   │   │   ├── Features.jsx          # Features showcase
│   │   │   ├── Statistics.jsx        # Stats section
│   │   │   └── DashboardPreview.jsx  # Dashboard preview
│   │   │
│   │   └── pricing/                  # Pricing page components
│   │       └── PricingPage.jsx       # Pricing cards
│   │
│   ├── contexts/                     # 🔄 React Context (State Management)
│   │   └── AuthContext.jsx           # Global auth state
│   │
│   ├── hooks/                        # 🎣 Custom React Hooks
│   │   └── useMarketData.js          # Fetch & manage market data
│   │
│   └── lib/                          # 📚 Utilities & Config
│       └── supabase.js               # Supabase client initialization
│
├── public/                           # 📦 Static files (images, icons)
├── package.json                      # Dependencies (Next.js, Recharts, Tailwind, etc.)
├── tsconfig.json                     # TypeScript config
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.mjs                # PostCSS config
└── .env                              # Environment variables
    ├── NEXT_PUBLIC_SUPABASE_URL
    ├── NEXT_PUBLIC_SUPABASE_ANON_KEY
    ├── FINNHUB_API_KEY
    └── ALPHA_VANTAGE_API_KEY
```

---

### **BACKEND KINGDOM** (`/` - Root)
**The Logic Realm - Flask Python Server**

```
Root/
├── app.py                            # 🚀 Flask main server
│   └── Handles REST API endpoints
│
├── models.py                         # 🤖 AI/ML Model Implementations
│   ├── LSTM Models (Deep Learning)
│   ├── RNN Models (Recurrent Networks)
│   ├── SVM Models (Support Vector Machines)
│   ├── Random Forest (Ensemble Learning)
│   └── Model training & prediction logic
│
├── utils.py                          # 🛠️ Data Processing Utilities
│   ├── Data fetching functions
│   ├── Technical indicator calculations
│   ├── Data normalization
│   └── Feature engineering
│
├── scrape_news_sentiment.py          # 📰 News Sentiment Analysis
│   └── Google News scraping & sentiment scoring
│
├── predict_terminal.py               # 💻 CLI Stock Prediction Tool
├── predict_crypto_terminal.py        # 💻 CLI Crypto Prediction Tool
│
├── requirements.txt                  # Python dependencies
│   ├── tensorflow (Keras/LSTM)
│   ├── scikit-learn (SVM, Random Forest)
│   ├── pandas (Data processing)
│   ├── numpy (Numerical computing)
│   ├── alpha_vantage (Stock data)
│   └── GoodleNews (News scraping)
│
└── .env                              # Backend environment variables
    └── ALPHA_VANTAGE_API_KEY
```

---

## 🔌 Data Flow Architecture

```
┌─────────────────────┐
│   Frontend          │
│  (Next.js React)    │
│                     │
│  User Interface     │
└──────────┬──────────┘
           │
           │ HTTP Requests
           ▼
┌─────────────────────┐
│  Next.js API Routes │  (Proxy Layer)
│  /api/...           │
└──────────┬──────────┘
           │
           │ Fetch Data & Predictions
           ▼
┌─────────────────────┐
│  Flask Backend      │
│  (Python)           │
│                     │
│  • Models Training  │
│  • AI Predictions   │
│  • Data Processing  │
└──────────┬──────────┘
           │
           │ Request Data
           ▼
┌─────────────────────┐
│  External APIs      │
│                     │
│  • Finnhub          │
│  • Alpha Vantage    │
│  • Yahoo Finance    │
│  • Google News      │
│  • CoinGecko        │
└─────────────────────┘
```

---

## 📊 PREDICTION DASHBOARD (Your Focus)

### Component: `PredictionDashboard.jsx`
**Location**: `frontend/src/components/prediction/PredictionDashboard.jsx`

#### **What it does:**
- 🎯 AI-powered price predictions for 3 markets
- 📈 Interactive chart visualization
- 🔍 Search & filter functionality
- 💡 Confidence scoring & trend analysis

#### **State Management:**
```javascript
const [selectedMarket, setSelectedMarket] = useState('us');        // Market selection
const [selectedStock, setSelectedStock] = useState('AAPL');       // Active stock
const [predictionPeriod, setPredictionPeriod] = useState('7d');   // Time horizon
const [searchTerm, setSearchTerm] = useState('');                 // Search filter
```

#### **Data Structure (Prediction Object):**
```javascript
{
  symbol: 'AAPL',                    // Stock ticker
  name: 'Apple Inc.',                // Full name
  currentPrice: 175.23,              // Current price
  predictedPrice: 185.67,            // AI predicted price
  confidence: 78,                    // Confidence level (0-100)
  timeframe: '7 days',               // Prediction horizon
  trend: 'bullish' | 'bearish',      // Market direction
  accuracy: 82,                      // Historical model accuracy
  factors: ['...', '...'],           // Key factors influencing prediction
  sector: 'Technology'               // Industry sector
}
```

#### **Three Market Datasets:**
1. **Indian Predictions** (₹): RELIANCE, TCS, HDFCBANK, INFY, ITC
2. **US Predictions** ($): AAPL, TSLA, MSFT, GOOGL, AMZN
3. **Crypto Predictions** ($): BTC, ETH, BNB, SOL, ADA

#### **Key Features:**
- 🎨 Dynamic market-based theming (Orange, Blue, Purple)
- 📊 Area chart with volatility simulation
- 🔐 Confidence color coding (Green=80+, Yellow=60-79, Red=<60)
- 💾 Prediction cards with detailed metrics
- 🔍 Real-time search filtering

---

## 🎨 Technology Stack Summary

### **Frontend Technologies**
| Technology | Purpose | Version |
|-----------|---------|---------|
| Next.js | React framework with App Router | 15.4.3 |
| React | UI library | 19.1.0 |
| Tailwind CSS | Utility-first CSS styling | 4.0 |
| Recharts | Interactive chart library | 3.1.2 |
| Lucide React | Icon library | 0.525.0 |
| Supabase | Authentication & database | 2.55.0 |
| Framer Motion | Animation library | 12.23.7 |

### **Backend Technologies**
| Technology | Purpose |
|-----------|---------|
| Flask | Python web framework |
| TensorFlow/Keras | Deep learning (LSTM, RNN) |
| Scikit-learn | ML algorithms (SVM, Random Forest) |
| Pandas | Data manipulation |
| NumPy | Numerical computing |
| Alpha Vantage | Stock market API |
| Yahoo Finance | Market data |
| GoodleNews | News scraping |

---

## 🔐 Authentication Flow

```
┌─────────┐
│ User    │
└────┬────┘
     │ clicks "Sign in with Google"
     ▼
┌──────────────────────┐
│ Supabase OAuth       │
│ (Google Provider)    │
└────┬─────────────────┘
     │ redirects back with token
     ▼
┌──────────────────────┐
│ /auth/callback       │ (Next.js page)
└────┬─────────────────┘
     │ processes token
     ▼
┌──────────────────────┐
│ AuthContext          │ (Updates user state)
│ (stores user data)   │
└──────────┬───────────┘
           │
           ▼
     📊 Redirect to /profile
```

---

## 📡 API Endpoints Reference

### **Next.js Proxy APIs** (`/api/...`)
```
/api/finnhub/quote              - Get current stock prices
/api/finnhub/company            - Get company information
/api/finnhub/indices            - Get market indices
/api/crypto-market              - Get crypto data
/api/market-data                - General market data
/api/stock-history              - Historical price data
/api/us-market                  - US market aggregation
/api/profile                    - User profile data
```

### **Flask Backend APIs** (called from Next.js)
```
POST /predict                   - Get AI predictions
GET  /market-data/<symbol>     - Get market data
POST /sentiment/<stock>         - Get sentiment analysis
GET  /historical/<symbol>       - Historical data
```

---

## 🎯 Key Component Relationships

```
┌─────────────────────────────────────────┐
│  prediction/page.js                     │
│  (Page Component - renders dashboard)   │
└──────────────┬──────────────────────────┘
               │ imports & displays
               ▼
┌─────────────────────────────────────────┐
│  PredictionDashboard.jsx                │
│  (Main container component)             │
└──────────────┬──────────────────────────┘
               │ uses
      ┌────────┴────────┬─────────────┐
      ▼                 ▼             ▼
┌────────────┐  ┌──────────────┐  ┌──────────────────┐
│ StockChart │  │ Search Input │  │ Prediction Cards │
│ (Recharts) │  │ (filtering)  │  │ (data display)   │
└────────────┘  └──────────────┘  └──────────────────┘
```

---

## 🚀 Key Features Breakdown

### **1. Multi-Market Support**
- Switch between US, Indian, Crypto markets
- Market-specific formatting (currency, decimal places)
- Dynamic theme colors per market

### **2. AI Predictions**
- Current vs. Predicted prices
- Confidence scoring system
- Model accuracy metrics
- Key influencing factors
- Trend analysis (bullish/bearish)

### **3. Data Visualization**
- Area chart with volatility simulation
- Time period selection buttons
- Real-time data formatting
- Price change indicators

### **4. Interactive Features**
- Search/filter predictions
- Click to select individual stocks
- Dynamic card selection highlight
- Responsive grid layout

### **5. Visual Feedback**
- Color-coded confidence (green/yellow/red)
- Trend indicators (up/down arrows)
- Loading states
- Empty state handling

---

## 🔧 Development Workflow

### **To Run the Project:**

**Backend (Terminal 1):**
```bash
cd d:\maitrey\SGP_2-main
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Backend running on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd d:\maitrey\SGP_2-main\frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

**Access Prediction Page:**
```
http://localhost:3000/prediction
```

---

## 📊 Prediction Data Flow

```
User Views /prediction
     ↓
PredictionDashboard loads
     ↓
State initialized (selectedMarket='us', selectedStock='AAPL')
     ↓
Component renders with static prediction data
     ↓
User can:
  • Switch markets → market-specific predictions load
  • Search stocks → filteredPredictions array updates
  • Click card → selectedStock updates → chart regenerates
  • Change period → prediction data recalculated
     ↓
StockChart displays with generated data points
```

---

## 💡 Important Notes

### **Currently Static Data:**
The predictions in `PredictionDashboard.jsx` are hardcoded arrays. To make it dynamic:
1. Add API calls to Flask backend
2. Replace hardcoded arrays with fetched data
3. Add loading states and error handling
4. Implement real-time data updates

### **Color Class Limitations:**
Tailwind classes use dynamic color values like `bg-${currentMarket.accentColor}-400` which don't work. Needs inline styles or predefined class maps.

### **Chart Data Generation:**
Current chart uses realistic volatility simulation for demo purposes. Should integrate real historical data in production.

---

## 🎓 Learning Path

**To master this kingdom:**
1. Start with `page.js` - entry point
2. Understand `PredictionDashboard.jsx` - main logic
3. Explore `StockChart.jsx` - visualization
4. Check `AuthContext.jsx` - auth system
5. Review `utils.py` & `models.py` - backend logic
6. Trace data flow from API calls

---

**Your kingdom is complete! You now know every corner, every component, and how they work together. Ready to conquer new features!** 👑

