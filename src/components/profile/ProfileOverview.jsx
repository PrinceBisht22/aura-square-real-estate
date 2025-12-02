// src/components/profile/ProfileOverview.jsx (Firebase Integrated)
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons.jsx';

// 💡 NEW: Import Firebase API functions
import { 
  getMyListings, 
  getFavoriteIds, 
  fetchCollectionData 
} from '../../utils/api.js'; 


const ProfileOverview = ({ user }) => {
  const [stats, setStats] = useState({
    listings: 0,
    published: 0,
    favorites: 0,
    messages: 0,
    views: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const userId = user.id || user.uid;
      if (!userId) {
          setLoading(false);
          return;
      }
      
      try {
        // 1. Fetch all user-specific data concurrently
        const [listings, favoriteIds, messages] = await Promise.all([
            getMyListings(userId),              
            getFavoriteIds(userId),             
            fetchCollectionData('contactSubmissions', [['ownerId', '==', userId]]) 
        ]);

        // 2. Calculate statistics
        const published = listings.filter((l) => l.status === 'published').length;
        const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
        const totalLeads = listings.reduce((sum, l) => sum + (l.leads || 0), 0);

        setStats({
          listings: listings.length,
          published,
          favorites: favoriteIds.length,
          messages: messages.length,
          views: totalViews,
          leads: totalLeads,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user.id, user.uid]); 

  if (loading) {
    const Loader = ICONS?.Loader;
    return (
      <div className="text-center py-12 flex items-center justify-center gap-2">
        {Loader && <Loader className="h-5 w-5 animate-spin" />}
        <span>Loading stats...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Listings', value: stats.listings, icon: ICONS?.Home, color: 'bg-blue-50 text-blue-600' },
    { label: 'Published', value: stats.published, icon: ICONS?.Check, color: 'bg-green-50 text-green-600' },
    { label: 'Favorites', value: stats.favorites, icon: ICONS?.Heart, color: 'bg-red-50 text-red-600' },
    { label: 'Messages', value: stats.messages, icon: ICONS?.MessageSquare, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Views', value: stats.views, icon: ICONS?.Eye, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Leads', value: stats.leads, icon: ICONS?.Users, color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Quick Stats</h2>
        <p className="text-slate">Overview of your activity on Aura Square</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl bg-white border border-gray-200 p-6">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} mb-4`}>
                {Icon ? <Icon className="h-6 w-6" /> : <span className="text-xl font-bold">#</span>}
              </div>
              <p className="text-2xl font-display font-semibold text-navy mb-1">{stat.value}</p>
              <p className="text-xs text-slate">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate mb-1">Email</p>
              <p className="text-sm font-medium text-navy">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-xs text-slate mb-1">Phone</p>
                <p className="text-sm font-medium text-navy">{user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate mb-1">Member Since</p>
              <p className="text-sm font-medium text-navy">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
            {user.lastLogin && (
              <div>
                <p className="text-xs text-slate mb-1">Last Login</p>
                <p className="text-sm font-medium text-navy">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {user.role === 'dealer' && (
          <div className="rounded-2xl bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Dealer Information</h3>
            <div className="space-y-3">
              {user.company && (
                <div>
                  <p className="text-xs text-slate mb-1">Company</p>
                  <p className="text-sm font-medium text-navy">{user.company}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate mb-1">Verification Status</p>
                <p className={`text-sm font-medium ${user.verified ? 'text-green-600' : 'text-amber-600'}`}>
                  {user.verified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverview;