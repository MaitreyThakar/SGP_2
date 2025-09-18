'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, TrendingUp, Target, Shield } from 'lucide-react';

/**
 * ProfileCompletion component for new users
 * Collects essential profile information after authentication
 * @param {Function} onComplete - Callback when profile is completed
 * @returns {JSX.Element} Profile completion form
 */
const ProfileCompletion = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    pan_card_number: '',
    trading_experience: '',
    risk_tolerance: '',
    investment_goals: '',
    preferred_markets: []
  });

  const experienceOptions = [
    'Beginner (0-2 years)',
    'Intermediate (2-5 years)',
    'Advanced (5-10 years)',
    'Expert (10+ years)'
  ];

  const riskToleranceOptions = [
    'Conservative',
    'Moderate',
    'Aggressive'
  ];

  const investmentGoalsOptions = [
    'Short-term gains',
    'Long-term growth',
    'Income generation',
    'Capital preservation'
  ];

  const marketOptions = [
    'Indian Stocks',
    'US Stocks',
    'Cryptocurrency',
    'Forex',
    'Commodities'
  ];

  /**
   * Validates form data
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.pan_card_number.trim()) newErrors.pan_card_number = 'PAN card number is required';
    if (!formData.trading_experience) newErrors.trading_experience = 'Trading experience is required';
    if (!formData.risk_tolerance) newErrors.risk_tolerance = 'Risk tolerance is required';
    if (!formData.investment_goals) newErrors.investment_goals = 'Investment goals are required';

    // Validate PAN card format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.pan_card_number && !panRegex.test(formData.pan_card_number.toUpperCase())) {
      newErrors.pan_card_number = 'Invalid PAN card format (e.g., ABCDE1234F)';
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pan_card_number: formData.pan_card_number.toUpperCase()
        }),
      });

      const result = await response.json();

      if (result.success) {
        onComplete?.(result.data);
      } else {
        setErrors({ submit: result.error || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Profile submission error:', error);
      setErrors({ submit: 'An error occurred while saving your profile' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles input changes
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handles market selection toggle
   * @param {string} market - Market to toggle
   */
  const toggleMarket = (market) => {
    setFormData(prev => ({
      ...prev,
      preferred_markets: prev.preferred_markets.includes(market)
        ? prev.preferred_markets.filter(m => m !== market)
        : [...prev.preferred_markets, market]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Complete Your Profile</h2>
          <p className="mt-2 text-gray-400">
            Help us personalize your trading experience by providing some basic information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          {errors.submit && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-md p-4">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                    errors.location ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="City, State/Country"
                />
                {errors.location && <p className="mt-1 text-red-400 text-sm">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PAN Card Number *
                </label>
                <input
                  type="text"
                  value={formData.pan_card_number}
                  onChange={(e) => handleInputChange('pan_card_number', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                    errors.pan_card_number ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {errors.pan_card_number && <p className="mt-1 text-red-400 text-sm">{errors.pan_card_number}</p>}
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trading Preferences
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trading Experience *
                </label>
                <select
                  value={formData.trading_experience}
                  onChange={(e) => handleInputChange('trading_experience', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white ${
                    errors.trading_experience ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.trading_experience && <p className="mt-1 text-red-400 text-sm">{errors.trading_experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Tolerance *
                </label>
                <select
                  value={formData.risk_tolerance}
                  onChange={(e) => handleInputChange('risk_tolerance', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white ${
                    errors.risk_tolerance ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select risk tolerance</option>
                  {riskToleranceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.risk_tolerance && <p className="mt-1 text-red-400 text-sm">{errors.risk_tolerance}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Goals *
                </label>
                <select
                  value={formData.investment_goals}
                  onChange={(e) => handleInputChange('investment_goals', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white ${
                    errors.investment_goals ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select investment goals</option>
                  {investmentGoalsOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.investment_goals && <p className="mt-1 text-red-400 text-sm">{errors.investment_goals}</p>}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Tell us about your trading background and interests..."
            />
          </div>

          {/* Preferred Markets */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Preferred Markets (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {marketOptions.map((market) => (
                <button
                  key={market}
                  type="button"
                  onClick={() => toggleMarket(market)}
                  className={`p-3 rounded-lg border transition-colors ${
                    formData.preferred_markets.includes(market)
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;