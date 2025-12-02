import React from 'react';
import { ICONS } from './icons.jsx';

const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'];
const propertyTypes = ['Apartment', 'Studio', 'Villa', 'Duplex', 'Penthouse'];
const postedByOptions = ['Anyone', 'Owner', 'Broker', 'Builder'];
const amenityOptions = [
  'Swimming Pool',
  'Gym',
  'Club House',
  'Security',
  'Power Backup',
  'Park',
  'Kids Play Area',
];

const FiltersPanel = ({ filters, onChange, onReset }) => {
  const updateField = (field, value) =>
    onChange({
      ...filters,
      [field]: value,
    });

  const toggleAmenity = (amenity) => {
    const list = new Set(filters.amenities);
    if (list.has(amenity)) {
      list.delete(amenity);
    } else {
      list.add(amenity);
    }
    updateField('amenities', Array.from(list));
  };

  return (
    <aside className="space-y-6 rounded-3xl border border-slate/10 bg-white/90 p-6 shadow-card">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate">Filters</p>
          <h3 className="text-xl font-semibold text-navy">Refine search</h3>
        </div>
        <button
          className="text-sm font-semibold text-indigo"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </header>

      <label className="space-y-2 text-sm font-semibold text-slate">
        Location / Keywords
        <div className="flex items-center gap-2 rounded-2xl border border-slate/20 px-3 py-2.5">
          <ICONS.MapPin className="h-4 w-4 text-gold" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
            placeholder="City, project, developer..."
            className="w-full bg-transparent text-base font-medium text-navy focus:outline-none"
          />
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold text-slate">
          Min Budget
          <input
            type="number"
            min="0"
            className="mt-1 w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            value={filters.minPrice}
            onChange={(e) => updateField('minPrice', e.target.value)}
            placeholder="₹"
          />
        </label>
        <label className="text-sm font-semibold text-slate">
          Max Budget
          <input
            type="number"
            min="0"
            className="mt-1 w-full rounded-2xl border border-slate/20 px-3 py-2 font-medium text-navy focus:border-navy focus:outline-none"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', e.target.value)}
            placeholder="₹"
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate">BHK Type</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {bhkOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField('bhk', option === filters.bhk ? '' : option)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                filters.bhk === option
                  ? 'border-navy bg-navy text-white'
                  : 'border-slate/30 text-slate hover:border-navy'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <label className="text-sm font-semibold text-slate">
        Property Type
        <select
          className="mt-2 w-full rounded-2xl border border-slate/20 px-3 py-2 text-base font-medium text-navy focus:border-navy focus:outline-none"
          value={filters.propertyType}
          onChange={(e) => updateField('propertyType', e.target.value)}
        >
          <option value="">All</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold text-slate">
        Posted By
        <select
          className="mt-2 w-full rounded-2xl border border-slate/20 px-3 py-2 text-base font-medium text-navy focus:border-navy focus:outline-none"
          value={filters.postedBy}
          onChange={(e) => updateField('postedBy', e.target.value)}
        >
          {postedByOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="text-sm font-semibold text-slate">Amenities</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                filters.amenities.includes(amenity)
                  ? 'border-teal bg-teal/10 text-teal-800'
                  : 'border-slate/30 text-slate hover:border-teal hover:text-teal'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersPanel;

