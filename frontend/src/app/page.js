'use client';

import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import DashboardPreview from '@/components/home/DashboardPreview';
import Statistics from '@/components/home/Statistics';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Hero />
      <Features />
      <DashboardPreview />
      <Statistics />
    </main>
  );
}
