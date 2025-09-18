"use client";

import USMarketList from '@/components/markets/USMarketList';
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Head from "next/head";

/**
 * USMarketPage - Protected US Stock Market analysis page
 * @returns {JSX.Element}
 */
export default function USMarketPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>US Stock Market - FinPredict</title>
        <meta
          name="description"
          content="Comprehensive analysis of US stock market including NYSE, NASDAQ stocks with real-time data and AI predictions"
        />
      </Head>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">US Stock Market</h1>
            <p className="text-gray-300">
              Comprehensive analysis of NYSE and NASDAQ stocks with real-time data, AI predictions, and professional trading tools
            </p>
          </div>
          <USMarketList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
