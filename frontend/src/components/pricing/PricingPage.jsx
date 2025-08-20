'use client';

import { useState } from 'react';
import { Check, Star, TrendingUp, BarChart3, Zap, Crown, Shield } from 'lucide-react';

/**
 * PricingPage component with dark theme
 * Displays subscription plans, features comparison, and pricing information
 * @returns {JSX.Element} Pricing page component
 */
const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: BarChart3,
      price: { monthly: 29, yearly: 290 },
      description: 'Perfect for beginners getting started with market analysis',
      features: [
        'Real-time market data',
        'Basic stock screening',
        'Portfolio tracking',
        'Email alerts',
        'Indian market access',
        'Basic charts and indicators',
        'Community support'
      ],
      limitations: [
        'Limited to 10 watchlist items',
        'Basic prediction models',
        '50 API calls per day'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: TrendingUp,
      price: { monthly: 79, yearly: 790 },
      description: 'Advanced tools for serious traders and investors',
      features: [
        'Everything in Basic',
        'Advanced AI predictions',
        'US & Crypto markets',
        'Real-time alerts',
        'Advanced charting tools',
        'Technical indicators (50+)',
        'Portfolio optimization',
        'Risk assessment',
        'Priority support',
        'API access'
      ],
      limitations: [
        'Unlimited watchlist',
        'Advanced prediction models',
        '1000 API calls per day'
      ],
      popular: true,
      color: 'green'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 199, yearly: 1990 },
      description: 'Complete solution for institutional traders and fund managers',
      features: [
        'Everything in Professional',
        'Institutional-grade data',
        'Custom AI models',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics',
        'Multi-user access',
        '24/7 phone support',
        'SLA guarantee'
      ],
      limitations: [
        'Unlimited everything',
        'Custom prediction models',
        'Unlimited API calls'
      ],
      popular: false,
      color: 'purple'
    }
  ];

  const features = [
    {
      category: 'Market Data',
      items: [
        { name: 'Real-time Indian stocks', basic: true, pro: true, enterprise: true },
        { name: 'Real-time US stocks', basic: false, pro: true, enterprise: true },
        { name: 'Real-time Crypto data', basic: false, pro: true, enterprise: true },
        { name: 'Historical data (5+ years)', basic: true, pro: true, enterprise: true },
        { name: 'Institutional-grade data', basic: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'AI Predictions',
      items: [
        { name: 'Basic price predictions', basic: true, pro: true, enterprise: true },
        { name: 'Advanced ML models', basic: false, pro: true, enterprise: true },
        { name: 'Custom AI models', basic: false, pro: false, enterprise: true },
        { name: 'Sentiment analysis', basic: false, pro: true, enterprise: true },
        { name: 'News impact analysis', basic: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Tools & Analytics',
      items: [
        { name: 'Basic charting', basic: true, pro: true, enterprise: true },
        { name: 'Advanced charting tools', basic: false, pro: true, enterprise: true },
        { name: 'Technical indicators (50+)', basic: false, pro: true, enterprise: true },
        { name: 'Portfolio optimization', basic: false, pro: true, enterprise: true },
        { name: 'Risk management tools', basic: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Support & Access',
      items: [
        { name: 'Community support', basic: true, pro: true, enterprise: true },
        { name: 'Priority email support', basic: false, pro: true, enterprise: true },
        { name: '24/7 phone support', basic: false, pro: false, enterprise: true },
        { name: 'Dedicated account manager', basic: false, pro: false, enterprise: true },
        { name: 'SLA guarantee', basic: false, pro: false, enterprise: true }
      ]
    }
  ];

  const getColorClasses = (color, selected = false) => {
    const colors = {
      blue: {
        bg: selected ? 'bg-gray-700 border-blue-500' : 'bg-gray-800 border-gray-700',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        text: 'text-blue-400',
        icon: 'text-blue-400'
      },
      green: {
        bg: selected ? 'bg-gray-700 border-green-500' : 'bg-gray-800 border-gray-700',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        text: 'text-green-400',
        icon: 'text-green-400'
      },
      purple: {
        bg: selected ? 'bg-gray-700 border-purple-500' : 'bg-gray-800 border-gray-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        text: 'text-purple-400',
        icon: 'text-purple-400'
      }
    };
    return colors[color];
  };

  const calculateSavings = (plan) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Trading Edge
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get access to professional-grade market analysis tools, AI-powered predictions, 
            and real-time data across Indian, US, and Crypto markets.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700">
            <div className="flex space-x-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly <span className="text-green-400 ml-1">(Save up to 25%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const colors = getColorClasses(plan.color, selectedPlan === plan.id);
            const savings = calculateSavings(plan);
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-8 transition-all duration-200 hover:shadow-xl ${colors.bg}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${plan.color === 'blue' ? 'bg-blue-500/20 border border-blue-500/30' : plan.color === 'green' ? 'bg-green-500/20 border border-green-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`}>
                    <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[billingPeriod]}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-green-400 text-sm mt-2">
                      Save ${savings} per year
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${colors.button}`}
                >
                  {selectedPlan === plan.id ? 'Current Plan' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Feature Comparison</h2>
            <p className="text-gray-400 mt-1">Compare all features across our plans</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white">Basic</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white">Professional</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={`category-${categoryIndex}`} className="bg-gray-700/50">
                      <td colSpan={4} className="px-6 py-3">
                        <h4 className="text-sm font-semibold text-white">{category.category}</h4>
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={`item-${categoryIndex}-${itemIndex}`}>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.name}</td>
                        <td className="px-6 py-4 text-center">
                          {item.basic ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.pro ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.enterprise ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-gray-400 text-sm">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-gray-400 text-sm">Yes, we offer a 14-day free trial for all plans. No credit card required to start.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">How accurate are the AI predictions?</h4>
              <p className="text-gray-400 text-sm">Our AI models have an average accuracy of 75-85% for short-term predictions and 65-75% for long-term forecasts.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Trading Smarter?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who use FinPredict to make informed investment decisions. 
            Start your free trial today.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
