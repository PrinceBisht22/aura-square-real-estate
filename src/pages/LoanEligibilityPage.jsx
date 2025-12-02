import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CalculatorInput from '../components/calculators/CalculatorInput';
import ResultPanel from '../components/calculators/ResultPanel';
import { ICONS } from '../components/icons.jsx';
import { calculateLoanEligibility, formatCurrency } from '../utils/calculators';

const LoanEligibilityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState({
    monthlySalary: searchParams.get('salary') || '',
    existingEMIs: searchParams.get('emis') || '0',
    emiRatio: parseFloat(searchParams.get('ratio')) || 0.5,
    annualRate: searchParams.get('rate') || '8.5',
    tenureYears: searchParams.get('tenure') || '20',
  });
  const [results, setResults] = useState(null);
  const [salaryType, setSalaryType] = useState('net');

  useEffect(() => {
    if (form.monthlySalary && form.annualRate && form.tenureYears) {
      calculate();
    }
  }, [form]);

  const calculate = () => {
    const monthlySalary = parseFloat(form.monthlySalary);
    const existingEMIs = parseFloat(form.existingEMIs) || 0;
    const annualRate = parseFloat(form.annualRate);
    const tenureYears = parseFloat(form.tenureYears);

    if (monthlySalary > 0 && annualRate > 0 && tenureYears > 0) {
      const calc = calculateLoanEligibility({
        monthlySalary,
        existingEMIs,
        emiRatio: form.emiRatio,
        annualRate,
        tenureYears,
      });
      setResults(calc);

      setSearchParams({
        salary: monthlySalary.toString(),
        emis: existingEMIs.toString(),
        ratio: form.emiRatio.toString(),
        rate: annualRate.toString(),
        tenure: tenureYears.toString(),
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
      monthlySalary: '',
      existingEMIs: '0',
      emiRatio: 0.5,
      annualRate: '8.5',
      tenureYears: '20',
    });
    setResults(null);
    setSearchParams({});
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('eligibility_calculations') || '[]');
    saved.push({
      ...form,
      results,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('eligibility_calculations', JSON.stringify(saved.slice(-10)));
    alert('Calculation saved!');
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?salary=${form.monthlySalary}&emis=${form.existingEMIs}&ratio=${form.emiRatio}&rate=${form.annualRate}&tenure=${form.tenureYears}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleExport = () => {
    if (!results) return;
    const csv = [
      ['Loan Eligibility Calculator Results'],
      ['Monthly Salary', formatCurrency(parseFloat(form.monthlySalary))],
      ['Existing EMIs', formatCurrency(parseFloat(form.existingEMIs))],
      ['EMI Ratio', `${(form.emiRatio * 100).toFixed(0)}%`],
      ['Interest Rate', `${form.annualRate}%`],
      ['Tenure', `${form.tenureYears} years`],
      [''],
      ['Max Loan Amount', formatCurrency(results.maxLoan)],
      ['Affordable EMI', formatCurrency(results.affordableEMI)],
      ['Expected EMI', formatCurrency(results.expectedEMI)],
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-eligibility.csv';
    a.click();
  };

  const resultItems = results
    ? [
        {
          label: 'Maximum Loan Amount',
          value: formatCurrency(results.maxLoan),
        },
        {
          label: 'Affordable EMI',
          value: formatCurrency(results.affordableEMI),
        },
        {
          label: 'Expected EMI',
          value: formatCurrency(results.expectedEMI),
        },
      ]
    : [];

  return (
    <div className="site-container space-y-8 py-12">
      <header className="space-y-3">
        <p className="floating-chip text-navy">Loan Eligibility Calculator</p>
        <h1 className="text-4xl font-display font-semibold text-navy">
          Check your loan eligibility
        </h1>
        <p className="text-slate">
          Estimate how much loan you can get based on your salary, existing EMIs, and preferred
          tenure.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card">
          <div className="space-y-4">
            <div className="flex gap-2 rounded-full border border-slate/20 bg-white p-1">
              <button
                onClick={() => setSalaryType('net')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  salaryType === 'net'
                    ? 'bg-navy text-white'
                    : 'text-slate hover:bg-slate/10'
                }`}
              >
                Net Salary
              </button>
              <button
                onClick={() => setSalaryType('gross')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  salaryType === 'gross'
                    ? 'bg-navy text-white'
                    : 'text-slate hover:bg-slate/10'
                }`}
              >
                Gross Salary
              </button>
            </div>

            <CalculatorInput
              label={`Monthly ${salaryType === 'net' ? 'Net' : 'Gross'} Salary`}
              name="monthlySalary"
              value={form.monthlySalary}
              onChange={(e) => handleChange('monthlySalary', e.target.value)}
              placeholder="1,00,000"
              helperText={`Enter your monthly ${salaryType === 'net' ? 'take-home' : 'gross'} salary`}
              icon={ICONS.TrendingUp}
              prefix="₹"
              min="0"
              required
            />
          </div>

          <CalculatorInput
            label="Existing Monthly EMIs"
            name="existingEMIs"
            value={form.existingEMIs}
            onChange={(e) => handleChange('existingEMIs', e.target.value)}
            placeholder="0"
            helperText="Sum of all existing loan EMIs"
            prefix="₹"
            min="0"
          />

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate">
              EMI to Income Ratio: {(form.emiRatio * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.4"
              max="0.6"
              step="0.05"
              value={form.emiRatio}
              onChange={(e) => handleChange('emiRatio', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate">
              <span>40%</span>
              <span>50%</span>
              <span>60%</span>
            </div>
            <p className="text-xs text-slate">
              Conservative lenders typically allow 40-50% of net income for EMIs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CalculatorInput
              label="Interest Rate"
              name="annualRate"
              value={form.annualRate}
              onChange={(e) => handleChange('annualRate', e.target.value)}
              placeholder="8.5"
              helperText="Expected annual interest rate"
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
              helperText="Preferred loan tenure"
              suffix="years"
              min="5"
              max="30"
              required
            />
          </div>

          <button
            onClick={calculate}
            className="w-full rounded-2xl bg-gradient-to-r from-navy to-indigo px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            Check Eligibility
          </button>

          {results?.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {results.error}
            </div>
          )}
        </div>

        <ResultPanel
          title="Eligibility Results"
          results={resultItems}
          onReset={handleReset}
          onSave={results && !results.error ? handleSave : undefined}
          onShare={results && !results.error ? handleShare : undefined}
          onExport={results && !results.error ? handleExport : undefined}
        />
      </div>
    </div>
  );
};

export default LoanEligibilityPage;

