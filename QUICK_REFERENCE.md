# 🚀 FinPridict Quick Reference Card

## ONE-LINE START COMMANDS

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

**Windows Batch:**
```
start-dev.bat
```

**Manual (Backend - Terminal 1):**
```powershell
cd d:\maitrey\SGP_2-main; python -m venv venv; venv\Scripts\activate; pip install -r requirements.txt; python app.py
```

**Manual (Frontend - Terminal 2):**
```powershell
cd d:\maitrey\SGP_2-main\frontend; npm install; npm run dev
```

---

## ACCESS POINTS

| Purpose | URL |
|---------|-----|
| 🌐 Application | http://localhost:3000 |
| 📊 Prediction Page | http://localhost:3000/prediction |
| 🔌 Backend API | http://localhost:5000 |
| ❤️ Health Check | http://localhost:5000/health |

---

## API QUICK TESTS

**Check Backend:**
```powershell
curl http://localhost:5000/health
```

**Get US Predictions:**
```powershell
curl http://localhost:5000/api/predictions/us
```

**Get Single Stock:**
```powershell
curl -X POST http://localhost:5000/api/predictions `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"symbol":"AAPL","market":"us","period":"7d"}'
```

---

## FILE LOCATIONS

| Component | Path |
|-----------|------|
| Flask App | `d:\maitrey\SGP_2-main\app.py` |
| Models | `d:\maitrey\SGP_2-main\models.py` |
| Utils | `d:\maitrey\SGP_2-main\utils.py` |
| PredictionDashboard | `d:\maitrey\SGP_2-main\frontend\src\components\prediction\PredictionDashboard.jsx` |
| API Hook | `d:\maitrey\SGP_2-main\frontend\src\hooks\usePredictions.js` |
| API Proxy | `d:\maitrey\SGP_2-main\frontend\src\app\api\predictions\route.js` |
| Backend Config | `d:\maitrey\SGP_2-main\.env` |
| Frontend Config | `d:\maitrey\SGP_2-main\frontend\.env.local` |

---

## KEY ENVIRONMENT VARIABLES

**Backend (`.env`):**
```
FLASK_ENV=development
ALPHA_VANTAGE_API_KEY=PSMOLLA2RHXIBKD9
```

**Frontend (`.env.local`):**
```
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## MARKETS & SYMBOLS

**US (5 stocks):**
- AAPL, MSFT, GOOGL, AMZN, TSLA

**Indian (5 stocks):**
- RELIANCE.NS, TCS.NS, HDFCBANK.NS, INFY.NS, ITC.NS

**Crypto (5 assets):**
- BTC-USD, ETH-USD, BNB-USD, SOL-USD, ADA-USD

---

## COMMON TASKS

### Add New Stock
Edit `models.py`:
```python
PREDICTION_DATABASE['us']['NEW_SYMBOL'] = {
    'name': 'Company',
    'currentPrice': 100,
    'predictedPrice': 105,
    ...
}
```

### Change Backend Port
Edit `app.py` (last line):
```python
app.run(port=8000)  # Instead of 5000
```
Then update `NEXT_PUBLIC_FLASK_URL` in `.env.local`

### Use Real Data
Uncomment in `utils.py`:
```python
return _fetch_from_yfinance(symbol, days)
# or
return _fetch_from_alpha_vantage(symbol, days)
```

### Debug API Calls
Check browser console (F12) → Network tab:
- Look for `/api/predictions` requests
- Check response status & data
- Verify headers include `Content-Type: application/json`

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `taskkill /PID <PID> /F` |
| Python module error | `pip install -r requirements.txt --force-reinstall` |
| CORS error | Verify `NEXT_PUBLIC_FLASK_URL` in `.env.local` |
| 404 on predictions | Check Flask running + API route exists |
| Stuck on "Loading" | Check browser console (F12) for errors |

---

## TECH STACK VERSIONS

| Tech | Version |
|------|---------|
| Node.js | 18+ |
| Python | 3.8+ |
| Next.js | 15.4.3 |
| Flask | 3.0.0 |
| React | 19.1.0 |
| Tailwind | 4.0 |

---

## KEY HOOKS & FUNCTIONS

**Frontend Hook (React):**
```javascript
const { predictions, loading, error, refetch } = usePredictions('us', '7d');
```

**Backend Function (Python):**
```python
prediction = get_predictions('AAPL', 'us', '7d')
```

**API Response Format:**
```json
{
  "symbol": "AAPL",
  "currentPrice": 175.23,
  "predictedPrice": 185.67,
  "confidence": 78,
  "trend": "bullish"
}
```

---

## DOCUMENTATION FILES

1. **SETUP_GUIDE.md** - How to install & run
2. **ARCHITECTURE.md** - System design & flow
3. **FULL_STACK_SUMMARY.md** - What was built
4. **PROJECT_KINGDOM_MAP.md** - Component reference
5. **README.md** - Project overview

---

## NEXT STEPS

1. ✅ Run both servers
2. ✅ Visit http://localhost:3000/prediction
3. ✅ Switch markets & test UI
4. ✅ Check backend API calls
5. ✅ Implement real ML models
6. ✅ Add database integration
7. ✅ Deploy to production

---

**Everything you need to know on one page! 🎯**
