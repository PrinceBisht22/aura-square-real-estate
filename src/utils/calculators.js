/**
 * Calculator utility functions for Aura Square
 * All functions are pure and can be unit tested
 */

/**
 * Format currency in Indian format (₹1,23,456)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with Indian locale (1,23,456)
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * EMI Calculator
 * @param {number} principal - Loan amount (₹)
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Tenure in years
 * @returns {Object} { emi, totalPayment, totalInterest, monthlyRate, numMonths }
 */
export const calculateEMI = (principal, annualRate, years) => {
  if (!principal || !annualRate || !years || principal <= 0 || annualRate <= 0 || years <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0, monthlyRate: 0, numMonths: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  const numMonths = years * 12;

  if (monthlyRate === 0) {
    // No interest case
    const emi = principal / numMonths;
    return {
      emi: Math.round(emi),
      totalPayment: principal,
      totalInterest: 0,
      monthlyRate: 0,
      numMonths,
    };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) /
    (Math.pow(1 + monthlyRate, numMonths) - 1);

  const totalPayment = emi * numMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    monthlyRate,
    numMonths,
  };
};

/**
 * Generate amortization schedule
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Tenure in years
 * @param {number} maxRows - Maximum rows to return (default: 12)
 * @returns {Array} Array of { month, principal, interest, balance, emi }
 */
export const generateAmortizationSchedule = (principal, annualRate, years, maxRows = 12) => {
  const { emi, monthlyRate, numMonths } = calculateEMI(principal, annualRate, years);
  const schedule = [];
  let balance = principal;

  // First maxRows months
  for (let month = 1; month <= Math.min(maxRows, numMonths); month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = balance - principalPaid;

    schedule.push({
      month,
      principal: Math.round(principalPaid),
      interest: Math.round(interest),
      balance: Math.max(0, Math.round(balance)),
      emi: Math.round(emi),
    });
  }

  // Last month if different
  if (numMonths > maxRows) {
    const lastMonth = numMonths;
    const lastInterest = balance * monthlyRate;
    const lastPrincipal = balance;
    schedule.push({
      month: lastMonth,
      principal: Math.round(lastPrincipal),
      interest: Math.round(lastInterest),
      balance: 0,
      emi: Math.round(emi),
      isLast: true,
    });
  }

  return schedule;
};

/**
 * Calculate maximum loan amount from affordable EMI
 * @param {number} affordableEMI - Maximum affordable EMI (₹)
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Tenure in years
 * @returns {number} Maximum loan amount (₹)
 */
export const calculateLoanFromEMI = (affordableEMI, annualRate, years) => {
  if (!affordableEMI || !annualRate || !years || affordableEMI <= 0 || annualRate <= 0 || years <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12 / 100;
  const numMonths = years * 12;

  if (monthlyRate === 0) {
    return affordableEMI * numMonths;
  }

  const maxLoan =
    (affordableEMI * (Math.pow(1 + monthlyRate, numMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numMonths));

  return Math.round(maxLoan);
};

/**
 * Loan Eligibility Calculator
 * @param {Object} params
 * @param {number} params.monthlySalary - Monthly salary (gross or net)
 * @param {number} params.existingEMIs - Existing monthly EMIs
 * @param {number} params.emiRatio - EMI to income ratio (0.4 to 0.6, default 0.5)
 * @param {number} params.annualRate - Annual interest rate (%)
 * @param {number} params.tenureYears - Tenure in years
 * @returns {Object} { maxLoan, affordableEMI, expectedEMI }
 */
export const calculateLoanEligibility = ({
  monthlySalary,
  existingEMIs = 0,
  emiRatio = 0.5,
  annualRate,
  tenureYears,
}) => {
  if (!monthlySalary || monthlySalary <= 0) {
    return { maxLoan: 0, affordableEMI: 0, expectedEMI: 0 };
  }

  const affordableEMI = monthlySalary * emiRatio - existingEMIs;

  if (affordableEMI <= 0) {
    return { maxLoan: 0, affordableEMI: 0, expectedEMI: 0, error: 'Existing EMIs exceed safe limit' };
  }

  const maxLoan = calculateLoanFromEMI(affordableEMI, annualRate, tenureYears);
  const { emi: expectedEMI } = calculateEMI(maxLoan, annualRate, tenureYears);

  return {
    maxLoan: Math.round(maxLoan),
    affordableEMI: Math.round(affordableEMI),
    expectedEMI: Math.round(expectedEMI),
  };
};

/**
 * Budget Calculator (Affordability Plan)
 * @param {Object} params
 * @param {number} params.monthlyIncome - Monthly income
 * @param {number} params.monthlyExpenses - Monthly expenses (optional)
 * @param {number} params.emiRatio - Preferred EMI ratio (0.4 to 0.5, default 0.45)
 * @param {number} params.annualRate - Interest rate (%)
 * @param {number} params.tenureYears - Tenure in years
 * @param {number} params.downPaymentPercent - Down payment percentage (default 20)
 * @param {number} params.stampDutyPercent - Stamp duty percentage (default 5)
 * @returns {Object} { maxLoan, maxPropertyPrice, downPayment, stampDuty, totalUpfront, monthlyEMI }
 */
export const calculateAffordability = ({
  monthlyIncome,
  monthlyExpenses = 0,
  emiRatio = 0.45,
  annualRate,
  tenureYears,
  downPaymentPercent = 20,
  stampDutyPercent = 5,
}) => {
  if (!monthlyIncome || monthlyIncome <= 0) {
    return {
      maxLoan: 0,
      maxPropertyPrice: 0,
      downPayment: 0,
      stampDuty: 0,
      totalUpfront: 0,
      monthlyEMI: 0,
    };
  }

  const netDisposable = monthlyIncome - monthlyExpenses;
  const affordableEMI = Math.min(netDisposable * emiRatio, monthlyIncome * emiRatio);

  if (affordableEMI <= 0) {
    return {
      maxLoan: 0,
      maxPropertyPrice: 0,
      downPayment: 0,
      stampDuty: 0,
      totalUpfront: 0,
      monthlyEMI: 0,
      error: 'Insufficient income for EMI',
    };
  }

  const maxLoan = calculateLoanFromEMI(affordableEMI, annualRate, tenureYears);
  const dpDecimal = downPaymentPercent / 100;
  const maxPropertyPrice = maxLoan / (1 - dpDecimal);
  const downPayment = maxPropertyPrice * dpDecimal;
  const stampDuty = maxPropertyPrice * (stampDutyPercent / 100);
  const totalUpfront = downPayment + stampDuty;
  const { emi: monthlyEMI } = calculateEMI(maxLoan, annualRate, tenureYears);

  return {
    maxLoan: Math.round(maxLoan),
    maxPropertyPrice: Math.round(maxPropertyPrice),
    downPayment: Math.round(downPayment),
    stampDuty: Math.round(stampDuty),
    totalUpfront: Math.round(totalUpfront),
    monthlyEMI: Math.round(monthlyEMI),
  };
};

/**
 * Area Converter
 * Conversion constants:
 * - 1 sq ft = 0.09290304 sq m
 * - 1 sq yd = 9 sq ft
 * - 1 acre = 43,560 sq ft
 * - 1 sq m = 10.7639104 sq ft
 */
const AREA_CONVERSIONS = {
  'sq-ft': 1,
  'sq-yd': 9,
  'sq-m': 0.09290304,
  acre: 43560,
};

/**
 * Convert area from one unit to all units
 * @param {number} value - Input value
 * @param {string} fromUnit - Source unit ('sq-ft', 'sq-yd', 'sq-m', 'acre')
 * @returns {Object} Object with all unit conversions
 */
export const convertArea = (value, fromUnit = 'sq-ft') => {
  if (!value || value <= 0 || isNaN(value)) {
    return {
      'sq-ft': 0,
      'sq-yd': 0,
      'sq-m': 0,
      acre: 0,
    };
  }

  // Convert to sq ft first
  const sqFt = value * AREA_CONVERSIONS[fromUnit];

  // Convert from sq ft to all units
  return {
    'sq-ft': sqFt,
    'sq-yd': sqFt / AREA_CONVERSIONS['sq-yd'],
    'sq-m': sqFt / (1 / AREA_CONVERSIONS['sq-m']),
    acre: sqFt / AREA_CONVERSIONS.acre,
  };
};

/**
 * Format area value with unit label
 */
export const formatArea = (value, unit, showCommas = true) => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  const formatted = showCommas ? formatNumber(value) : value.toFixed(2);
  const unitLabels = {
    'sq-ft': 'sq ft',
    'sq-yd': 'sq yd',
    'sq-m': 'sq m',
    acre: 'acres',
  };
  return `${formatted} ${unitLabels[unit]}`;
};

