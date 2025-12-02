import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS } from '../icons.jsx';

// 💡 NEW: Import the real API functions
import { getMyListings, updateListingStatus, deleteListing } from '../../utils/api'; 
// Removed: import { listingAPI } from '../../utils/api-endpoints.js';
// Removed: import { LISTING_STATUS } from '../../utils/database.js';

// Define status constants locally for simplicity, or import them from a utility file
const LISTING_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    REMOVED: 'removed', // Used for deletion tracking/archiving
};


const MyListings = ({ user }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  // const [editingId, setEditingId] = useState(null); // Not used in render
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
  }, [user.id, filter]);

  const loadListings = async () => {
    // Check if user object has the UID (user.id or user.uid)
    const userId = user.id || user.uid; 
    if (!userId) {
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      // 💡 REPLACED: listingAPI.getListings with Firebase getMyListings
      const data = await getMyListings(userId); 
      
      let filteredData = data;
      // Filter the data client-side based on status
      if (filter !== 'all') {
        filteredData = data.filter(l => l.status === filter);
      }

      setListings(filteredData);
    } catch (error) {
      console.error('Failed to load listings:', error);
      // Optional: Set an error state here
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // 💡 REPLACED: updateListingStatus with Firebase function
      await updateListingStatus(id, newStatus); 
      // The updateDoc only updates the field; re-fetch the list to update the UI
      loadListings();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // 💡 REPLACED: deleteListing with Firebase function
      await deleteListing(id); 
      setDeleteConfirm(null);
      loadListings();
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  const handleEdit = (id) => {
    // Assuming edit route uses the listing ID
    navigate(`/post-property/${id}/edit`); // Adjusted the navigation path to a more typical route structure
  };

  if (loading) {
    return (
        <div className="text-center py-12 flex items-center justify-center gap-2">
            <ICONS.Loader className="h-6 w-6 animate-spin text-navy" /> 
            Loading listings...
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-navy mb-2">My Listings</h2>
          <p className="text-slate">Manage your property listings</p>
        </div>
        <button
          onClick={() => navigate('/post-property')}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-navy to-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          <ICONS.Plus className="h-4 w-4" />
          New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', LISTING_STATUS.DRAFT, LISTING_STATUS.PUBLISHED, LISTING_STATUS.REMOVED].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === status
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-slate hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <ICONS.Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-navy mb-2">No listings yet</h3>
          <p className="text-slate mb-6">Start by posting your first property</p>
          <button
            onClick={() => navigate('/post-property')}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            <ICONS.Plus className="h-4 w-4" />
            Post Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition"
            >
              {/* Ensure you have a 'photos' field on your Firestore documents with a url array */}
              {listing.photos?.[0] || listing.image ? ( // Check for photos array or single image field
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.photos?.[0]?.url || listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold ${
                      listing.status === LISTING_STATUS.PUBLISHED
                        ? 'bg-green-500 text-white'
                        : listing.status === LISTING_STATUS.DRAFT
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-500 text-white'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-navy mb-2 line-clamp-2">{listing.title}</h3>
                <p className="text-2xl font-display font-semibold text-navy mb-4">
                  ₹{listing.price?.toLocaleString() || 'N/A'}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate mb-4">
                  <span className="flex items-center gap-1">
                    <ICONS.Eye className="h-4 w-4" />
                    {listing.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <ICONS.Users className="h-4 w-4" />
                    {listing.leads || 0} leads
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Status Change Buttons */}
                  {listing.status === LISTING_STATUS.DRAFT && (
                    <button
                      onClick={() => handleStatusChange(listing.id, LISTING_STATUS.PUBLISHED)}
                      className="flex-1 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                    >
                      Publish
                    </button>
                  )}
                  {listing.status === LISTING_STATUS.PUBLISHED && (
                    <button
                      onClick={() => handleStatusChange(listing.id, LISTING_STATUS.DRAFT)}
                      className="flex-1 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(listing.id)}
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-navy transition hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(listing.id)}
                    className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation (Remains the same) */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-navy mb-2">Delete Listing?</h3>
              <p className="text-slate mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyListings;