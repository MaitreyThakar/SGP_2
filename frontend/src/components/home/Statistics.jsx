"use client";

import { Users, DollarSign, Target, Clock } from "lucide-react";

/**
 * Individual statistic item component
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Statistic icon
 * @param {string} props.value - Statistic value
 * @param {string} props.label - Statistic label
 * @param {string} props.color - Color theme
 * @returns {JSX.Element} Statistic item
 */

/**
 * Statistics section component
 * Displays key platform statistics and achievements
 * @returns {JSX.Element} Statistics section
 */

export default function Statistics() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-300">Active Traders</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">$2.5B</div>
            <div className="text-gray-300">Assets Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">85%</div>
            <div className="text-gray-300">Prediction Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-gray-300">Market Coverage</div>
          </div>
        </div>
      </div>
    </section>
  );
}
