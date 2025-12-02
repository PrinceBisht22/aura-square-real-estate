import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ICONS } from '../icons.jsx';
import { getDealerVerification, submitDealerVerification } from '../../utils/database.js';
import { listingAPI } from '../../utils/api-endpoints.js';

const DealerTab = ({ user }) => {
  const [verification, setVerification] = useState(null);
  const [stats, setStats] = useState({ listings: 0, views: 0, leads: 0 });
  const [docFiles, setDocFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    const verificationData = getDealerVerification(user.id);
    setVerification(verificationData);

    const listings = await listingAPI.getListings({ ownerId: user.id });
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    const totalLeads = listings.reduce((sum, l) => sum + (l.leads || 0), 0);
    setStats({
      listings: listings.length,
      views: totalViews,
      leads: totalLeads,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocFiles(files);
  };

  const handleSubmitVerification = async () => {
    if (docFiles.length === 0) return;
    setSubmitting(true);
    try {
      const docs = docFiles.map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      const result = submitDealerVerification(user.id, docs);
      setVerification(result);
      setDocFiles([]);
    } catch (error) {
      console.error('Failed to submit verification:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Dealer Dashboard</h2>
        <p className="text-slate">Manage your dealer profile and verification</p>
      </div>

      {/* Verification Status */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Verification Status</h3>
        {user.verified ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <ICONS.Check className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Verified Dealer</p>
              <p className="text-sm text-green-600">Your account is verified and active</p>
            </div>
          </div>
        ) : verification?.status === 'pending' ? (
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
            <ICONS.Clock className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Verification Pending</p>
              <p className="text-sm text-amber-600">Your documents are under review</p>
            </div>
          </div>
        ) : (
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

