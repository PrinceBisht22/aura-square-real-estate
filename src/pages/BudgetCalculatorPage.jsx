import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalculatorInput from '../components/calculators/CalculatorInput';
import ResultPanel from '../components/calculators/ResultPanel';
import { ICONS } from '../components/icons.jsx';
import { calculateAffordability, formatCurrency } from '../utils/calculators';

const BudgetCalculatorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({
    monthlyIncome: searchParams.get('income') || '',
    monthlyExpenses: searchParams.get('expenses') || '0',
    emiRatio: parseFloat(searchParams.get('ratio')) || 0.45,
    annualRate: searchParams.get('rate') || '8.5',
    tenureYears: searchParams.get('tenure') || '20',
    downPaymentPercent: parseFloat(searchParams.get('dp')) || 20,
    stampDutyPercent: parseFloat(searchParams.get('stamp')) || 5,
  });
  const [results, setResults] = useState(null);
  const [incomeType, setIncomeType] = useState('net');

  useEffect(() => {
    if (form.monthlyIncome && form.annualRate && form.tenureYears) {
      calculate();
    }
  }, [form]);

  const calculate = () => {
    const monthlyIncome = parseFloat(form.monthlyIncome);
    const monthlyExpenses = parseFloat(form.monthlyExpenses) || 0;
    const annualRate = parseFloat(form.annualRate);
    const tenureYears = parseFloat(form.tenureYears);

    if (monthlyIncome > 0 && annualRate > 0 && tenureYears > 0) {
      const calc = calculateAffordability({
        monthlyIncome,
        monthlyExpenses,
        emiRatio: form.emiRatio,
        annualRate,
        tenureYears,
        downPaymentPercent: form.downPaymentPercent,
        stampDutyPercent: form.stampDutyPercent,
      });
      setResults(calc);

      setSearchParams({
        income: monthlyIncome.toString(),
        expenses: monthlyExpenses.toString(),
        ratio: form.emiRatio.toString(),
        rate: annualRate.toString(),
        tenure: tenureYears.toString(),
        dp: form.downPaymentPercent.toString(),
        stamp: form.stampDutyPercent.toString(),
      });
    } else {
      setResults(null);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({
      monthlyIncome: '',
      monthlyExpenses: '0',
      emiRatio: 0.45,
      annualRate: '8.5',
      tenureYears: '20',
      downPaymentPercent: 20,
      stampDutyPercent: 5,
    });
    setResults(null);
    setSearchParams({});
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('budget_calculations') || '[]');
    saved.push({
      ...form,
      results,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('budget_calculations', JSON.stringify(saved.slice(-10)));
    alert('Budget plan saved!');
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      income: form.monthlyIncome,
      expenses: form.monthlyExpenses,
      ratio: form.emiRatio.toString(),
      rate: form.annualRate,
      tenure: form.tenureYears,
      dp: form.downPaymentPercent.toString(),
      stamp: form.stampDutyPercent.toString(),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleExport = () => {
    if (!results) return;
    const csv = [
      ['Budget Calculator Results'],
      ['Monthly Income', formatCurrency(parseFloat(form.monthlyIncome))],
      ['Monthly Expenses', formatCurrency(parseFloat(form.monthlyExpenses))],
      ['EMI Ratio', `${(form.emiRatio * 100).toFixed(0)}%`],
      ['Interest Rate', `${form.annualRate}%`],
      ['Tenure', `${form.tenureYears} years`],
      ['Down Payment', `${form.downPaymentPercent}%`],
      ['Stamp Duty', `${form.stampDutyPercent}%`],
      [''],
      ['Max Property Price', formatCurrency(results.maxPropertyPrice)],
      ['Max Loan Amount', formatCurrency(results.maxLoan)],
      ['Down Payment', formatCurrency(results.downPayment)],
      ['Stamp Duty', formatCurrency(results.stampDuty)],
      ['Total Upfront Cost', formatCurrency(results.totalUpfront)],
      ['Monthly EMI', formatCurrency(results.monthlyEMI)],
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-plan.csv';
    a.click();
  };

  const resultItems = results
    ? [
        {
          label: 'Max Property Price',
          value: formatCurrency(results.maxPropertyPrice),
        },
        {
          label: 'Max Loan Amount',
          value: formatCurrency(results.maxLoan),
        },
        {
          label: 'Down Payment',
          value: formatCurrency(results.downPayment),
        },
        {
          label: 'Stamp Duty',
          value: formatCurrency(results.stampDuty),
        },
        {
          label: 'Total Upfront',
          value: formatCurrency(results.totalUpfront),
        },
        {
          label: 'Monthly EMI',
          value: formatCurrency(results.monthlyEMI),
        },
      ]
    : [];

  // Simple donut chart visualization
  const DonutChart = ({ results }) => {
    if (!results || results.maxPropertyPrice === 0) return null;

    const loanPercent = (results.maxLoan / results.maxPropertyPrice) * 100;
    const dpPercent = (results.downPayment / results.maxPropertyPrice) * 100;
    const stampPercent = (results.stampDuty / results.maxPropertyPrice) * 100;

    return (
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-semibold text-navy">Cost Breakdown</h4>
        <div className="flex items-center justify-center">
          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="16"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#1c3faa"
                strokeWidth="16"
                strokeDasharray={`${(loanPercent / 100) * 352} 352`}
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#f4b400"
                strokeWidth="16"
                strokeDasharray={`${(dpPercent / 100) * 352} 352`}
                strokeDashoffset={`-${(loanPercent / 100) * 352}`}
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="#53b8a5"
                strokeWidth="16"
                strokeDasharray={`${(stampPercent / 100) * 352} 352`}
                strokeDashoffset={`-${((loanPercent + dpPercent) / 100) * 352}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-slate">Total</p>
                <p className="text-sm font-semibold text-navy">
                  {formatCurrency(results.maxPropertyPrice).replace('₹', '₹')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-navy"></div>
            <span className="text-slate">Loan: {loanPercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gold"></div>
            <span className="text-slate">Down Payment: {dpPercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-teal"></div>
            <span className="text-slate">Stamp Duty: {stampPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="site-container space-y-8 py-12">
      <header className="space-y-3">
        <p className="floating-chip text-navy">Budget Calculator</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Plan your property budget
        </h1>
        <p className="text-slate">
          Calculate how much property you can afford based on your income, expenses, and loan
          preferences.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card">
          <div className="space-y-4">
            <div className="flex gap-2 rounded-full border border-slate/20 bg-white p-1">
              <button
                onClick={() => setIncomeType('net')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  incomeType === 'net'
                    ? 'bg-navy text-white'
                    : 'text-slate hover:bg-slate/10'
                }`}
              >
                Net Income
              </button>
              <button
                onClick={() => setIncomeType('gross')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  incomeType === 'gross'
                    ? 'bg-navy text-white'
                    : 'text-slate hover:bg-slate/10'
                }`}
              >
                Gross Income
              </button>
            </div>

            <CalculatorInput
              label={`Monthly ${incomeType === 'net' ? 'Net' : 'Gross'} Income`}
              name="monthlyIncome"
              value={form.monthlyIncome}
              onChange={(e) => handleChange('monthlyIncome', e.target.value)}
              placeholder="1,00,000"
              helperText={`Enter your monthly ${incomeType === 'net' ? 'take-home' : 'gross'} income`}
              icon={ICONS.TrendingUp}
              prefix="₹"
              min="0"
              required
            />
          </div>

          <CalculatorInput
            label="Monthly Expenses (Optional)"
            name="monthlyExpenses"
            value={form.monthlyExpenses}
            onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
            placeholder="30,000"
            helperText="Your monthly expenses (rent, groceries, etc.)"
            prefix="₹"
            min="0"
          />

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate">
              Preferred EMI Ratio: {(form.emiRatio * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.4"
              max="0.5"
              step="0.01"
              value={form.emiRatio}
              onChange={(e) => handleChange('emiRatio', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate">
              <span>40%</span>
              <span>45%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CalculatorInput
              label="Interest Rate"
              name="annualRate"
              value={form.annualRate}
              onChange={(e) => handleChange('annualRate', e.target.value)}
              placeholder="8.5"
              suffix="%"
              min="0"
              max="20"
              step="0.1"
              required
            />
            <CalculatorInput
              label="Loan Tenure"
              name="tenureYears"
              value={form.tenureYears}
              onChange={(e) => handleChange('tenureYears', e.target.value)}
              placeholder="20"
              suffix="years"
              min="5"
              max="30"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CalculatorInput
              label="Down Payment"
              name="downPaymentPercent"
              value={form.downPaymentPercent}
              onChange={(e) => handleChange('downPaymentPercent', parseFloat(e.target.value))}
              placeholder="20"
              suffix="%"
              min="10"
              max="50"
              step="5"
              required
            />
            <CalculatorInput
              label="Stamp Duty"
              name="stampDutyPercent"
              value={form.stampDutyPercent}
              onChange={(e) => handleChange('stampDutyPercent', parseFloat(e.target.value))}
              placeholder="5"
              suffix="%"
              min="0"
              max="10"
              step="0.5"
              helperText="Varies by state (default 5%)"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            Calculate Budget
          </button>

          {results?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {results.error}
            </div>
          )}
        </div>

        <ResultPanel
          title="Budget Plan"
          results={resultItems}
          onReset={handleReset}
          onSave={results && !results.error ? handleSave : undefined}
          onShare={results && !results.error ? handleShare : undefined}
          onExport={results && !results.error ? handleExport : undefined}
        >
          {results && !results.error && <DonutChart results={results} />}
        </ResultPanel>
      </div>
    </div>
  );
};

export default BudgetCalculatorPage;

