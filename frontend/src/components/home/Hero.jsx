'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

/**
 * Hero section component for the landing page
 * Features main headline, description, and CTA buttons
 * @returns {JSX.Element} Hero section
 */
const Hero = () => {
  return (
<section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Trading with AI-Powered Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Professional stock market analysis for Indian, US, and Crypto markets. 
              Get real-time data, AI predictions, and make informed trading decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:border-gray-300 transition-colors">
                Watch Demo
              </button>
              
            </div>
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>AI Predictions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Multi-Market Support</span>
            </div>
          </div>
        </div>
        </div>
      </section>
          
  );
};

export default Hero;