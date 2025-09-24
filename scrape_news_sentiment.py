from GoogleNews import GoogleNews
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import download
import pandas as pd

download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

def get_stock_news_sentiment(query, days=7, max_results=20):
    print(f"\nFetching latest news for: {query}")

    googlenews = GoogleNews(period=f"{days}d")
    googlenews.search(query)
    news = googlenews.result()[:max_results]

    if not news:
        print("No news found. Try another keyword.")
        return pd.DataFrame()

    data = []
    for item in news:
        title = item.get('title', '')
        date = item.get('date', '')
        link = item.get('link', '')
        sentiment = sia.polarity_scores(title)['compound']

        data.append({
            "Date": date,
            "Headline": title,
            "Sentiment": sentiment,
            "Link": link
        })

    return pd.DataFrame(data)

# ===== MAIN NEWS SCRIPT ===== #
if __name__ == "__main__":
    print("Global Stock Sentiment Scraper (India + US)")
    print("Examples: Reliance, NIFTY, TCS, AAPL, Tesla, Microsoft")
    
    keyword = input("Enter company or index (e.g., AAPL, Infosys, NIFTY): ")
    df = get_stock_news_sentiment(keyword)

    if not df.empty:
        print("\nTop Sentiment Headlines:\n")
        print(df.to_string(index=False))
        # Save to CSV for later analysis
        df.to_csv(f"{keyword}_news_sentiment.csv", index=False)
        print(f"\nSentiment data saved to {keyword}_news_sentiment.csv")
