import React from 'react';

const CalculatorInput = ({
  label,
  name,
  type = 'number',
  value,
  onChange,
  placeholder,
  helperText,
  error,
  icon: Icon,
  min,
  max,
  step,
  required = false,
  suffix,
  prefix,
}) => {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gold">
            <Icon className="h-5 w-5" />
          </div>
        )}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className={`w-full rounded-2xl border px-4 py-3 text-base font-medium text-navy transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20 ${
            Icon || prefix ? 'pl-10' : ''
          } ${suffix ? 'pr-20' : ''} ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate/20'
          }`}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate">
            {suffix}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-xs text-slate">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </label>
  );
};

export default CalculatorInput;

