import React from 'react';
import clsx from 'clsx';

const TabsNav = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-full border border-slate/20 bg-white/80 p-1 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              activeTab === tab.id
                ? 'bg-navy text-white shadow-lg'
                : 'text-slate hover:bg-slate/10',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsNav;

