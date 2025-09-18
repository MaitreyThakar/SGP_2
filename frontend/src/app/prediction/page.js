'use client';
import PredictionDashboard from '@/components/prediction/PredictionDashboard';
import ProtectedRoute from "@/components/common/ProtectedRoute";


export const metadata = {
  title: "AI Price Predictions - FinPredict",
  description: "Advanced AI-powered price predictions for stocks and cryptocurrencies with machine learning models",
};

export default function PredictionPage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PredictionDashboard />
      </div>
    </div>
    </ProtectedRoute>
  );
}
