import CryptoMarketList from '@/components/markets/CryptoMarketList';

export const metadata = {
  title: "Cryptocurrency Market - FinPredict",
  description: "Comprehensive analysis of cryptocurrency market with real-time data, AI predictions, and professional trading tools",
};

export default function CryptoMarketPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Market</h1>
          <p className="text-gray-300">
            Comprehensive analysis of cryptocurrencies with real-time data, AI predictions, and professional trading tools
          </p>
        </div>
        <CryptoMarketList />
      </div>
    </div>
  );
}
