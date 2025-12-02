import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../icons.jsx';

const CalculatorCard = ({ title, description, icon: Icon, to, gradient }) => {
  return (
    <Link
      to={to}
      className="group block h-full rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div
        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${gradient} text-white shadow-lg`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-navy">{title}</h3>
      <p className="text-sm text-slate">{description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo">
        <span>Calculate</span>
        <ICONS.ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default CalculatorCard;

