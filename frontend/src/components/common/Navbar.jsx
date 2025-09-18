'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Menu, 
  X, 
  TrendingUp, 
  User, 
  LogOut, 
  BarChart3, 
  DollarSign, 
  Bitcoin,
  CreditCard
} from 'lucide-react';

/**
 * Navbar component with authentication-aware navigation
 * Shows different menu items based on user authentication status
 * @returns {JSX.Element} Navigation bar component
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  /**
   * Check user authentication status
   */
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, [supabase]);

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  /**
   * Navigation items for authenticated users
   */
  const authenticatedNavItems = [
    {
      id: 'indian-market',
      name: 'Indian Market',
      href: '/indian-market',
      icon: BarChart3,
      description: 'NSE & BSE stocks'
    },
    {
      id: 'us-market',
      name: 'US Market',
      href: '/us-market',
      icon: DollarSign,
      description: 'NYSE & NASDAQ stocks'
    },
    {
      id: 'crypto-market',
      name: 'Crypto',
      href: '/crypto-market',
      icon: Bitcoin,
      description: 'Cryptocurrency markets'
    },
    {
      id: 'prediction',
      name: 'Predictions',
      href: '/prediction',
      icon: TrendingUp,
      description: 'AI-powered predictions'
    }
  ];

  /**
   * Navigation items for non-authenticated users
   */
  const publicNavItems = [
    {
      id: 'features',
      name: 'Features',
      href: '/#features',
      description: 'Platform capabilities'
    },
    {
      id: 'pricing',
      name: 'Pricing',
      href: '/pricing',
      icon: CreditCard,
      description: 'Choose your plan'
    },
    {
      id: 'about',
      name: 'About',
      href: '/#about',
      description: 'Learn more about us'
    }
  ];

  const currentNavItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">FinPredict</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  {IconComponent && (
                    <IconComponent className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                  )}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Authentication Actions */}
            {!loading && (
              <div className="flex items-center space-x-4 ml-8 border-l border-gray-700 pl-8">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden lg:block">Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="hidden lg:block">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-400">{item.description}</div>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Mobile Authentication Actions */}
            {!loading && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
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
