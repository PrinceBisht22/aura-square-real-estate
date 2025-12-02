import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalculatorInput from '../components/calculators/CalculatorInput';
import ResultPanel from '../components/calculators/ResultPanel';
import { ICONS } from '../components/icons.jsx';
import {
  calculateEMI,
  generateAmortizationSchedule,
  formatCurrency,
  formatNumber,
} from '../utils/calculators';

const EMICalculatorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({
    principal: searchParams.get('p') || '',
    annualRate: searchParams.get('r') || '',
    years: searchParams.get('y') || '',
  });
  const [results, setResults] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [displayMode, setDisplayMode] = useState('monthly');

  useEffect(() => {
    if (form.principal && form.annualRate && form.years) {
      calculate();
    }
  }, [form]);

  const calculate = () => {
    const principal = parseFloat(form.principal);
    const annualRate = parseFloat(form.annualRate);
    const years = parseFloat(form.years);

    if (principal > 0 && annualRate > 0 && years > 0) {
      const calc = calculateEMI(principal, annualRate, years);
      setResults(calc);
      setAmortization(generateAmortizationSchedule(principal, annualRate, years, 12));

      // Update URL params
      setSearchParams({
        p: principal.toString(),
        r: annualRate.toString(),
        y: years.toString(),
      });
    } else {
      setResults(null);
      setAmortization([]);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({ principal: '', annualRate: '', years: '' });
    setResults(null);
    setAmortization([]);
    setSearchParams({});
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('emi_calculations') || '[]');
    saved.push({
      ...form,
      results,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('emi_calculations', JSON.stringify(saved.slice(-10))); // Keep last 10
    alert('Calculation saved!');
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?p=${form.principal}&r=${form.annualRate}&y=${form.years}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleExport = () => {
    if (!results) return;
    const csv = [
      ['EMI Calculator Results'],
      ['Loan Amount', formatCurrency(parseFloat(form.principal))],
      ['Interest Rate', `${form.annualRate}%`],
      ['Tenure', `${form.years} years`],
      [''],
      ['Monthly EMI', formatCurrency(results.emi)],
      ['Total Payment', formatCurrency(results.totalPayment)],
      ['Total Interest', formatCurrency(results.totalInterest)],
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emi-calculation.csv';
    a.click();
  };

  const resultItems = results
    ? [
        {
          label: 'Monthly EMI',
          value: formatCurrency(results.emi),
        },
        {
          label: 'Total Payment',
          value: formatCurrency(results.totalPayment),
        },
        {
          label: 'Total Interest',
          value: formatCurrency(results.totalInterest),
        },
        {
          label: 'Principal Amount',
          value: formatCurrency(parseFloat(form.principal) || 0),
        },
      ]
    : [];

  return (
    <div className="site-container space-y-8 py-12">
      <header className="space-y-3">
        <p className="floating-chip text-navy">EMI Calculator</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Calculate your monthly EMI
        </h1>
        <p className="text-slate">
          Estimate your Equated Monthly Installment (EMI) based on loan amount, interest rate, and
          tenure.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card">
          <div className="grid gap-6 md:grid-cols-2">
            <CalculatorInput
              label="Loan Amount"
              name="principal"
              value={form.principal}
              onChange={(e) => handleChange('principal', e.target.value)}
              placeholder="50,00,000"
              helperText="Enter the total loan amount"
              icon={ICONS.Home}
              prefix="₹"
              min="0"
              required
            />
            <CalculatorInput
              label="Annual Interest Rate"
              name="annualRate"
              value={form.annualRate}
              onChange={(e) => handleChange('annualRate', e.target.value)}
              placeholder="8.5"
              helperText="Annual interest rate in percentage"
              suffix="%"
              min="0"
              max="30"
              step="0.1"
              required
            />
            <CalculatorInput
              label="Loan Tenure"
              name="years"
              value={form.years}
              onChange={(e) => handleChange('years', e.target.value)}
              placeholder="20"
              helperText="Loan tenure in years"
              suffix="years"
              min="1"
              max="30"
              required
            />
          </div>

          <button
            onClick={calculate}
            className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            Calculate EMI
          </button>

          {amortization.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-navy">Amortization Schedule</h3>
                <div className="flex gap-2 rounded-full border border-slate/20 bg-white p-1">
                  <button
                    onClick={() => setDisplayMode('monthly')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      displayMode === 'monthly'
                        ? 'bg-navy text-white'
                        : 'text-slate hover:bg-slate/10'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setDisplayMode('yearly')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      displayMode === 'yearly'
                        ? 'bg-navy text-white'
                        : 'text-slate hover:bg-slate/10'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate/20 bg-white/60">
                <table className="w-full text-sm">
                  <thead className="bg-navy/5">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-navy">Month</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Principal</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Interest</th>
                      <th className="px-4 py-3 text-right font-semibold text-navy">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization
                      .filter((row) => {
                        if (displayMode === 'yearly') {
                          return row.month === 1 || row.month % 12 === 0 || row.isLast;
                        }
                        return true;
                      })
                      .map((row) => (
                        <tr
                          key={row.month}
                          className={`border-t border-slate/10 ${
                            row.isLast ? 'bg-gold/10 font-semibold' : ''
                          }`}
                        >
                          <td className="px-4 py-2 text-slate">{row.month}</td>
                          <td className="px-4 py-2 text-right text-navy">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-4 py-2 text-right text-slate">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="px-4 py-2 text-right text-slate">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <ResultPanel
          title="EMI Breakdown"
          results={resultItems}
          onReset={handleReset}
          onSave={results ? handleSave : undefined}
          onShare={results ? handleShare : undefined}
          onExport={results ? handleExport : undefined}
        />
      </div>
    </div>
  );
};

export default EMICalculatorPage;

