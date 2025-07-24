import USMarketList from '@/components/markets/USMarketList';

export const metadata = {
  title: "US Stock Market - FinPredict",
  description: "Comprehensive analysis of US stock market including NYSE, NASDAQ stocks with real-time data and AI predictions",
};

export default function USMarketPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">US Stock Market</h1>
          <p className="text-gray-600">
            Comprehensive analysis of NYSE and NASDAQ stocks with real-time data, AI predictions, and professional trading tools
          </p>
        </div>
        <USMarketList />
      </div>
    </div>
  );
}
