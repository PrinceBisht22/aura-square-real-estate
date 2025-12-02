import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from './icons.jsx';

const iconMap = {
  'Budget Calculator': ICONS.TrendingUp,
  'EMI Calculator': ICONS.Calculator,
  'Loan Eligibility': ICONS.Key,
  'Area Converter': ICONS.Area,
};

const routeMap = {
  'Budget Calculator': '/tools/budget',
  'EMI Calculator': '/tools/emi',
  'Loan Eligibility': '/tools/loan-eligibility',
  'Area Converter': '/tools/area-converter',
};

const ToolsCard = ({ tool }) => {
  const Icon = iconMap[tool.title] ?? ICONS.Sparkles;
  const to = routeMap[tool.title] || '/tools';
  return (
    <Link
      to={to}
      className="group glass-card flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="rounded-2xl bg-navy/10 p-4 text-navy transition-transform group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-navy">{tool.title}</h4>
        <p className="text-sm text-slate">{tool.description}</p>
      </div>
      <ICONS.ChevronRight className="h-5 w-5 text-slate transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

export default ToolsCard;

