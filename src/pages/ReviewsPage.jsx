import React, { useState, useEffect } from 'react';
import { ICONS } from '../components/icons.jsx';

// 💡 NEW: Import the real API functions and Auth context
import { getAllReviews, submitReview } from '../utils/api'; 
import { useAuth } from '../context/AuthContext';
// Removed: import { reviews as initialReviews } from '../data/reviews.js';

const ReviewsPage = () => {
  const { currentUser, loading: authLoading } = useAuth(); // Get user context
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', locality: '', city: '', comment: '' });

  // --- DATA FETCHING ---
  useEffect(() => {
    loadReviews();
    // Pre-fill form if user is logged in
    if (currentUser) {
        setFormData(prev => ({
            ...prev,
            name: currentUser.name || currentUser.displayName || prev.name,
        }));
    }
  }, [currentUser]);

  const loadReviews = async () => {
    try {
        setLoading(true);
        // 💡 REPLACED: Local data import with Firebase function
        const data = await getAllReviews();
        // Filter for approved/published reviews for display
        setReviews(data.filter(r => r.status === 'published')); 
    } catch (error) {
        console.error('Failed to load reviews:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRating === 0) return alert("Please select a star rating");
    if (!currentUser) return alert("You must be logged in to submit a review.");

    setIsSubmitting(true);

    try {
        const reviewData = {
            name: formData.name,
            locality: formData.locality,
            city: formData.city,
            rating: selectedRating,
            comment: formData.comment
        };

        // 💡 REPLACED: Local state update with Firebase function
        await submitReview(reviewData, currentUser.uid, currentUser.name || currentUser.displayName);
        
        // Clear form after success
        setFormData({ name: currentUser.name || currentUser.displayName || '', locality: '', city: '', comment: '' });
        setSelectedRating(0);
        alert("Review Submitted Successfully! It is now pending moderation.");
        // Optionally, reload reviews after a delay if you want to show pending state
        // setTimeout(loadReviews, 2000); 

    } catch (error) {
        console.error('Submission error:', error);
        alert(error.message || "Failed to submit review.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="site-container py-12 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-navy mb-4">Locality Reviews</h1>
        <p className="text-slate text-lg">Real voices, real experiences. Read what residents have to say about their neighborhoods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: WRITE A REVIEW FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-navy mb-4">Write a Review</h3>
            
            {authLoading || !currentUser ? (
                 <div className="text-center py-8 border border-amber-200 bg-amber-50 rounded-xl">
                    <ICONS.AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-sm font-semibold text-amber-800">Please log in to submit a review.</p>
                 </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Star Rating Input */}
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Rate your locality</label>
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        >
                        <ICONS.Sparkles 
                            className={`w-8 h-8 ${
                            star <= (hoverRating || selectedRating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                        />
                        </button>
                    ))}
                    </div>
                </div>

                <input 
                    required
                    placeholder="Your Name" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-navy/10 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled // Prefilled by useEffect
                />
                
                <div className="flex gap-2">
                    <input 
                    required
                    placeholder="Locality (e.g. Whitefield)" 
                    className="w-1/2 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-navy/10 outline-none"
                    value={formData.locality}
                    onChange={e => setFormData({...formData, locality: e.target.value})}
                    />
                    <input 
                    required
                    placeholder="City" 
                    className="w-1/2 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-navy/10 outline-none"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                </div>

                <textarea 
                    required
                    rows="4"
                    placeholder="What's good? What's bad? (e.g. Traffic, Safety, Water)" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-navy/10 outline-none resize-none"
                    value={formData.comment}
                    onChange={e => setFormData({...formData, comment: e.target.value})}
                />

                <button 
                    className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition shadow-lg disabled:opacity-50"
                    disabled={isSubmitting || selectedRating === 0}
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                </form>
            )}
          </div>
        </div>

        {/* RIGHT: REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
             <div className="text-center py-12"><ICONS.Loader className="animate-spin w-8 h-8 text-navy mx-auto" /></div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-12 text-center">
                <ICONS.MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">No Published Reviews</h3>
                <p className="text-slate">Be the first to review your locality!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-navy font-bold text-lg border border-white shadow-sm">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-lg">{review.user}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{review.locality}, {review.city}</span>
                        <span>•</span>
                        {/* Format date if it's an ISO string */}
                        <span>{review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                    <span className="font-bold text-green-700 text-lg">{review.rating}.0</span>
                    <ICONS.Sparkles className="w-4 h-4 text-green-600 fill-green-600" />
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">"{review.comment}"</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewsPage;