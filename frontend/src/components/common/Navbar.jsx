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
  ChevronDown,
  UserCircle,
  UserPlus,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/**
 * Main navigation component with dark theme
 * Features responsive design with mobile menu and markets dropdown
 * @returns {JSX.Element} Navigation component
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarketsDropdownOpen, setIsMarketsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  // Check user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
            {user && (
              <>
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
              </>
            )}

            {/* Auth Buttons */}
            {!loading && (
              <div className="flex items-center space-x-2 ml-4">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-800 border border-gray-700">
                      <UserCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors duration-200"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
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
            {user && (
              <>
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
              </>
            )}

            {/* Mobile Auth Section */}
            {!loading && (
              <div className="border-t border-gray-700 pt-4">
                {user ? (
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-md border border-gray-700">
                      <UserCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-300 text-sm">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
