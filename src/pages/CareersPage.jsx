import React from 'react';
import { ICONS } from '../components/icons.jsx';

const perks = [
  { icon: ICONS.TrendingUp, title: "Competitive Pay", desc: "Top-tier market salaries with generous performance bonuses and equity options." },
  { icon: ICONS.Heart, title: "Health & Wellness", desc: "Comprehensive medical insurance for you and your family, plus gym memberships." },
  { icon: ICONS.Clock, title: "Flexible Hours", desc: "We focus on output, not hours. Work remotely or from our hubs in Bangalore & Gurgaon." },
  { icon: ICONS.Sparkles, title: "Learning Budget", desc: "Annual allowance for courses, books, and conferences to keep you sharp." }
];

const jobs = [
  { id: 1, role: "Senior Frontend Engineer", dept: "Engineering", location: "Bangalore (Hybrid)", type: "Full-time" },
  { id: 2, role: "Product Manager - Growth", dept: "Product", location: "Gurgaon", type: "Full-time" },
  { id: 3, role: "Real Estate Consultant", dept: "Sales", location: "Mumbai", type: "Full-time" },
  { id: 4, role: "UI/UX Designer", dept: "Design", location: "Remote", type: "Contract" },
];

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-navy text-white py-24 relative overflow-hidden">
        <div className="site-container relative z-10 text-center">
          <p className="text-gold font-bold tracking-widest uppercase mb-4">JOIN THE REVOLUTION</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Build the future of <br/>Real Estate.</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            We are solving complex problems in a $200B industry. Join a team of builders, dreamers, and doers.
          </p>
          <button className="bg-white text-navy px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
            View Open Positions
          </button>
        </div>
        {/* Decorative bg elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </section>

      {/* Perks Grid */}
      <section className="site-container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy mb-4">Why work at Aura Square?</h2>
          <p className="text-slate">We take care of our people so they can take care of our customers.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-navy mb-6">
                <perk.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">{perk.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Listings */}
      <section className="bg-slate-50 py-20">
        <div className="site-container max-w-4xl">
          <h2 className="text-3xl font-bold text-navy mb-10">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="group flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 hover:border-navy/30 hover:shadow-md transition cursor-pointer">
                <div>
                  <h3 className="font-bold text-lg text-navy group-hover:text-blue-600 transition-colors">{job.role}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><ICONS.Briefcase className="w-4 h-4" /> {job.dept}</span>
                    <span className="flex items-center gap-1"><ICONS.MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><ICONS.Clock className="w-4 h-4" /> {job.type}</span>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-2 rounded-full border border-navy text-navy font-bold text-sm group-hover:bg-navy group-hover:text-white transition">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default CareersPage;