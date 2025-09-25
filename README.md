# FinPridict: Intelligent Stock Market Analysis & Prediction Platform

**FinPridict** is a comprehensive full-stack application that provides advanced stock market analysis and prediction capabilities across **US**, **Indian**, and **Cryptocurrency** markets. Built with modern web technologies and powered by sophisticated Machine Learning and Deep Learning models, it delivers accurate price predictions and market insights through an intuitive, professional interface.

The platform combines traditional ML algorithms (**SVM, Random Forest**) with cutting-edge Deep Learning models (**LSTM, RNN**) and integrates real-time market data with sentiment analysis to provide holistic investment decision support.

---

## 🚀 Key Features

### 📊 **Multi-Market Coverage**
* **US Stock Market**: NASDAQ, NYSE listed stocks with real-time data
* **Indian Stock Market**: NSE, BSE equities with comprehensive analysis
* **Cryptocurrency**: Major digital assets (BTC, ETH, ADA, etc.)

### 🤖 **Advanced AI Models**
* **LSTM Networks**: Long Short-Term Memory for complex pattern recognition
* **RNN Models**: Recurrent Neural Networks for sequential data analysis
* **SVM**: Support Vector Machine for non-linear relationship modeling
* **Random Forest**: Ensemble learning for robust predictions

### 📈 **Comprehensive Analysis**
* **Price Prediction**: 5-30 day forecasts with confidence intervals
* **Technical Indicators**: RSI, Moving Averages, MACD, Bollinger Bands
* **Sentiment Analysis**: News-based market sentiment evaluation
* **Market Overview**: Real-time market statistics and trending stocks

### 💻 **Modern Web Interface**
* **Professional UI/UX**: Built with Next.js 14 and Tailwind CSS
* **Interactive Dashboards**: Real-time charts and data visualization
* **Responsive Design**: Optimized for desktop, tablet, and mobile
* **Dark/Light Theme**: User preference-based theme switching

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Flask API      │    │  Data Sources   │
│   Frontend      │◄──►│   Backend        │◄──►│                 │
│                 │    │                  │    │ • Yahoo Finance │
│ • Dashboard     │    │ • AI Models      │    │ • News APIs     │
│ • Market Views  │    │ • Predictions    │    │ • Market Data   │
│ • User Auth     │    │ • Market Data    │    │ • Sentiment     │
│ • Charts        │    │ • Sentiment      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow Pipeline
```
Market Data Acquisition → Feature Engineering → Model Training → Prediction Generation → Web Interface
       ↓                        ↓                    ↓                    ↓                  ↓
• Yahoo Finance API      • Technical Indicators  • LSTM/RNN/SVM    • Price Forecasts   • React Components
• News Sources          • Sentiment Scores      • Random Forest   • Risk Analysis     • Interactive Charts
• Real-time Feeds       • Data Normalization    • Ensemble Methods • Recommendations  • User Dashboard
```

---

## 🗂️ Project Structure

```
FinPridict/
├── 📁 frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                   # Next.js 14 App Router
│   │   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── prediction/        # Prediction interface
│   │   │   ├── us-market/         # US market analysis
│   │   │   ├── indian-market/     # Indian market analysis
│   │   │   ├── crypto-market/     # Crypto market analysis
│   │   │   └── api/               # API route handlers
│   │   ├── components/            # Reusable React components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── dashboard/         # Dashboard widgets
│   │   │   ├── markets/           # Market-specific components
│   │   │   └── common/            # Shared UI components
│   │   └── lib/                   # Utilities and configurations
│   ├── public/                    # Static assets
│   └── package.json               # Frontend dependencies
├── 📄 app.py                      # Flask API Server
├── 📄 models.py                   # AI/ML Model Implementations
├── 📄 utils.py                    # Data processing utilities
├── 📄 scrape_news_sentiment.py    # News sentiment analysis
├── 📄 predict_terminal.py         # CLI prediction tool
├── 📄 predict_crypto_terminal.py  # CLI crypto prediction tool
└── 📄 requirements.txt            # Python dependencies
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Charts**: Chart.js / Recharts
- **Authentication**: Supabase Auth
- **State Management**: React Context API

### Backend
- **Framework**: Flask (Python)
- **AI/ML Libraries**: TensorFlow, Scikit-learn
- **Data Processing**: Pandas, NumPy
- **Market Data**: Yahoo Finance API, Alpha Vantage
- **Sentiment Analysis**: NLTK, GoogleNews
- **API Design**: RESTful endpoints with JSON responses

### Data Sources
- **Stock Data**: Yahoo Finance, Alpha Vantage
- **News Data**: Google News, NewsAPI
- **Crypto Data**: CoinGecko, Yahoo Finance
- **Market Indices**: Real-time index data

---

## 🚦 Getting Started

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **Git** (for version control)
- **API Keys**: Alpha Vantage, NewsAPI (optional)

### Backend Setup (Flask API)

1. **Clone the repository**
   ```bash
   git clone https://github.com/MaitreyThakar/SGP_2.git
   cd SGP_2
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   echo "ALPHA_VANTAGE_API_KEY=your_api_key_here" > .env
   ```

5. **Run Flask backend**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.local.example .env.local
   
   # Edit .env.local with your configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:3000`

### Command Line Tools

**Stock Prediction CLI**
```bash
python predict_terminal.py
# Enter stock ticker (e.g., AAPL, RELIANCE.NS)
# Enter prediction date
```

**Cryptocurrency Prediction CLI**
```bash
python predict_crypto_terminal.py
# Enter crypto symbol (e.g., bitcoin, ethereum)
# Enter prediction date
```

**News Sentiment Analysis**
```bash
python scrape_news_sentiment.py
# Enter company name or stock symbol
```

---

## � Deployment

### Production Deployment Options

#### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Vercel
npm install -g vercel
vercel --prod

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

#### **Backend Deployment (Heroku/Railway)**
```bash
# Create Procfile
echo "web: python app.py" > Procfile

# Deploy to Heroku
heroku create finpridict-api
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Set environment variables
heroku config:set ALPHA_VANTAGE_API_KEY=your_key
```

#### **Docker Deployment**
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🧪 Testing

### Backend Testing
```bash
# Test individual models
python -c "from models import train_lstm_model; print('LSTM model loaded successfully')"

# Test API endpoints
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"stock_title": "AAPL"}'
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:e2e
```

## 🔍 Features Overview

### **Dashboard Features**
- **Market Overview**: Real-time market indices and statistics
- **Portfolio Tracking**: Personal stock watchlists and performance
- **News Feed**: Latest market news with sentiment analysis
- **Interactive Charts**: Candlestick, line, and technical indicator charts

### **Prediction Features**
- **Multi-Model Ensemble**: Combines LSTM, RNN, SVM, and Random Forest
- **Confidence Intervals**: Prediction accuracy and risk assessment
- **Historical Backtesting**: Model performance on historical data
- **Custom Timeframes**: 5, 15, 30-day prediction horizons

### **Market Analysis Features**
- **Technical Indicators**: RSI, MACD, Bollinger Bands, Moving Averages
- **Fundamental Analysis**: P/E ratios, market cap, volume analysis
- **Sector Performance**: Industry-wise market trends
- **Gainers/Losers**: Top performing and declining stocks

### **User Experience Features**
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Themes**: User preference-based theming
- **Real-time Updates**: Live market data streaming
- **Export Capabilities**: PDF reports and CSV data export

## 🤝 Contributing

We welcome contributions to improve FinPridict! Here's how you can contribute:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/MaitreyThakar/SGP_2.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

4. **Submit Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Ensure all tests pass

### Development Guidelines
- **Code Style**: Follow PEP 8 for Python, Prettier for JavaScript
- **Testing**: Write unit tests for new backend functions
- **Documentation**: Update README and inline comments
- **Performance**: Optimize database queries and API calls

## 🎓 Academic Information

**Project Details**
- **Course**: Software Engineering Project (SGP-2)
- **Academic Year**: 2024-2025
- **Semester**: 5th Semester

**Team Members**
- **Thakar Maitrey** - Backend Development & AI/ML Implementation
- **Utsav Savani** - Frontend Development & UI/UX Design

**Institution Details**
- **University**: Charotar University of Science and Technology (CHARUSAT)
- **Institute**: Chandubhai S. Patel Institute of Technology (CSPIT)
- **Department**: Information Technology
- **Batch**: IT-2-D2
- **Year**: 3rd Year

**Project Supervision**
- Faculty guidance and technical mentorship
- Industry best practices implementation
- Agile development methodology

## � License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Disclaimer
- This application is for educational and informational purposes only
- Stock market predictions are not guaranteed and should not be considered financial advice
- Always consult with qualified financial advisors before making investment decisions
- Past performance does not guarantee future results

### Data Attribution
- Market data provided by Yahoo Finance and Alpha Vantage
- News data sourced from Google News and various financial news APIs
- All data is used in accordance with respective terms of service

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**

**📞 For questions or support, please open an issue on GitHub or contact the development team.**
