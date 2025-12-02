import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';
import { cityMarketData, cityTransactionData } from '../data/marketData.js'; // Import City Data
import { insightsPosts } from '../data/insights.js'; // Import Articles

// --- SPARKLINE COMPONENT ---
const Sparkline = ({ data, color = "#16a34a" }) => {
  const width = 100;
  const height = 35;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`M0,${height} ${points} ${width},${height}`} fill={`url(#gradient-${color})`} />
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length-1] - min) / (max - min)) * height} r="3" fill={color} stroke="white" strokeWidth="1" />
    </svg>
  );
};

const InsightsPage = () => {
  const [activeCity, setActiveCity] = useState('Dehradun'); // Default City
  const cities = ['Dehradun', 'Delhi', 'Chandigarh', 'Chennai'];

  const currentGainers = cityMarketData[activeCity] || [];
  const currentTransactions = cityTransactionData[activeCity] || [];

  return (
    <div className="site-container py-12 bg-gray-50 min-h-screen">
      
      {/* --- SECTION 1: MARKET DATA (Tables & Graphs) --- */}
      <div className="mb-16">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">MARKET INTELLIGENCE</p>
          <h1 className="text-3xl font-display font-bold text-navy mb-2">Real Estate Data Trends</h1>
          <p className="text-slate">Track property prices, trends, and rental yields for {activeCity}.</p>
        </div>

        {/* City Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCity === city 
                ? 'bg-navy text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Table 1: Top Gainers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-navy">Top Gainers in {activeCity} <span className="text-sm font-normal text-slate ml-2 block md:inline">Highest appreciation (YoY)</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50 text-xs uppercase text-slate font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-5 pl-6">Locality</th>
                  <th className="p-5">Rate (Avg)</th>
                  <th className="p-5">Rental Yield</th>
                  <th className="p-5">Price Trend (1 Year)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {currentGainers.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition group">
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <ICONS.MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-navy text-base">{item.locality}</p>
                          <p className="text-xs text-slate">{activeCity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-navy text-base">₹{item.rate.toLocaleString()}</p>
                      <p className="text-xs text-slate font-medium">/ sq.ft</p>
                    </td>
                    <td className="p-5">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-bold text-xs border border-green-100">
                        {item.yield}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col w-24">
                          <span className="text-green-600 font-bold flex items-center text-sm">
                            <ICONS.TrendingUp className="h-4 w-4 mr-1" /> {item.growth}%
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">YoY Growth</span>
                        </div>
                        <div className="w-32 pt-1">
                          <Sparkline data={item.trend} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Transaction Prices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-navy">Recent Transactions in {activeCity}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 text-xs uppercase text-slate font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-5 pl-6">Locality</th>
                  <th className="p-5">Transactions</th>
                  <th className="p-5">Asking Rate</th>
                  <th className="p-5">Actual Sold Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {currentTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-5 pl-6 font-semibold text-navy">{item.locality}</td>
                    <td className="p-5">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">{item.count} deals</span>
                    </td>
                    <td className="p-5 text-slate-500">₹{item.rate.toLocaleString()}/sq.ft</td>
                    <td className="p-5 font-bold text-navy">₹{item.txnRate.toLocaleString()}/sq.ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ARTICLES & GUIDES (Restored) --- */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">KNOWLEDGE CENTER</p>
            <h2 className="text-3xl font-display font-bold text-navy">Latest Articles & Guides </h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insightsPosts.map((article) => (
            <div
              key={article.id}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-navy shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="mb-3 text-xl font-display font-bold text-navy leading-tight group-hover:text-indigo-600 transition-colors">
                  <Link to={`/insights/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="mb-6 flex-1 text-sm text-slate leading-relaxed line-clamp-3">
                  {article.excerpt || article.description}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-4">
                  <Link
                    to={`/insights/${article.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-indigo-600 transition-all group/link"
                  >
                    Read Guide
                    <ICONS.ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default InsightsPage;