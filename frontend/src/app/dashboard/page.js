import DashboardStats from '@/components/dashboard/DashboardStats';
import WatchList from '@/components/dashboard/WatchList';
import MarketOverview from '@/components/dashboard/MarketOverview';
import StockWatchlistChart from '@/components/dashboard/StockWatchlistChart';

export const metadata = {
  title: "Trading Dashboard - FinPredict",
  description: "Your comprehensive trading dashboard with portfolio overview, market insights, and watchlist",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Trading Dashboard</h1>
            <p className="text-gray-300 text-lg">
              Your comprehensive overview of portfolio performance, market trends, and watchlist
            </p>
          </div>
          
          <div className="space-y-8">
            <DashboardStats />
            <MarketOverview />
            <StockWatchlistChart />
            <WatchList />
          </div>
        </div>
      </div>
    </div>
  );
}
