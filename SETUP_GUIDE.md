# FinPridict Full-Stack Setup Guide

## 🚀 Quick Start

This guide will help you run both the **Flask backend** and **Next.js frontend** together for the prediction system.

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- Git
- Terminal/PowerShell (Windows)

---

## 🔧 Backend Setup (Flask)

### Step 1: Create Virtual Environment

```powershell
cd d:\maitrey\SGP_2-main
python -m venv venv
venv\Scripts\activate
```

### Step 2: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

**If installation fails**, try installing packages individually:
```powershell
pip install flask flask-cors python-dotenv pandas numpy scikit-learn yfinance alpha-vantage tensorflow requests
```

### Step 3: Set Up Environment Variables

Create or edit `.env` file in root folder:
```
FLASK_ENV=development
ALPHA_VANTAGE_API_KEY=PSMOLLA2RHXIBKD9
```

### Step 4: Run Flask Backend

```powershell
python app.py
```

**Expected Output:**
```
============================================================
FinPridict Backend Server Starting...
============================================================
Environment: development
Debug Mode: True

Starting FinPridict Flask Server...
API Documentation: http://localhost:5000
Health Check: http://localhost:5000/health

Available Endpoints:
  POST   /api/predictions - Get single stock prediction
  GET    /api/predictions/<market> - Get all predictions for market
  GET    /api/stock-data/<symbol> - Get stock data
  GET    /api/technical-indicators/<symbol> - Get indicators
  POST   /api/models/train - Retrain models
============================================================

Running on http://127.0.0.1:5000
```

✅ **Backend is ready when you see "Running on http://127.0.0.1:5000"**

---

## 🎨 Frontend Setup (Next.js)

### Step 1: Navigate to Frontend Directory

```powershell
cd d:\maitrey\SGP_2-main\frontend
```

### Step 2: Install Node Dependencies

```powershell
npm install
```

### Step 3: Verify Environment Variables

Check `.env.local` exists and contains:
```
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
```

### Step 4: Run Development Server

```powershell
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.4.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
✓ Compiled client and server successfully
```

✅ **Frontend is ready when you see "Ready in..."**

---

## 🌐 Access the Application

1. **Frontend**: http://localhost:3000
2. **Prediction Page**: http://localhost:3000/prediction
3. **Backend API**: http://localhost:5000
4. **API Health Check**: http://localhost:5000/health

---

## 📡 Testing the Backend

### Test 1: Health Check
```powershell
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "active",
  "timestamp": "2025-11-17T...",
  "service": "FinPridict API"
}
```

### Test 2: Get US Market Predictions
```powershell
curl http://localhost:5000/api/predictions/us
```

### Test 3: Get Single Stock Prediction
```powershell
$body = @{
    symbol = "AAPL"
    market = "us"
    period = "7d"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/predictions `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 🔌 Data Flow

```
Browser (http://localhost:3000)
       │
       ├─► Prediction Page
       │       │
       │       └─► usePredictions Hook
       │               │
       │               └─► fetch("/api/predictions")
       │
       └─► Next.js API Route (/api/predictions)
               │
               └─► Flask Backend (http://localhost:5000)
                       │
                       ├─► /api/predictions (POST)
                       ├─► /api/predictions/<market> (GET)
                       │
                       └─► models.py
                               │
                               └─► PREDICTION_DATABASE
                                   (Returns mock data currently)
```

---

## 🐛 Troubleshooting

### **Issue: "Connection refused" or backend not responding**

1. Check Flask is running on `http://localhost:5000`
2. Check CORS is enabled in `app.py`
3. Verify `NEXT_PUBLIC_FLASK_URL=http://localhost:5000` in `.env.local`

**Solution:**
```powershell
# Terminal 1 - Backend
cd d:\maitrey\SGP_2-main
venv\Scripts\activate
python app.py

# Terminal 2 - Frontend
cd d:\maitrey\SGP_2-main\frontend
npm run dev
```

### **Issue: "Module not found" errors in Python**

```powershell
# Reinstall all dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### **Issue: Port 5000 already in use**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### **Issue: "CORS error" in browser console**

- Backend CORS is properly configured in `app.py`
- Frontend `.env.local` must have correct `NEXT_PUBLIC_FLASK_URL`
- Restart both servers after env changes

---

## 📊 Current Data Source

The predictions currently use **mock data** from `PREDICTION_DATABASE` in `models.py`:
- **US**: AAPL, MSFT, GOOGL, AMZN, TSLA
- **Indian**: RELIANCE.NS, TCS.NS, HDFCBANK.NS, INFY.NS, ITC.NS
- **Crypto**: BTC-USD, ETH-USD, BNB-USD, SOL-USD, ADA-USD

### To Use Real Data

1. **Yahoo Finance** (recommended for testing):
   - Already integrated in `utils.py`
   - Call `fetch_stock_data(symbol, days)`

2. **Alpha Vantage API**:
   - Set API key in `.env`
   - Call `_fetch_from_alpha_vantage()`

---

## 🔄 File Structure

```
SGP_2-main/
├── app.py                 # Flask main server
├── models.py              # ML models & predictions
├── utils.py               # Data utilities
├── requirements.txt       # Python dependencies
├── .env                   # Backend env vars
│
└── frontend/
    ├── .env.local         # Frontend env vars
    ├── src/
    │   ├── app/
    │   │   ├── prediction/page.js
    │   │   └── api/predictions/route.js   # Next.js proxy
    │   ├── components/
    │   │   └── prediction/PredictionDashboard.jsx
    │   └── hooks/
    │       └── usePredictions.js
    └── package.json
```

---

## 📚 API Endpoints Reference

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/predictions` | Get prediction for specific stock |
| `GET` | `/api/predictions/<market>` | Get all predictions for market |

### Stock Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stock-data/<symbol>` | Get current stock data & indicators |
| `GET` | `/api/technical-indicators/<symbol>` | Get technical indicators |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/models/train` | Trigger model retraining |

---

## 📝 Next Steps

1. ✅ Start both servers
2. ✅ Navigate to `http://localhost:3000/prediction`
3. ✅ Test market switching
4. ✅ Test search functionality
5. ✅ Verify predictions load

---

## 🚀 Production Deployment

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: python app.py" > Procfile
git push heroku main
```

### Frontend (Vercel)
```bash
# Deploy directly from GitHub
vercel --prod
```

---

## 📞 Support

If you encounter issues:

1. Check Flask is running: `curl http://localhost:5000/health`
2. Check frontend can reach backend: Check browser console for errors
3. Check `.env` and `.env.local` files are configured
4. Review logs in both terminals

---

**Happy Predicting! 🚀📈**
