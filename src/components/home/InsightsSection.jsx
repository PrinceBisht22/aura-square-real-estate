import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from '../icons.jsx'; // Adjust path if needed

const articles = [
  {
    id: 'housing-market-outlook-2025',
    category: 'Market Watch',
    date: 'Nov 12, 2025',
    readTime: '6 min read',
    title: '2025 Housing Market Outlook for NCR',
    description: 'Price momentum continues across Noida and Gurgaon micro-markets with launch pipelines focused on premium gated communities.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Building image
  },
  {
    id: 'home-loan-guide-2025',
    category: 'Home Finance',
    date: 'Nov 10, 2025',
    readTime: '5 min read',
    title: 'How to Pick the Right Home Loan in 2025',
    description: 'Compare floating vs fixed, understand repo-linked products, and use Aura Square tools to stay EMI-ready.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Money image
  },
  {
    id: 'co-working-trends',
    category: 'Commercial',
    date: 'Nov 08, 2025',
    readTime: '4 min read',
    title: 'Co-working Trends Indian Startups Should Know',
    description: 'From managed offices to flex passes, discover why hybrid-ready spaces are redefining commercial leasing.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Office image
  },
];

const InsightsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate mb-2">
            Articles & Guides
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-navy">
            Stay informed with Aura Square Insights
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -5 }}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-navy shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate/70 uppercase tracking-wide">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="mb-3 text-xl font-display font-semibold text-navy leading-snug group-hover:text-blue-600 transition-colors">
                  <Link to={`/insights/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="mb-6 flex-1 text-sm text-slate leading-relaxed">
                  {article.description}
                </p>

                {/* THE FUNCTIONAL BUTTON */}
                <div className="mt-auto">
                  <Link
                    to={`/insights/${article.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-all group-hover:gap-2 group-hover:text-blue-600"
                  >
                    Read Guide
                    {ICONS.ChevronRight ? (
                       <ICONS.ChevronRight className="h-4 w-4" /> 
                    ) : (
                       <span>&rarr;</span>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;