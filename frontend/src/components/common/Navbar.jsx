'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Globe, 
  DollarSign, 
  Bitcoin, 
  User, 
  Menu, 
  X,
  CreditCard,
  ChevronDown
} from 'lucide-react';

/**
 * Main navigation component with dark theme
 * Features responsive design with mobile menu and markets dropdown
 * @returns {JSX.Element} Navigation component
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarketsDropdownOpen, setIsMarketsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMarketsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const marketLinks = [
    { href: '/indian-market', label: 'Indian Market', icon: TrendingUp, desc: 'NSE & BSE Stocks' },
    { href: '/us-market', label: 'US Market', icon: Globe, desc: 'NYSE & NASDAQ' },
    { href: '/crypto-market', label: 'Crypto Market', icon: Bitcoin, desc: 'Digital Assets' },
  ];

  const otherNavLinks = [
    // { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/prediction', label: 'Predictions', icon: DollarSign },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">FinPredict</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Markets Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMarketsDropdownOpen(!isMarketsDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Markets</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMarketsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMarketsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  {marketLinks.map((market) => {
                    const IconComponent = market.icon;
                    return (
                      <Link
                        key={market.href}
                        href={market.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
                        onClick={() => setIsMarketsDropdownOpen(false)}
                      >
                        <IconComponent className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{market.label}</div>
                          <div className="text-xs text-gray-400">{market.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {otherNavLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
            {/* Mobile Markets Section */}
            <div className="pt-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Markets
              </div>
              {marketLinks.map((market) => {
                const IconComponent = market.icon;
                return (
                  <Link
                    key={market.href}
                    href={market.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <div>{market.label}</div>
                      <div className="text-xs text-gray-400">{market.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {otherNavLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
