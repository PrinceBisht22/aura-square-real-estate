import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from '../components/icons.jsx';
// Removed: import { userAPI } from '../utils/api-endpoints.js';
// Removed: import { getCurrentUser, isAuthenticated } from '../utils/auth.js';

// 💡 NEW: Import the useAuth hook
import { useAuth } from '../context/AuthContext'; 

import ProfileOverview from '../components/profile/ProfileOverview.jsx';
import MyListings from '../components/profile/MyListings.jsx';
import FavoritesTab from '../components/profile/FavoritesTab.jsx';
import MessagesTab from '../components/profile/MessagesTab.jsx';
import AccountSettings from '../components/profile/AccountSettings.jsx';
import DealerTab from '../components/profile/DealerTab.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
// 💡 We will also need an API function if the component needs to refetch updated user data
import { getUserProfileData } from '../utils/api'; 


// Tabs definition remains the same
const tabs = [
  { id: 'overview', label: 'Overview', icon: ICONS?.User },
  { id: 'listings', label: 'My Listings', icon: ICONS?.Home },
  { id: 'favorites', label: 'Favorites', icon: ICONS?.Heart },
  { id: 'messages', label: 'Messages', icon: ICONS?.MessageSquare },
  { id: 'settings', label: 'Settings', icon: ICONS?.Settings },
  { id: 'dealer', label: 'Dealer', icon: ICONS?.Briefcase, condition: (user) => user?.role === 'dealer' },
];

const ProfilePage = () => {
  // --- 💡 NEW: Use the authentication state from context ---
  const { currentUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use local state to manage potentially updated profile data
  const [userProfile, setUserProfile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false); // New state for loading component data

  // --- 💡 useEffect to handle data loading and redirect ---
  useEffect(() => {
    // 1. If the AuthContext is still checking the session, do nothing.
    if (authLoading) return;

    // 2. If no user is found after auth check, redirect to login.
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    
    // 3. Once currentUser is available, use it as the source of truth.
    // NOTE: Your AuthContext already merges Firebase Auth data with Firestore 'users' data.
    // We trust the context state.
    setUserProfile(currentUser);
    
    // Optional: If you need to force a re-fetch of the profile data (e.g., after an update)
    // You can define a fetchProfileData function here and pass it to children components.

  }, [currentUser, authLoading, navigate]);

  
  // Combine all loading states
  const totalLoading = authLoading || dataLoading || !userProfile;
  
  if (totalLoading) {
    // Safety check for Loader icon
    const LoaderIcon = ICONS?.Loader;
    return (
      <div className="site-container py-16 flex items-center justify-center">
        {LoaderIcon ? <LoaderIcon className="h-8 w-8 animate-spin text-navy" /> : <div className="animate-pulse">Loading...</div>}
      </div>
    );
  }

  // Fallback if authLoading finishes but there's no user (though useEffect redirects)
  if (!userProfile) {
    const AlertIcon = ICONS?.AlertCircle;
    return (
      <div className="site-container py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border-2 border-amber-200 bg-amber-50 p-8 text-center">
          {AlertIcon && <AlertIcon className="h-16 w-16 mx-auto text-amber-500 mb-4" />}
          <h2 className="text-2xl font-semibold text-amber-800 mb-2">Authentication Required</h2>
          <p className="text-amber-600 mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // 1. Define safeUser using the context data (now called userProfile)
  const safeUser = {
    // Use the custom fields from Firestore (merged in AuthContext) first
    id: userProfile.uid || userProfile.id || 'unknown',
    name: userProfile.name || userProfile.displayName || 'User',
    email: userProfile.email || 'No email',
    role: userProfile.role || 'buyer', // Role comes directly from Firestore merge
    avatarUrl: userProfile.photoURL || userProfile.avatarUrl || null,
    // Add other fields that might be stored in Firestore 'users' collection:
    phone: userProfile.phone || null,
    company: userProfile.company || null,
    verified: userProfile.verified || false,
    createdAt: userProfile.createdAt || null,
    lastLogin: userProfile.lastLogin || null,
  };

  // 2. Filter tabs
  const visibleTabs = tabs.filter((tab) => !tab.condition || tab.condition(safeUser));

  // Safety variables for icons in the header
  const ShieldIcon = ICONS?.Shield;
  const BriefcaseIcon = ICONS?.Briefcase;
  const CheckIcon = ICONS?.Check;
  
  // Function to update the local state after a successful update in AccountSettings
  const refreshUserProfile = async () => {
    // We simply trust the AuthContext to update itself, 
    // but if we need a manual update:
    // const refreshedData = await getUserProfileData(safeUser.id);
    // setUserProfile(prev => ({...prev, ...refreshedData}));
    // For simplicity, we just use the context user state, which updates automatically
    // when the AuthContext re-renders due to data changes (if implemented with listeners).
    // Here we'll just rely on the parent context re-render if data updates.
  };

  return (
    <ErrorBoundary>
      <div className="site-container py-8 md:py-12">
        {/* Profile Header (Uses safeUser) */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-navy to-indigo p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              {safeUser.avatarUrl ? (
                <img
                  src={safeUser.avatarUrl}
                  alt={safeUser.name}
                  className="h-20 w-20 rounded-full border-4 border-white/30 object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-3xl font-semibold">
                  {safeUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-display font-semibold mb-2">{safeUser.name}</h1>
                <p className="text-white/80 mb-2">{safeUser.email}</p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                    {safeUser.role === 'admin' && ShieldIcon && <ShieldIcon className="h-4 w-4" />}
                    {safeUser.role === 'dealer' && BriefcaseIcon && <BriefcaseIcon className="h-4 w-4" />}
                    {safeUser.role?.charAt(0).toUpperCase() + safeUser.role?.slice(1) || 'Buyer'}
                  </span>
                  {safeUser.role === 'dealer' && safeUser.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold">
                      {CheckIcon && <CheckIcon className="h-4 w-4" />}
                      Verified Dealer
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/post-property')}
                className="rounded-full bg-white/20 hover:bg-white/30 px-6 py-3 text-sm font-semibold transition backdrop-blur"
              >
                Post Property
              </button>
              
              {safeUser.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="rounded-full bg-white text-navy hover:bg-gray-100 px-6 py-3 text-sm font-semibold transition shadow-md"
                >
                  Admin Panel
                </button>
              )}
              {/* Add Logout Button for convenience */}
              <button
                onClick={logout}
                className="rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold transition text-white shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs (Remains the same) */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-navy text-navy'
                      : 'border-transparent text-slate hover:text-navy'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <ProfileOverview user={safeUser} />}
          {activeTab === 'listings' && <MyListings user={safeUser} />}
          {activeTab === 'favorites' && <FavoritesTab user={safeUser} />}
          {activeTab === 'messages' && <MessagesTab user={safeUser} />}
          {/* Note: AccountSettings might need a prop to trigger AuthContext/DB update */}
          {activeTab === 'settings' && <AccountSettings user={safeUser} onUpdate={refreshUserProfile} />} 
          {activeTab === 'dealer' && safeUser.role === 'dealer' && <DealerTab user={safeUser} />}
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfilePage;