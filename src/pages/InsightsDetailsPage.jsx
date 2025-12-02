import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ICONS } from '../components/icons.jsx';
import { insightsPosts } from '../data/insights.js'; 

const InsightsDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const found = insightsPosts.find((a) => a.id === id);
    if (found) {
      setArticle(found);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!article && !insightsPosts.find(a => a.id === id)) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center"><ICONS.Search className="h-8 w-8 text-slate/40" /></div>
        <h2 className="text-2xl font-bold text-navy">Article not found</h2>
        <button onClick={() => navigate('/insights')} className="mt-4 rounded-full bg-navy px-6 py-2.5 font-semibold text-white shadow-lg transition hover:bg-navy/90">Back to Insights</button>
      </div>
    );
  }

  if (!article) return null;

  return (
    <article className="min-h-screen bg-white pb-20">
      <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 md:h-[500px]">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        <div className="site-container absolute bottom-0 left-0 right-0 pb-12 pt-32 text-white">
          <Link to="/insights" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30 transition"><ICONS.ArrowLeft className="h-4 w-4" /> Back to Insights</Link>
          <div className="mb-4 flex items-center gap-4 text-sm font-medium text-white/80"><span className="rounded-full bg-blue-600 px-3 py-1 text-white shadow-sm">{article.category}</span><span>{article.date}</span><span>•</span><span>{article.readTime}</span></div>
          <h1 className="max-w-4xl font-display text-3xl font-bold leading-tight md:text-5xl lg:text-6xl">{article.title}</h1>
        </div>
      </div>

      <div className="site-container mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="prose prose-lg prose-slate max-w-none"><div dangerouslySetInnerHTML={{ __html: article.content }} /></div>
          <hr className="my-10 border-gray-100" />
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-6 border border-gray-100">
            <div className="h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-xl font-bold text-navy flex">{(article.author || 'A').charAt(0)}</div>
            <div><p className="text-xs font-bold text-slate uppercase tracking-wide">Written by</p><h4 className="text-lg font-bold text-navy">{article.author || 'Aura Square Team'}</h4><p className="text-sm text-slate">Real Estate Analyst</p></div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-3xl border border-gray-100 p-8 shadow-sm bg-white">
            <h3 className="mb-4 text-lg font-bold text-navy">Subscribe to Insights</h3>
            <p className="mb-6 text-sm text-slate">Get the latest property trends and market analysis delivered to your inbox.</p>
            <input type="email" placeholder="Your email address" className="mb-3 w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-navy focus:ring-navy outline-none" />
            <button className="w-full rounded-xl bg-navy py-3 text-sm font-bold text-white hover:bg-navy/90 transition shadow-md">Subscribe</button>
          </div>
          <div className="rounded-3xl bg-navy p-8 text-white shadow-lg">
            <h3 className="mb-2 text-xl font-bold">Need Expert Advice?</h3>
            <p className="mb-6 text-white/80 text-sm">Speak to our property consultants today to find the best opportunities in the market.</p>
            <Link to="/contact" className="inline-block w-full text-center rounded-xl bg-white py-3 text-sm font-bold text-navy hover:bg-gray-50 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default InsightsDetailsPage;