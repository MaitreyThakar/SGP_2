import DashboardStats from '@/components/dashboard/DashboardStats';
import WatchList from '@/components/dashboard/WatchList';
import MarketOverview from '@/components/dashboard/MarketOverview';

export const metadata = {
  title: "Trading Dashboard - FinPredict",
  description: "Your comprehensive trading dashboard with portfolio overview, market insights, and watchlist",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trading Dashboard</h1>
          <p className="text-gray-600">
            Your comprehensive overview of portfolio performance, market trends, and watchlist
          </p>
        </div>
        
        <div className="space-y-8">
          <DashboardStats />
          <MarketOverview />
          <WatchList />
        </div>
      </div>
    </div>
  );
}
