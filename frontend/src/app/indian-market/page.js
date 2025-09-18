"use client";

import IndianMarketList from '@/components/markets/IndianMarketList';
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Head from "next/head";

/**
 * IndianMarketPage - Protected Indian Stock Market analysis page
 * @returns {JSX.Element}
 */
export default function IndianMarketPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Indian Stock Market - FinPredict</title>
        <meta
          name="description"
          content="Comprehensive analysis of Indian stock market including NSE, BSE stocks with real-time data and AI predictions"
        />
      </Head>
      <main className="min-h-screen bg-gray-900 py-8">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Indian Stock Market</h1>
            <p className="text-gray-300">
              Comprehensive analysis of NSE and BSE stocks with real-time data, AI predictions, and professional trading tools
            </p>
          </header>
          <IndianMarketList />
        </section>
      </main>
    </ProtectedRoute>
  );
}
