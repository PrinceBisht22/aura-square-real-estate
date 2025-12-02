import React, { useState, useEffect } from 'react'; // 💡 Added useState and useEffect
import { ICONS } from '../components/icons.jsx';
// Removed: import { commercialListings } from '../data/commercialListings';

// 💡 NEW: Import Firebase API function
import { getCommercialListings } from '../utils/api'; 

const CommercialCard = ({ listing }) => (
  <article className="glass-card flex flex-col gap-4 p-6">
    <div className="flex items-center justify-between">
      <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy">
        {listing.propertyType}
      </span>
      {listing.listedFor === 'Rent' ? (
        <p className="text-xl font-semibold text-navy">
          ₹{listing.rent?.toLocaleString()} / month
        </p>
      ) : (
        <p className="text-xl font-semibold text-navy">
          ₹{listing.price?.toLocaleString()}
        </p>
      )}
    </div>
    <h3 className="text-xl font-semibold text-navy">{listing.title}</h3>
    <p className="flex items-center gap-2 text-sm text-slate">
      <ICONS.MapPin className="h-4 w-4 text-gold" />
      {listing.locality}, {listing.city}
    </p>
    <div className="flex flex-wrap gap-2 text-xs text-slate">
      {/* Ensure areaSqft exists on your commercial Firestore documents */}
      <span className="rounded-full border border-slate/30 px-3 py-1">
        {listing.areaSqft?.toLocaleString() || listing.areaSqyd?.toLocaleString() || '-'} {listing.areaSqft ? 'sqft' : 'sqyd'}
      </span>
      <span className="rounded-full border border-slate/30 px-3 py-1">
        Posted by {listing.postedBy || 'Broker'}
      </span>
    </div>
    <div className="flex flex-wrap gap-2 text-xs text-slate">
      {/* Ensure amenities is an array */}
      {listing.amenities?.map((amenity) => (
        <span key={amenity} className="rounded-full bg-navy/5 px-3 py-1">
          {amenity}
        </span>
      ))}
    </div>
  </article>
);

const CommercialPage = () => {
  // 💡 NEW STATE: For fetching data
  const [commercialListings, setCommercialListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 💡 DATA FETCHING useEffect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the Firebase API function to fetch all commercial listings
        const data = await getCommercialListings();
        setCommercialListings(data);
      } catch (err) {
        console.error("Error fetching commercial listings:", err);
        setError("Failed to load commercial listings. Please try refreshing.");
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
              <p className='ml-3 text-lg text-slate-600'>Loading commercial inventory...</p>
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
    <div className="space-y-12 pb-16">
      <section className="bg-sand/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="floating-chip text-navy">Commercial</p>
          <h1 className="mt-4 text-4xl font-display font-semibold text-navy">
            Offices, retail, co-working, and warehousing
          </h1>
          <p className="mt-3 text-slate">
            Premium inventory across Grade A towers, high street retail, managed co-working,
            and warehousing assets with rental yield projections.
          </p>
          {/* STATS remain the same, assuming they are static or derived from the data */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Average yield', value: '8.6%' },
              { label: 'Cities covered', value: '12' },
              { label: 'Managed offices', value: '85+' },
              { label: 'Active tenants', value: '320+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/80 p-4 text-center">
                <p className="text-2xl font-display text-navy">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-slate">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="floating-chip text-navy">Trending inventory</p>
          <h2 className="section-heading">High-visibility commercial listings</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {commercialListings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate/30 p-10 text-center text-slate col-span-2">
                No commercial listings found in the database.
              </div>
          ) : (
            commercialListings.map((listing) => (
              <CommercialCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default CommercialPage;