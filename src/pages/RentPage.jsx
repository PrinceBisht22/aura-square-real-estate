import React, { useMemo, useState, useEffect } from 'react'; // 💡 Added useEffect
import FiltersPanel from '../components/FiltersPanel';
import PropertyCard from '../components/PropertyCard';
// Removed: import { residentialListings } from '../data/residentialListings';

// 💡 NEW: Import Firebase API functions
import { getResidentialListings } from '../utils/api'; 
import { ICONS } from '../components/icons.jsx'; // Assuming ICONS is needed for the loader

const defaultFilters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  bhk: '',
  propertyType: '',
  postedBy: 'Anyone',
  amenities: [],
};

const perPage = 8; // Kept your original perPage value for RentPage

const RentPage = () => {
  // 💡 NEW STATE: For fetching data
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);

  // --- 💡 DATA FETCHING useEffect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all residential properties from Firebase
        const data = await getResidentialListings();
        // 💡 CRUCIAL CHANGE: Filter to just 'Rent' listings
        const rentData = data.filter(item => item.listedFor === 'Rent');
        setAllListings(rentData);
      } catch (err) {
        console.error("Error fetching rental listings:", err);
        setError("Failed to load rental listings. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  // --- UPDATED: Filtering now uses the fetched 'allListings' state ---
  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // 💡 NOTE: The check 'listing.listedFor !== 'Rent'' is mostly redundant here.
      
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !listing.title.toLowerCase().includes(q) &&
          !listing.city.toLowerCase().includes(q) &&
          !listing.locality.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      // Price Filter (Uses listing.rent field)
      if (filters.minPrice && listing.rent < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && listing.rent > Number(filters.maxPrice)) {
        return false;
      }
      if (filters.bhk && listing.bhkType !== filters.bhk) {
        return false;
      }
      if (filters.propertyType && listing.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters.postedBy !== 'Anyone' && listing.postedBy !== filters.postedBy) {
        return false;
      }
      if (filters.amenities.length) {
        const hasAll = filters.amenities.every((amenity) =>
          listing.amenities?.includes(amenity), // Added null check for safety
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [filters, allListings]); // Dependency array updated to include allListings

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / perPage));
  const paginatedListings = filteredListings.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const changePage = (next) => {
    setPage((current) => {
      const value = Math.min(Math.max(1, next), totalPages);
      return value;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  // --- 💡 Loading and Error Rendering ---
  if (loading) {
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <ICONS.Loader className="h-8 w-8 animate-spin text-navy" />
              <p className='ml-3 text-lg text-slate-600'>Loading rental listings...</p>
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="space-y-3 pb-8">
        <p className="floating-chip text-navy">Rent</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Rental homes with verified owners
        </h1>
        <p className="text-slate">
          Ready-to-move apartments and studio homes with deposit insights, owner preferences,
          and amenity level detail for an informed decision.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <FiltersPanel filters={filters} onChange={handleFiltersChange} onReset={resetFilters} />
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate/10 bg-white/90 p-4 shadow-card">
            <p className="text-sm uppercase tracking-wide text-slate">Results</p>
            <p className="text-2xl font-semibold text-navy">
              {filteredListings.length} rental listings • Page {page} of {totalPages}
            </p>
          </div>

          <div className="grid gap-6">
            {paginatedListings.map((listing) => (
              <PropertyCard key={listing.id} property={listing} variant="list" />
            ))}
            {paginatedListings.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate/30 p-10 text-center text-slate">
                No rental homes match these filters. Update the criteria and try again.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-full border border-slate/20 bg-white px-4 py-2 text-sm font-semibold text-navy">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="rounded-full px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              className="rounded-full px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RentPage;