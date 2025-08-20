import IndianMarketList from '@/components/markets/IndianMarketList';

export const metadata = {
  title: "Indian Stock Market - FinPredict",
  description: "Comprehensive analysis of Indian stock market including NSE, BSE stocks with real-time data and AI predictions",
};

export default function IndianMarketPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Indian Stock Market</h1>
          <p className="text-gray-300">
            Comprehensive analysis of NSE and BSE stocks with real-time data, AI predictions, and professional trading tools
          </p>
        </div>
        <IndianMarketList />
      </div>
    </div>
  );
}
