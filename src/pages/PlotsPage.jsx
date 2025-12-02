import React, { useState, useEffect } from 'react'; // 💡 Added useState and useEffect
// Removed: import { plots } from '../data/plots';
import { ICONS } from '../components/icons.jsx';

// 💡 NEW: Import Firebase API function
import { getPlots } from '../utils/api'; 

const PlotsPage = () => {
  // 💡 NEW STATE: For fetching data
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 💡 DATA FETCHING useEffect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the Firebase API function to fetch all plot listings
        const data = await getPlots();
        setPlots(data);
      } catch (err) {
        console.error("Error fetching plot listings:", err);
        setError("Failed to load plot listings. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  // --- 💡 Loading and Error Rendering ---
  if (loading) {
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <ICONS.Loader className="h-8 w-8 animate-spin text-navy" />
              <p className='ml-3 text-lg text-slate-600'>Loading plot inventory...</p>
          </div>
      );
  }

  if (error) {
    return (
        <div className="site-container py-12 text-center text-red-600 border border-red-200 bg-red-50 rounded-lg">
            <h2>Data Load Error</h2>
            <p>{error}</p>
        </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
      <header className="space-y-3">
        <p className="floating-chip text-navy">Plots / Land</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Plotted developments across growth corridors
        </h1>
        <p className="text-slate">
          Discover gated villa plots, farm lands, and industrial parcels with infrastructure access, clear titles,
          and ready documentation.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {plots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate/30 p-10 text-center text-slate col-span-2">
              No plot listings found in the database.
            </div>
        ) : (
          plots.map((plot) => (
            <article key={plot.id} className="glass-card flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy">
                  {plot.zone || plot.propertyType}
                </span>
                <p className="text-xl font-semibold text-navy">
                  {/* Ensure price exists on your plot Firestore documents */}
                  ₹{plot.price?.toLocaleString() || 'Price on Request'}
                </p>
              </div>
              <h3 className="text-xl font-semibold text-navy">{plot.title}</h3>
              <p className="flex items-center gap-2 text-sm text-slate">
                <ICONS.MapPin className="h-4 w-4 text-gold" />
                {plot.locality}, {plot.city}
              </p>
              <p className="text-sm text-slate">
                {/* Ensure areaSqyd exists, fallback to areaSqft */}
                {plot.areaSqyd?.toLocaleString() || plot.areaSqft?.toLocaleString() || '-'} sq.yd • Posted by {plot.postedBy || 'Owner'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate">
                {/* Ensure amenities is an array */}
                {plot.amenities?.map((amenity) => (
                  <span key={amenity} className="rounded-full border border-slate/30 px-3 py-1">
                    {amenity}
                  </span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default PlotsPage;