import React from 'react';
import { ICONS } from '../components/icons.jsx';

const pressReleases = [
  {
    id: 1,
    date: 'Nov 20, 2025',
    source: 'Economic Times',
    title: 'Aura Square raises Series B funding to expand into Tier-2 cities',
    desc: 'The round was led by top venture capital firms, valuing the company at $500M.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    date: 'Oct 15, 2025',
    source: 'TechCrunch',
    title: 'How PropTech is revolutionizing Indian Real Estate',
    desc: 'Aura Square CEO discusses the future of digital property buying and AI integration.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    date: 'Sep 05, 2025',
    source: 'Mint',
    title: 'Aura Square launches "Verified by Aura" guarantee',
    desc: 'A new initiative to eliminate fake listings and ensure 100% transparent transactions.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  }
];

const MediaPage = () => {
  return (
    <div className="site-container py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-xs font-bold tracking-widest text-navy uppercase mb-3">NEWSROOM</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-6">Aura Square in the News</h1>
        <p className="text-lg text-slate">
          Latest updates, press releases, and media coverage about our journey to transform real estate.
        </p>
      </div>

      {/* Featured Press Grid */}
      <div className="grid gap-8 md:grid-cols-3 mb-20">
        {pressReleases.map((item) => (
          <a href="#" key={item.id} className="group block">
            <div className="overflow-hidden rounded-2xl bg-gray-100 h-56 mb-6">
              <img 
                src={item.image} 
                alt={item.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase mb-3">
              <span className="text-navy">{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate text-sm leading-relaxed">
              {item.desc}
            </p>
          </a>
        ))}
      </div>

      {/* Media Contact Box */}
      <div className="bg-navy rounded-3xl p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Media Enquiries</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          For press kits, interview requests, or official statements, please contact our communications team.
        </p>
        <a href="mailto:press@aurasquare.com" className="inline-flex items-center gap-2 bg-white text-navy px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          <ICONS.Mail className="w-5 h-5" />
          press@aurasquare.com
        </a>
      </div>

    </div>
  );
};

export default MediaPage;