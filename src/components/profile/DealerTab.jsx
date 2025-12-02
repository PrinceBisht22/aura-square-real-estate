// src/components/profile/DealerTab.jsx (Firebase Integrated)
import React, { useState, useEffect } from 'react';
import { ICONS } from '../icons.jsx';
// 💡 NEW: Import universal API functions
import { getMyListings, submitDealerVerificationDocuments } from '../../utils/api'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Assuming we need firestore ops

// NOTE: The mock API functions and imports are removed.
// We will assume that 'submitDealerVerificationDocuments' is added to api.js.

const DealerTab = ({ user }) => {
  const [verification, setVerification] = useState(null); // Stores verification status document
  const [stats, setStats] = useState({ listings: 0, views: 0, leads: 0 });
  const [docFiles, setDocFiles] = useState([]); // Stores File objects for upload
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Utility to get a dedicated dealer verification document ---
  const fetchVerificationStatus = async (userId) => {
    // Assuming verification status is stored in a separate 'dealerVerifications' collection
    try {
        const { db } = await import('../../utils/firebaseConfig');
        const docRef = doc(db, 'dealerVerifications', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : { status: 'none' };
    } catch (e) {
        console.error("Failed to fetch verification status:", e);
        return { status: 'none' };
    }
  };


  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    const userId = user.id || user.uid;
    if (!userId) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
        // 1. Fetch data concurrently
        const [verificationData, listings] = await Promise.all([
            fetchVerificationStatus(userId), // Gets the status document
            getMyListings(userId)           // Gets user's active listings
        ]);

        // 2. Calculate stats
        const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
        const totalLeads = listings.reduce((sum, l) => sum + (l.leads || 0), 0);
        
        setVerification(verificationData);
        setStats({
          listings: listings.length,
          views: totalViews,
          leads: totalLeads,
        });

    } catch (error) {
      console.error('Failed to load dealer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocFiles(files);
  };

  const handleSubmitVerification = async () => {
    const userId = user.id || user.uid;
    if (docFiles.length === 0 || !userId) return;

    setSubmitting(true);
    try {
        // 💡 REPLACED: Mock function with Firebase-backed submission function
        // This function will upload the files to Storage and update the Firestore status.
        await submitDealerVerificationDocuments(userId, docFiles); 
        
        // Update local state to reflect submission
        setVerification(prev => ({ ...prev, status: 'pending' }));
        setDocFiles([]);
    } catch (error) {
        console.error('Failed to submit verification:', error);
        alert('Failed to submit documents. Check file sizes and console.');
    } finally {
        setSubmitting(false);
    }
  };
  
  if (loading) {
      return (
          <div className="text-center py-12 flex items-center justify-center gap-2">
              <ICONS.Loader className="h-6 w-6 animate-spin text-navy" /> 
              Loading dashboard...
          </div>
      );
  }

  // Determine current status for UI
  const currentStatus = user.verified ? 'verified' : verification?.status || 'none'; 
  const isPending = currentStatus === 'pending';
  const isNone = currentStatus === 'none';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Dealer Dashboard</h2>
        <p className="text-slate">Manage your dealer profile and verification</p>
      </div>

      {/* Verification Status */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Verification Status</h3>
        
        {/* Render based on currentStatus */}
        {currentStatus === 'verified' ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <ICONS.Check className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Verified Dealer</p>
              <p className="text-sm text-green-600">Your account is verified and active.</p>
            </div>
          </div>
        ) : isPending ? (
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
            <ICONS.Clock className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Verification Pending</p>
              <p className="text-sm text-amber-600">Your documents are under review. Check back in 1-2 business days.</p>
            </div>
          </div>
        ) : ( // Status: none
          <div className="space-y-4">
            <p className="text-slate">Submit verification documents to become a verified dealer</p>
            <div>
              <label className="block text-sm font-semibold text-slate mb-2">
                Upload Documents (GST, License, etc.)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
              {docFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {docFiles.map((file, idx) => (
                    <p key={idx} className="text-xs text-slate">{file.name}</p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmitVerification}
              disabled={docFiles.length === 0 || submitting}
              className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... (Analytics stats remain the same) ... */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ICONS.Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-semibold text-navy">{stats.listings}</p>
              <p className="text-xs text-slate">Active Listings</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
              <ICONS.Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-semibold text-navy">{stats.views}</p>
              <p className="text-xs text-slate">Total Views</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <ICONS.Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-display font-semibold text-navy">{stats.leads}</p>
              <p className="text-xs text-slate">Total Leads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Company Information</h3>
        <div className="space-y-3">
          {user.company && (
            <div>
              <p className="text-xs text-slate mb-1">Company Name</p>
              <p className="text-sm font-medium text-navy">{user.company}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate mb-1">Contact Email</p>
            <p className="text-sm font-medium text-navy">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-xs text-slate mb-1">Contact Phone</p>
              <p className="text-sm font-medium text-navy">{user.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerTab;