import React from 'react';
import { ICONS } from '../icons.jsx';

const ResultPanel = ({ title, results, onReset, onSave, onShare, onExport, children }) => {
  return (
    <div className="sticky top-24 rounded-3xl border border-white/60 bg-gradient-to-br from-navy/5 to-indigo/5 p-6 shadow-card backdrop-blur-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-navy">{title}</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="rounded-full border border-slate/20 px-3 py-1.5 text-xs font-semibold text-slate transition hover:bg-white"
            aria-label="Reset calculator"
          >
            Reset
          </button>
        )}
      </div>

      <div role="status" aria-live="polite" className="space-y-4">
        {results && results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-white/60 p-4 backdrop-blur-sm"
              >
                <span className="text-sm font-medium text-slate">{result.label}</span>
                <span className="text-lg font-semibold text-navy">{result.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/40 p-8 text-center">
            <ICONS.Calculator className="mx-auto h-12 w-12 text-slate/40" />
            <p className="mt-2 text-sm text-slate">Enter values to see results</p>
          </div>
        )}

        {children}
      </div>

      {(onSave || onShare || onExport) && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate/20 pt-4">
          {onSave && (
            <button
              onClick={onSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-slate/5"
            >
              <ICONS.Save className="h-4 w-4" />
              Save
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-slate/5"
            >
              <ICONS.Share className="h-4 w-4" />
              Share
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-slate/5"
            >
              <ICONS.Download className="h-4 w-4" />
              Export
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultPanel;

