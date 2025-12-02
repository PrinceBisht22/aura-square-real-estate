import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';
import { insightsPosts } from '../data/insights.js'; 

const categories = ['All', ...new Set(insightsPosts.map((post) => post.category))];
const perPage = 6;

const ArticlesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return insightsPosts;
    return insightsPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
  const paginatedPosts = filteredPosts.slice((page - 1) * perPage, page * perPage);

  const changeCategory = (category) => { setActiveCategory(category); setPage(1); };

  return (
    <div className="site-container py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">KNOWLEDGE CENTER</p>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-navy mb-4">Articles, Guides & News</h1>
        <p className="text-lg text-slate leading-relaxed">Fresh perspectives from Aura Square advisors to help you make smarter real estate decisions.</p>
      </div>

      {/* Categories */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button key={category} onClick={() => changeCategory(category)} className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${activeCategory === category ? 'bg-navy text-white shadow-lg scale-105' : 'bg-white text-slate border border-gray-200 hover:border-navy/30 hover:bg-gray-50'}`}>
            {category}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((article) => (
          <div key={article.id} className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
            <div className="relative h-60 overflow-hidden bg-gray-100">
              <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute top-4 left-4"><span className="inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-navy shadow-sm">{article.category}</span></div>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide"><span>{article.date}</span><span>•</span><span>{article.readTime}</span></div>
              <h3 className="mb-3 text-xl font-display font-bold text-navy leading-tight group-hover:text-indigo-600 transition-colors"><Link to={`/insights/${article.id}`}>{article.title}</Link></h3>
              <p className="mb-6 flex-1 text-sm text-slate leading-relaxed line-clamp-3">{article.excerpt || article.description}</p>
              <div className="mt-auto border-t border-gray-100 pt-4">
                <Link to={`/insights/${article.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-indigo-600 transition-all group/link">
                  Read Guide <ICONS.ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && <div className="text-center py-20"><h3 className="text-lg font-bold text-navy">No articles found</h3><p className="text-slate">Try selecting a different category.</p></div>}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-bold text-navy hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Previous</button>
          <span className="text-sm font-medium text-slate">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-bold text-navy hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Next</button>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;