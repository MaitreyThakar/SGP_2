  'use client';

import { useState } from 'react';
import { Check, X, Star, TrendingUp, Shield, Zap } from 'lucide-react';

/**
 * PricingPage component with proper key props for list items
 * Displays pricing plans for FinPredict trading tools and predictions
 * @returns {JSX.Element} Pricing page component with subscription plans
 */
const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for beginners exploring the markets',
      features: [
        'Basic market data',
        'Limited predictions (5/month)',
        'Community access',
        'Basic charts',
        'Email support'
      ],
      limitations: [
        'No real-time data',
        'Limited API calls',
        'No premium indicators'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 29, annual: 290 },
      description: 'Advanced tools for serious traders',
      features: [
        'Real-time market data',
        'Unlimited AI predictions',
        'Advanced charting tools',
        'Portfolio tracking',
        'Custom alerts',
        'Priority support',
        'Technical indicators',
        'Multi-market access'
      ],
      limitations: [],
      popular: true,
      buttonText: 'Start Pro Trial',
      buttonVariant: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 99, annual: 990 },
      description: 'Professional-grade tools for institutions',
      features: [
        'Everything in Pro',
        'API access',
        'White-label solutions',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'Risk management tools',
        'Institutional data feeds',
        'Custom reporting'
      ],
      limitations: [],
      popular: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline'
    }
  ];

  const additionalFeatures = [
    {
      id: 'ai-predictions',
      icon: TrendingUp,
      title: 'AI-Powered Predictions',
      description: 'Machine learning algorithms analyze market patterns for accurate price forecasts'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your data is protected with enterprise-level security and encryption'
    },
    {
      id: 'real-time',
      icon: Zap,
      title: 'Real-Time Data',
      description: 'Get instant market updates and execute trades with minimal latency'
    }
  ];

  const faqs = [
    {
      id: 'trial',
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial for the Pro plan with full access to all features.'
    },
    {
      id: 'cancel',
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.'
    },
    {
      id: 'data-sources',
      question: 'What data sources do you use?',
      answer: 'We aggregate data from multiple exchanges including NSE, BSE, NYSE, NASDAQ, and major crypto exchanges.'
    },
    {
      id: 'support',
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all users, priority support for Pro users, and dedicated account management for Enterprise clients.'
    }
  ];

  /**
   * Handles plan selection and redirects to checkout
   * @param {string} planId - Selected plan identifier
   */
  const handleSelectPlan = (planId) => {
    // Implement plan selection logic
    console.log(`Selected plan: ${planId}`);
    // Redirect to checkout or subscription page
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your Trading
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"> Edge</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Unlock professional-grade market analysis and AI predictions with our flexible pricing plans
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1 text-green-400 text-sm">(Save 17%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-400 ml-2">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-8 ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Features included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={`${plan.id}-feature-${index}`} className="flex items-center text-gray-300">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-400 mb-3">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={`${plan.id}-limitation-${index}`} className="flex items-center text-gray-500">
                              <X className="w-4 h-4 text-red-400 mr-3 flex-shrink-0" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose FinPredict?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders who trust FinPredict for market analysis
          </p>
          <button
            onClick={() => handleSelectPlan('pro')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
