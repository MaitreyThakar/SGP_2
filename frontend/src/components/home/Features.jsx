'use client';

import { TrendingUp, BarChart3, Globe, Target, Shield, Zap } from 'lucide-react';

/**
 * Individual feature card component
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Feature icon component
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {string} props.color - Color theme for the feature
 * @returns {JSX.Element} Feature card
 */
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="group p-8 bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-700">
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 text-center">{title}</h3>
    <p className="text-gray-300 text-center leading-relaxed">{description}</p>
  </div>
);

/**
 * Features section component
 * Showcases the main features of the FinPredict platform
 * @returns {JSX.Element} Features section
 */

export default function Features() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need for Smart Trading
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive tools and analytics for professional traders and investors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Predictions</h3>
            <p className="text-gray-300">Advanced machine learning models for accurate price predictions</p>
          </div>

          <div className="text-center">
            <div className="bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Data</h3>
            <p className="text-gray-300">Live market data from Indian, US, and crypto exchanges</p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Markets</h3>
            <p className="text-gray-300">Trade across Indian, US stock markets and cryptocurrencies</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Professional Tools</h3>
            <p className="text-gray-300">Advanced charting, technical analysis, and portfolio management</p>
          </div>
        </div>
      </div>
    </section>
  );
};

