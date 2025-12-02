import React from 'react';
import { Link } from 'react-router-dom';
import CalculatorCard from '../components/calculators/CalculatorCard';
import { ICONS } from '../components/icons.jsx';

const calculators = [
  {
    title: 'Budget Calculator',
    description: 'Plan affordability with taxes, fees, and down payment splits.',
    icon: ICONS.TrendingUp,
    to: '/tools/budget',
    gradient: 'bg-gradient-to-br from-teal to-indigo',
  },
  {
    title: 'EMI Calculator',
    description: 'Visualise EMI impact as rates and tenure change.',
    icon: ICONS.Calculator,
    to: '/tools/emi',
    gradient: 'bg-gradient-to-br from-gold to-amber-500',
  },
  {
    title: 'Loan Eligibility',
    description: 'Estimate sanction limits with salary, age, and credit profile.',
    icon: ICONS.Key,
    to: '/tools/loan-eligibility',
    gradient: 'bg-gradient-to-br from-navy to-indigo',
  },
  {
    title: 'Area Converter',
    description: 'Convert sq.ft. to sq.yd., sq.m., acres instantly.',
    icon: ICONS.Area,
    to: '/tools/area-converter',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
];

const ToolsPage = () => {
  return (
    <div className="site-container space-y-12 py-12">
      <header className="space-y-4 text-center">
        <p className="floating-chip text-navy">Use Popular Tools</p>
        <h1 className="text-4xl font-display font-semibold text-navy md:text-5xl">
          Plan smarter with Aura Square calculators
        </h1>
        <p className="mx-auto max-w-2xl text-slate">
          Make informed real estate decisions with our suite of free calculators. Plan your budget,
          estimate EMIs, check loan eligibility, and convert area units instantly.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {calculators.map((calc) => (
          <CalculatorCard key={calc.to} {...calc} />
        ))}
      </div>

      <section className="rounded-3xl bg-gradient-to-r from-navy/5 to-indigo/5 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-navy">Need help?</h2>
        <p className="mb-6 text-slate">
          Our team is here to assist you with any questions about property buying, loans, or
          investments.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          Contact Us
          <ICONS.ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default ToolsPage;

