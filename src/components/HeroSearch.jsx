import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from './icons.jsx';

const modes = ['Buy', 'Rent'];

const HeroSearch = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const [form, setForm] = useState({
    query: '', // Location
    city: '',
    mode: 'Buy',
    budget: '',
    keywords: '', // Filters
  });

  // Parallax Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        const image = heroRef.current.querySelector('img');
        if (image) {
          image.style.transform = `translateY(${parallax}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Search Navigation
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Determine target page
    const route = form.mode === 'Buy' ? '/buy' : '/rent';
    
    // Build Query Params
    const params = new URLSearchParams();
    if (form.query) params.append('location', form.query);
    if (form.budget && form.budget !== 'All Budgets') params.append('budget', form.budget);
    if (form.keywords) params.append('keywords', form.keywords);
    
    // Navigate
    navigate(`${route}?${params.toString()}`);
  };

  const updateField = (field, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-slate-900 text-white shadow-2xl" style={{ zIndex: 1 }}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Aura Square hero"
          className="h-[120%] w-full object-cover transition-transform duration-75 ease-out"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      </div>

      <div className="relative py-12 md:py-20">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="floating-chip bg-white/20 text-xs text-white/80 backdrop-blur-md inline-block px-3 py-1 rounded-full border border-white/10">
                Trusted by 50,000+ buyers & renters
              </p>
              <h1 className="text-4xl font-display font-semibold leading-tight tracking-tight md:text-6xl">
                Find Your Next Home with Aura Square
              </h1>
              <p className="text-lg text-white/80 max-w-lg">
                Search properties across India – apartments, villas, plots, and
                commercial spaces.
              </p>

              {/* Buy / Rent Toggles */}
              <div className="flex flex-wrap gap-3">
                {modes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateField('mode', mode)}
                    className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
                      form.mode === mode
                        ? 'bg-white text-navy shadow-lg scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[32px] bg-white/95 p-6 text-slate shadow-2xl backdrop-blur-md"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr,1.2fr,1.3fr]">
                  
                  {/* Location Input */}
                  <label className="flex items-center gap-2 rounded-2xl border border-slate/15 bg-white px-3 py-3 text-sm shadow-sm transition focus-within:ring-2 focus-within:ring-gold/50">
                    <ICONS.MapPin className="h-5 w-5 text-gold shrink-0" />
                    {/* Changed text-base to text-sm */}
                    <input
                      type="text"
                      placeholder="City / Locality"
                      className="w-full bg-transparent text-sm font-medium text-navy placeholder:text-slate/50 focus:outline-none"
                      value={form.query}
                      onChange={(e) => updateField('query', e.target.value)}
                    />
                  </label>

                  {/* Budget Dropdown */}
                  <label className="flex items-center gap-2 rounded-2xl border border-slate/15 bg-white px-3 py-3 text-sm shadow-sm transition focus-within:ring-2 focus-within:ring-gold/50">
                    <ICONS.DollarSign className="h-4 w-4 text-slate/60 shrink-0" />
                    {/* Changed text-base to text-sm */}
                    <select
                      className="w-full bg-transparent text-sm font-medium text-navy focus:outline-none cursor-pointer"
                      value={form.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                    >
                      <option value="">All Budgets</option>
                      <option value="50L">Under ₹50L</option>
                      <option value="1Cr">₹50L - ₹1Cr</option>
                      <option value="2Cr">₹1Cr - ₹2Cr</option>
                      <option value="3Cr">₹2Cr +</option>
                    </select>
                  </label>

                  {/* Filters Input */}
                  <label className="flex items-center gap-2 rounded-2xl border border-slate/15 bg-white px-3 py-3 text-sm shadow-sm transition focus-within:ring-2 focus-within:ring-gold/50">
                    <ICONS.Filter className="h-5 w-5 text-slate/70 shrink-0" />
                    {/* Changed text-base to text-sm */}
                    <input
                      type="text"
                      placeholder="Keywords (e.g. Pool)"
                      className="w-full bg-transparent text-sm font-medium text-navy placeholder:text-slate/50 focus:outline-none"
                      value={form.keywords}
                      onChange={(e) => updateField('keywords', e.target.value)}
                    />
                  </label>
                </div>

                {/* Search Button */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-amber-400 px-6 py-4 text-lg font-bold text-navy shadow-lg transition transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] sm:flex-1"
                  >
                    <ICONS.Search className="h-5 w-5" />
                    Search Properties
                  </button>
                </div>
              </form>

              {/* Bottom Info Tags */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate/60">
                <span className="flex items-center gap-1"><ICONS.CheckCircle className="w-3 h-3" /> RERA Verified</span>
                <span className="flex items-center gap-1"><ICONS.Sparkles className="w-3 h-3" /> Smart Filters</span>
                <span className="flex items-center gap-1"><ICONS.TrendingUp className="w-3 h-3" /> Market Insights</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;