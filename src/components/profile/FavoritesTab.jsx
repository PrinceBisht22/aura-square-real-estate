import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from '../icons.jsx';

// 💡 NEW: Import the real API functions
import { getFavoriteIds, removeFavorite, getListingDetails } from '../../utils/api'; 
// We will fetch individual listing details in a loop for each favorite ID

const FavoritesTab = ({ user }) => {
  const [favorites, setFavorites] = useState([]); // Array of listing IDs
  const [listings, setListings] = useState([]); // Array of full listing objects
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, [user.id]);

  const loadFavorites = async () => {
    const userId = user.id || user.uid;
    if (!userId) {
        setLoading(false);
        setListings([]);
        return;
    }

    try {
      setLoading(true);
      // 1. Get the array of favorite IDs for the current user
      const favIds = await getFavoriteIds(userId);
      setFavorites(favIds);
      
      // 2. Fetch the full details for each favorite ID concurrently
      if (favIds.length > 0) {
        const detailPromises = favIds.map(id => getListingDetails(id));
        const detailedListings = (await Promise.all(detailPromises)).filter(l => l !== null); 
        setListings(detailedListings);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    const userId = user.id || user.uid;
    if (!userId) return;

    try {
      // 💡 REPLACED: Mock API with Firebase removeFavorite
      await removeFavorite(userId, listingId);
      loadFavorites(); // Re-fetch the list
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading favorites...</div>;
  }

  const HeartIcon = ICONS?.Heart;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Favorites</h2>
        <p className="text-slate">Properties you've saved</p>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          {HeartIcon && <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />}
          
          <h3 className="text-xl font-semibold text-navy mb-2">No favorites yet</h3>
          <p className="text-slate mb-6">Start exploring properties and save your favorites</p>
          <button
            onClick={() => navigate('/buy')}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition"
            >
              {listing.mainImage && ( // Use mainImage field created in PostProperty
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.mainImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(listing.id)}
                    className="absolute top-4 right-4 rounded-full bg-white/90 p-2 hover:bg-white transition"
                    aria-label="Remove favorite"
                  >
                    {HeartIcon ? (
                      <HeartIcon className="h-5 w-5 text-red-500 fill-red-500" />
                    ) : (
                      <span className="text-red-500 font-bold px-1">X</span>
                    )}
                  </button>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-navy mb-2 line-clamp-2">{listing.title}</h3>
                <p className="text-sm text-slate mb-3 line-clamp-1">{listing.locality}, {listing.city}</p>
                <p className="text-2xl font-display font-semibold text-navy mb-4">
                  ₹{listing.price?.toLocaleString() || listing.rent?.toLocaleString() || 'N/A'}
                </p>
                <button
                  onClick={() => navigate(`/property/${listing.id}`)}
                  className="w-full rounded-full bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;