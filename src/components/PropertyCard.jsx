import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from './icons.jsx';

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const PropertyCard = ({ property, onViewDetails, variant = 'grid' }) => {
  const navigate = useNavigate();
  
  const priceLabel =
    property.listedFor === 'Rent'
      ? `₹${numberFormatter.format(property.rent)}/mo` // Shortened '/month' to '/mo' for better fit
      : `₹${numberFormatter.format(property.price)}`;

  const handleView = (e) => {
    e.stopPropagation(); // Prevent bubbling if card is clickable
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      navigate(`/property/${property.id}`);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={`property-card group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-sm backdrop-blur-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        variant === 'list' ? 'md:flex-row' : ''
      }`}
    >
      {/* Image Section */}
      <div className={variant === 'list' ? 'md:w-2/5' : 'w-full'}>
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          <img
            src={property.images?.[0] || property.photos?.[0]?.url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlays */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {property.featured && (
              <span className="rounded-lg bg-navy/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                Featured
              </span>
            )}
            {property.newlyLaunched && (
              <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-sm backdrop-blur-md">
                New
              </span>
            )}
          </div>
          <span className="absolute right-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-navy shadow-sm backdrop-blur-md">
            {property.listedFor}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <ICONS.Home className="h-3.5 w-3.5" />
            {property.propertyType}
          </div>
          <h3 className="line-clamp-1 text-lg font-bold text-navy" title={property.title}>
            {property.title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <ICONS.MapPin className="h-4 w-4 flex-shrink-0 text-orange-500" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </p>
        </div>

        {/* Features Tags */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {property.bhkType}
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {property.areaSqft?.toLocaleString()} sqft
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {property.bathrooms} Bath
          </span>
        </div>

        {/* Footer (Price + Button) - FIXED SECTION */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {property.listedFor === 'Rent' ? 'Rent / Month' : 'Price'}
              </p>
              <p className="text-xl font-bold text-navy">
                {priceLabel}
              </p>
            </div>
            
            <button
              onClick={handleView}
              className="group/btn flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              View Details
              <ICONS.ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

      </div>
    </motion.article>
  );
};

export default PropertyCard;