import React, { useState } from 'react';
import { ICONS } from '../icons.jsx';
import { userAPI } from '../../utils/api-endpoints.js';

const AccountSettings = ({ user, setUser }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    company: user.company || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    setSuccess(false);

    try {
      const updates = { ...form };
      
      if (avatarFile) {
        const { avatarUrl } = await userAPI.uploadAvatar(avatarFile);
        updates.avatarUrl = avatarUrl;
      }

      const updated = await userAPI.updateMe(updates);
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate mb-2 block">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate mb-2 block">Phone</span>
            <input
              type="tel"
              value={form.phone}
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
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Your company name"
              />
            </label>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 flex items-center gap-2">
            <ICONS.Check className="h-5 w-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}

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
    </div>
  );
};

export default AccountSettings;

