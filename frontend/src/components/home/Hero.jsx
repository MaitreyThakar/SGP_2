'use client';

import Link from 'next/link';
import { TrendingUp, BarChart3, Play, DollarSign, Bitcoin } from 'lucide-react';

/**
 * Hero section component for the landing page
 * Features main headline, description, and CTA buttons with modern dark design
 * @returns {JSX.Element} Hero section
 */
const Hero = () => {
  return (
    <section className="bg-gray-900 text-white min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="text-blue-400">Trade Smarter.</span>
            <br />
            <span className="text-yellow-400">Predict Better.</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Transform your trading strategy with AI-powered market analysis. Get 
            real-time insights on stocks, crypto, and make data-driven decisions 
            to maximize your portfolio performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Let's Go UP
            </button>
            {/* <button className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              View Demo
              <span className="ml-2">→</span>
            </button> */}
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Free to use</span>
            </div>
          </div>
        </div>
        
        {/* Right Content - Dashboard Preview */}
        <div className="relative">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-blue-400 text-lg font-semibold">AI Analysis Ready</span>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            
            {/* Metrics Cards */}
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <span className="text-gray-300">Market Trend</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Bullish
                </span>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <span className="text-gray-300">Risk Level</span>
                <span className="text-yellow-400 font-medium">
                  Medium Risk
                </span>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                <span className="text-gray-300">Prediction Accuracy</span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  87%
                </span>
              </div>
            </div>
            
            {/* Bottom Indicators */}
            {/* <div className="flex justify-center mt-8 gap-6">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">NSE/BSE</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">NYSE/NASDAQ</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">Crypto</span>
              </div>
            </div> */}
          </div>
          
          {/* Floating Elements with Stock Market Logos */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-full animate-bounce flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-yellow-400 rounded-full opacity-90 flex items-center justify-center shadow-lg">
            <Bitcoin className="w-5 h-5 text-gray-900" />
          </div>
          
          {/* Additional floating stock market elements */}
          <div className="absolute top-1/2 -left-6 w-8 h-8 bg-blue-500 rounded-full opacity-70 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-bold">₹</span>
          </div>
          <div className="absolute bottom-1/4 -right-2 w-6 h-6 bg-purple-500 rounded-full opacity-80 flex items-center justify-center shadow-md animate-pulse">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;