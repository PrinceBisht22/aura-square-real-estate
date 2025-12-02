import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalculatorInput from '../components/calculators/CalculatorInput';
import ResultPanel from '../components/calculators/ResultPanel';
import { ICONS } from '../components/icons.jsx';
import { convertArea, formatArea } from '../utils/calculators';

const AreaConverterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({
    value: searchParams.get('v') || '',
    unit: searchParams.get('u') || 'sq-ft',
  });
  const [converted, setConverted] = useState(null);
  const [showCommas, setShowCommas] = useState(true);

  useEffect(() => {
    if (form.value && !isNaN(form.value) && parseFloat(form.value) > 0) {
      const result = convertArea(parseFloat(form.value), form.unit);
      setConverted(result);
      setSearchParams({ v: form.value, u: form.unit });
    } else {
      setConverted(null);
      if (!form.value) {
        setSearchParams({});
      }
    }
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({ value: '', unit: 'sq-ft' });
    setConverted(null);
    setSearchParams({});
  };

  const handleCopyAll = () => {
    if (!converted) return;
    const text = Object.entries(converted)
      .map(([unit, val]) => `${formatArea(val, unit, showCommas)}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('All conversions copied to clipboard!');
  };

  const handleExport = () => {
    if (!converted) return;
    const csv = [
      ['Area Converter Results'],
      ['Input Value', `${form.value} ${form.unit}`],
      [''],
      ['Unit', 'Value'],
      ['Square Feet', formatArea(converted['sq-ft'], 'sq-ft', false)],
      ['Square Yard', formatArea(converted['sq-yd'], 'sq-yd', false)],
      ['Square Meter', formatArea(converted['sq-m'], 'sq-m', false)],
      ['Acre', formatArea(converted.acre, 'acre', false)],
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'area-conversion.csv';
    a.click();
  };

  const resultItems = converted
    ? [
        {
          label: 'Square Feet',
          value: formatArea(converted['sq-ft'], 'sq-ft', showCommas),
        },
        {
          label: 'Square Yard',
          value: formatArea(converted['sq-yd'], 'sq-yd', showCommas),
        },
        {
          label: 'Square Meter',
          value: formatArea(converted['sq-m'], 'sq-m', showCommas),
        },
        {
          label: 'Acre',
          value: formatArea(converted.acre, 'acre', showCommas),
        },
      ]
    : [];

  return (
    <div className="site-container space-y-8 py-12">
      <header className="space-y-3">
        <p className="floating-chip text-navy">Area Converter</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Convert area units instantly
        </h1>
        <p className="text-slate">
          Convert between square feet, square yards, square meters, and acres with real-time
          calculations.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card">
          <div className="space-y-4">
            <CalculatorInput
              label="Enter Area Value"
              name="value"
              value={form.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="1000"
              helperText="Enter the area value to convert"
              icon={ICONS.Area}
              min="0"
              step="0.01"
              required
            />

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate">Select Unit</span>
              <select
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full rounded-2xl border border-slate/20 px-4 py-3 text-base font-medium text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                <option value="sq-ft">Square Feet (sq ft)</option>
                <option value="sq-yd">Square Yard (sq yd)</option>
                <option value="sq-m">Square Meter (sq m)</option>
                <option value="acre">Acre</option>
              </select>
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-slate/20 bg-white/60 p-3">
              <input
                type="checkbox"
                id="commas"
                checked={showCommas}
                onChange={(e) => setShowCommas(e.target.checked)}
                className="h-4 w-4 rounded border-slate/30 text-navy focus:ring-navy/20"
              />
              <label htmlFor="commas" className="text-sm font-medium text-slate">
                Show commas in numbers
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-slate/5 p-4 text-sm text-slate">
            <p className="font-semibold text-navy mb-2">Conversion Reference:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>1 sq ft = 0.09290304 sq m</li>
              <li>1 sq yd = 9 sq ft</li>
              <li>1 acre = 43,560 sq ft</li>
              <li>1 sq m = 10.7639104 sq ft</li>
            </ul>
          </div>
        </div>

        <ResultPanel
          title="Converted Values"
          results={resultItems}
          onReset={handleReset}
          onShare={converted ? handleCopyAll : undefined}
          onExport={converted ? handleExport : undefined}
        >
          {converted && (
            <div className="mt-6">
              <button
                onClick={handleCopyAll}
                className="w-full rounded-2xl border border-slate/20 bg-white px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate/5"
              >
                <ICONS.Copy className="mr-2 inline-block h-4 w-4" />
                Copy All Values
              </button>
            </div>
          )}
        </ResultPanel>
      </div>
    </div>
  );
};

export default AreaConverterPage;

