'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import MarketOverview from '@/components/dashboard/MarketOverview';
import WatchList from '@/components/dashboard/WatchList';
import StockWatchlistChart from '@/components/dashboard/StockWatchlistChart';   

const DashboardPreview = () => {
  return (
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Trading Dashboard
            </h2>
            <p className="text-gray-300 text-lg">
              Get a comprehensive view of your portfolio and market insights
            </p>
          </div>
          
          <div className="space-y-8">
            <DashboardStats />
            <MarketOverview />
            {/* <WatchList /> */}
            <StockWatchlistChart />
          </div>
        </div>
      </section>
  );
};

export default DashboardPreview;