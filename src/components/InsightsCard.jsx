import React from 'react';
import { ICONS } from './icons.jsx';

const InsightsCard = ({ post }) => (
  <article className="glass-card flex h-full flex-col p-5 sm:p-6">
    <div className="relative h-52 w-full overflow-hidden rounded-2xl sm:h-60">
      <img
        src={post.image}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-navy">
        {post.category}
      </span>
    </div>
    <div className="mt-5 flex flex-1 flex-col">
      <p className="text-xs uppercase tracking-wide text-slate">
        {post.date} • {post.readTime}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-navy">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate">{post.excerpt}</p>
      <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy">
        Read Guide
        <ICONS.ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </article>
);

export default InsightsCard;

