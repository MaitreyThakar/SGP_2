'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Camera, Save, X, CreditCard } from 'lucide-react';

/**
 * ProfilePage component with Supabase integration
 * @returns {JSX.Element} Profile page component
 */
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
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

  const riskToleranceOptions = ['Conservative', 'Moderate', 'Aggressive'];
  const investmentGoalsOptions = ['Short-term gains', 'Long-term growth', 'Income generation', 'Capital preservation'];
  const marketOptions = ['Indian Stocks', 'US Stocks', 'Cryptocurrency', 'Forex', 'Commodities'];

  /**
   * Fetches profile data from API
   */
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const result = await response.json();
      
      if (result.success && result.data) {
        setProfileData(result.data);
        // Check if this is a new user with minimal profile data
        const hasMinimalData = !result.data.name || !result.data.phone || !result.data.location;
        if (hasMinimalData) {
          setIsNewUser(true);
          setIsEditing(true); // Auto-enable editing for new users
        }
      } else {
        // If no profile exists, this is likely a new user
        setIsNewUser(true);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsNewUser(true);
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Validates form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name?.trim()) newErrors.name = 'Name is required';
    if (!profileData.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!profileData.location?.trim()) newErrors.location = 'Location is required';

    // Validate PAN card format if provided
    if (profileData.pan_card_number) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(profileData.pan_card_number)) {
        newErrors.pan_card_number = 'Invalid PAN card format (e.g., ABCDE1234F)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles save action
   */
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        setErrors({});
      } else {
        setErrors({ submit: result.error || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Profile save error:', error);
      setErrors({ submit: 'An error occurred while saving your profile' });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles cancel action
   */
  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    fetchProfile(); // Reset to original data
  };

  /**
   * Handles market toggle
   */
  const toggleMarket = (market) => {
    setProfileData(prev => ({
      ...prev,
      preferred_markets: prev.preferred_markets?.includes(market)
        ? prev.preferred_markets.filter(m => m !== market)
        : [...(prev.preferred_markets || []), market]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-white">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message for New Users */}
        {isNewUser && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Welcome to FinPredict! 🎉</h2>
            <p className="text-gray-300">
              Let's complete your profile to personalize your trading experience and access all features.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          {errors.submit && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-md p-4">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center border border-gray-500">
                <User className="w-12 h-12 text-gray-300" />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">
                {profileData.name || (isNewUser ? 'Complete Your Profile' : 'User')}
              </h1>
              <p className="text-gray-300">{profileData.email}</p>
              {profileData.bio && <p className="text-sm text-gray-400 mt-2">{profileData.bio}</p>}
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : (isNewUser ? 'Complete Profile' : 'Save')}</span>
                  </button>
                  {!isNewUser && (
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-lg mb-6 border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={profileData.name || ''}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                            errors.name ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
                      </div>
                    ) : (
                      <p className="text-white">{profileData.name || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <p className="text-white">{profileData.email || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="tel"
                          value={profileData.phone || ''}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                            errors.phone ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
                      </div>
                    ) : (
                      <p className="text-white">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={profileData.location || ''}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                            errors.location ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.location && <p className="mt-1 text-red-400 text-sm">{errors.location}</p>}
                      </div>
                    ) : (
                      <p className="text-white">{profileData.location || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">PAN Card Number</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={profileData.pan_card_number || ''}
                          onChange={(e) => setProfileData({...profileData, pan_card_number: e.target.value.toUpperCase()})}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 ${
                            errors.pan_card_number ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                        {errors.pan_card_number && <p className="mt-1 text-red-400 text-sm">{errors.pan_card_number}</p>}
                      </div>
                    ) : (
                      <p className="text-white flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        {profileData.pan_card_number || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Trading Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Trading Experience</label>
                    {isEditing ? (
                      <select
                        value={profileData.trading_experience || ''}
                        onChange={(e) => setProfileData({...profileData, trading_experience: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      >
                        <option value="">Select experience</option>
                        {experienceOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white">{profileData.trading_experience || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Risk Tolerance</label>
                    {isEditing ? (
                      <select
                        value={profileData.risk_tolerance || ''}
                        onChange={(e) => setProfileData({...profileData, risk_tolerance: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      >
                        <option value="">Select risk tolerance</option>
                        {riskToleranceOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white">{profileData.risk_tolerance || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Investment Goals</label>
                    {isEditing ? (
                      <select
                        value={profileData.investment_goals || ''}
                        onChange={(e) => setProfileData({...profileData, investment_goals: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                      >
                        <option value="">Select investment goals</option>
                        {investmentGoalsOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white">{profileData.investment_goals || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Markets</label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {marketOptions.map((market) => (
                          <button
                            key={market}
                            type="button"
                            onClick={() => toggleMarket(market)}
                            className={`p-2 text-sm rounded border transition-colors ${
                              profileData.preferred_markets?.includes(market)
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {market}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.preferred_markets?.length > 0 ? 
                          profileData.preferred_markets.map((market, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                            >
                              {market}
                            </span>
                          )) : (
                            <p className="text-gray-400 text-sm">None selected</p>
                          )
                        }
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio || ''}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-white">{profileData.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive alerts for price changes and news</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">SMS Alerts</p>
                      <p className="text-sm text-gray-400">Get important updates via SMS</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-gray-400">Use dark theme for the interface</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
