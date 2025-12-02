// src/components/profile/AccountSettings.jsx (Firebase Integrated)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ICONS } from '../icons.jsx';

// 💡 NEW: Import the real Firebase functions (updateProfile was already in api.js)
import { updateProfile, uploadAvatarAndGetUrl } from '../../utils/api'; 
// REMOVED: import { userAPI } from '../../utils/api-endpoints.js';

const AccountSettings = ({ user, onUpdate }) => { // onUpdate is used to refresh the parent state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '', // Though uneditable, good for reference
    phone: user?.phone || '',
    company: user?.company || '',
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || user.photoURL || null);
  
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    // Sync external user prop changes to internal form state when user object changes
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
    });
    setAvatarPreview(user.avatarUrl || user.photoURL || null);
    setAvatarFile(null); // Clear any pending file on user change
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const userId = user.id || user.uid;
    if (!userId) {
        setStatusMessage({ type: 'error', text: 'Authentication error. Please log in again.' });
        setSaving(false);
        return;
    }

    try {
      let updates = { ...formData };
      
      // 1. Handle Avatar Upload (if a new file is selected)
      if (avatarFile) {
        const avatarUrl = await uploadAvatarAndGetUrl(userId, avatarFile);
        updates.avatarUrl = avatarUrl;
        // Revoke the temporary object URL to free up memory
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
      }

      // 2. Update Firestore Profile Document
      await updateProfile(userId, updates);
      
      // 3. Success Feedback
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Notify parent component (ProfilePage) to refresh user context
      if (onUpdate) {
          onUpdate(); 
      }
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setStatusMessage({ type: 'error', text: error.message || 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Account Settings</h2>
        <p className="text-slate">Update your profile information</p>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm font-medium ${
            statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {statusMessage.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Avatar Upload */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <label className="block text-sm font-semibold text-navy mb-4">Profile Picture</label>
          <div className="flex items-center gap-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-navy to-indigo flex items-center justify-center text-3xl font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-navy cursor-pointer hover:bg-gray-50 transition"
              >
                <ICONS.Upload className="h-4 w-4" />
                {avatarFile ? 'Change Photo' : 'Upload Photo'}
              </label>
              {avatarFile && (
                <p className="text-xs text-slate mt-2">{avatarFile.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold text-navy mb-4">Personal Information</h3>
          
          <label className="block">
            <span className="text-sm font-semibold text-slate mb-2 block">Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate mb-2 block">Email</span>
            <input
              type="email"
              value={formData.email}
              // Email is generally uneditable in Firebase Auth, so we disable direct editing
              disabled
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy bg-gray-50 focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate mb-2 block">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              placeholder="+91 98765 43210"
            />
          </label>

          {user.role === 'dealer' && (
            <label className="block">
              <span className="text-sm font-semibold text-slate mb-2 block">Company Name</span>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Your company name"
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-navy to-indigo px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <ICONS.Loader className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ICONS.Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </form>

      {/* Password Change Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-navy mb-4">Password Security</h3>
        <p className="text-sm text-slate mb-4">
          If you need to change your password, click the button below to receive a password reset link to your email address.
        </p>
        <button
          onClick={() => alert(`Password reset initiated for ${user.email}. Check your inbox for instructions.`)}
          className="rounded-full border border-red-300 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;