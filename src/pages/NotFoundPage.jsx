import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="floating-chip text-navy">404</p>
    <h1 className="text-4xl font-display font-semibold text-navy">
      We can’t find that page
    </h1>
    <p className="text-slate">
      The page you’re looking for may have moved. Explore listings, projects, and tools from the homepage.
    </p>
    <Link
      to="/"
      className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg"
    >
      Go home
    </Link>
  </div>
);

export default NotFoundPage;

