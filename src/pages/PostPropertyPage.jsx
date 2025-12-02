// src/pages/PostPropertyPage.jsx (FINAL VERSION)

import React, { useState, useEffect } from 'react';
import { ICONS } from '../components/icons.jsx';
import { submitProperty } from '../utils/api.js';
import { useAuth } from '../context/AuthContext'; // 💡 Import useAuth

const initialForm = {
  propertyType: '',
  city: '',
  locality: '',
  price: '',
  amenities: '',
  ownerType: 'Owner',
  name: '',
  phone: '',
  email: '',
  photos: [], // Contains objects: { file: FileObject, preview: url, id: num }
};

const PostPropertyPage = () => {
  const { currentUser } = useAuth(); // 💡 Get user context
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null); // 💡 Error state

  // --- 💡 useEffect to pre-fill user details ---
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        // Pre-fill fields if user data is available
        name: currentUser.name || currentUser.displayName || prev.name,
        email: currentUser.email || prev.email,
        ownerType: currentUser.role === 'dealer' ? 'Broker' : prev.ownerType,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser]);


  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newImages],
    }));
  };

  const removeImage = (id) => {
    setForm((prev) => {
      const imageToRemove = prev.photos.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return {
        ...prev,
        photos: prev.photos.filter((img) => img.id !== id),
      };
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    setForm((prev) => {
      const newPhotos = [...prev.photos];
      const [moved] = newPhotos.splice(fromIndex, 1);
      newPhotos.splice(toIndex, 0, moved);
      return { ...prev, photos: newPhotos };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);
    
    if (form.photos.length === 0) {
      setSubmissionError('Please upload at least one photo for the listing.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Calls the Firebase-connected submitProperty function (now handles storage)
      const result = await submitProperty(form); 
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmissionError(result.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error.message || 'Failed to submit the property. Check the network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the component is reached without login (though PrivateRoute should prevent this)
  if (!currentUser) {
      return (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-16 text-center">
              <ICONS.AlertCircle className="h-16 w-16 rounded-full bg-red-100 p-4 text-red-600" />
              <h1 className="text-3xl font-display font-semibold text-navy">
                  Login Required to Post
              </h1>
              <p className="text-slate">
                  You need to be logged in to post a property. Please log in or register.
              </p>
          </div>
      );
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center">
        <ICONS.Check className="h-16 w-16 rounded-full bg-teal-500/20 p-4 text-teal-600" />
        <h1 className="text-3xl font-display font-semibold text-navy">
          Success! Your property is submitted.
        </h1>
        <p className="text-slate">
          Your listing has been submitted successfully and is awaiting review. Track enquiries and boost visibility from your dashboard.
        </p>
        <button
          onClick={() => {
            setForm(initialForm);
            setSubmitted(false);
          }}
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Post another property
        </button>
      </div>
    );
  }

  return (
    <div className="site-container space-y-8 py-12">
      <header className="space-y-3">
        <p className="floating-chip text-navy">Post Property (FREE)</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          List your property in minutes
        </h1>
        <p className="text-slate">
          Upload details, photos, and amenities. Aura Square promotes verified listings to buyers,
          renters, and investors across India.
        </p>
      </header>
      
      {submissionError && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 font-medium">
              Error: {submissionError}
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Property Type, City, Locality, Price fields remain the same */}
          <label className="space-y-2 text-sm font-semibold text-slate">
            Property Type
            <select
              required
              value={form.propertyType}
              onChange={(e) => updateField('propertyType', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            >
              <option value="">Select</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Studio</option>
              <option>Commercial</option>
              <option>Plot</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate">
            City
            <input
              required
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate">
            Locality
            <input
              required
              value={form.locality}
              onChange={(e) => updateField('locality', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate">
            Price (₹)
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-slate">
          Amenities
          <textarea
            value={form.amenities}
            onChange={(e) => updateField('amenities', e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate/20 px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
            placeholder="List key amenities separated by commas (e.g., Gym, Pool, Park)"
          />
        </label>

        {/* Photo Upload Section (Image management logic remains the same) */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate">
            Upload Photos
            <span className="ml-2 text-xs text-slate/60">(Multiple images supported, drag & drop)</span>
          </label>
          <div
            className="relative border-2 border-dashed border-slate/40 rounded-2xl p-8 text-center transition hover:border-navy/60 hover:bg-slate/5"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-navy', 'bg-slate/10');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-navy', 'bg-slate/10');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-navy', 'bg-slate/10');
              const files = Array.from(e.dataTransfer.files).filter((file) =>
                file.type.startsWith('image/')
              );
              if (files.length > 0) {
                const newImages = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                  id: Date.now() + Math.random(),
                }));
                setForm((prev) => ({
                  ...prev,
                  photos: [...prev.photos, ...newImages],
                }));
              }
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="photo-upload"
            />
            <div className="pointer-events-none">
              <ICONS.Upload className="h-12 w-12 mx-auto text-slate/40 mb-4" />
              <p className="text-sm font-medium text-slate mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-slate/60">
                Supports JPG, PNG, WEBP (Max 10MB per image)
              </p>
            </div>
          </div>
          {form.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {form.photos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="bg-white/90 text-navy p-2 rounded-lg hover:bg-white transition"
                        aria-label="Move left"
                      >
                        <ICONS.ChevronLeft className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(photo.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      aria-label="Remove image"
                    >
                      <ICONS.X className="h-4 w-4" />
                    </button>
                    {index < form.photos.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="bg-white/90 text-navy p-2 rounded-lg hover:bg-white transition"
                        aria-label="Move right"
                      >
                        <ICONS.ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-navy text-white text-xs px-2 py-1 rounded-full">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Details (Prefilled) */}
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-semibold text-slate">
            Owner/Broker
            <select
              value={form.ownerType}
              onChange={(e) => updateField('ownerType', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            >
              <option>Owner</option>
              <option>Broker</option>
              <option>Builder</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate">
            Your Name
            <input
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate">
            Phone
            <input
              required
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-slate">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-4 text-lg font-semibold text-white shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <ICONS.Loader className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit listing'
          )}
        </button>
      </form>
    </div>
  );
};

export default PostPropertyPage;