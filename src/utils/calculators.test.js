/**
 * Unit tests for calculator utility functions
 * Run with: npm test calculators.test.js
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEMI,
  calculateLoanFromEMI,
  calculateLoanEligibility,
  calculateAffordability,
  convertArea,
} from './calculators';

describe('calculateEMI', () => {
  it('should calculate EMI correctly for standard inputs', () => {
    const result = calculateEMI(5000000, 8.5, 20);
    expect(result.emi).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(5000000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.numMonths).toBe(240);
  });

  it('should return zero for invalid inputs', () => {
    const result = calculateEMI(0, 8.5, 20);
    expect(result.emi).toBe(0);
    expect(result.totalPayment).toBe(0);
  });

  it('should handle zero interest rate', () => {
    const result = calculateEMI(1000000, 0, 10);
    expect(result.emi).toBe(8333); // 1000000 / 120 months
    expect(result.totalInterest).toBe(0);
  });
});

describe('calculateLoanFromEMI', () => {
  it('should calculate max loan from affordable EMI', () => {
    const emi = 50000;
    const rate = 8.5;
    const years = 20;
    const maxLoan = calculateLoanFromEMI(emi, rate, years);
    expect(maxLoan).toBeGreaterThan(0);
    expect(maxLoan).toBeLessThan(emi * 12 * years); // Should be less than total payments
  });

  it('should return zero for invalid inputs', () => {
    expect(calculateLoanFromEMI(0, 8.5, 20)).toBe(0);
    expect(calculateLoanFromEMI(50000, 0, 20)).toBe(0);
  });
});

describe('calculateLoanEligibility', () => {
  it('should calculate eligibility correctly', () => {
    const result = calculateLoanEligibility({
      monthlySalary: 100000,
      existingEMIs: 20000,
      emiRatio: 0.5,
      annualRate: 8.5,
      tenureYears: 20,
    });
    expect(result.maxLoan).toBeGreaterThan(0);
    expect(result.affordableEMI).toBe(30000); // 100000 * 0.5 - 20000
    expect(result.expectedEMI).toBeGreaterThan(0);
  });

  it('should return error when existing EMIs exceed limit', () => {
    const result = calculateLoanEligibility({
      monthlySalary: 100000,
      existingEMIs: 60000,
      emiRatio: 0.5,
      annualRate: 8.5,
      tenureYears: 20,
    });
    expect(result.error).toBeDefined();
    expect(result.maxLoan).toBe(0);
  });
});

describe('calculateAffordability', () => {
  it('should calculate affordability plan correctly', () => {
    const result = calculateAffordability({
      monthlyIncome: 150000,
      monthlyExpenses: 50000,
      emiRatio: 0.45,
      annualRate: 8.5,
      tenureYears: 20,
      downPaymentPercent: 20,
      stampDutyPercent: 5,
    });
    expect(result.maxPropertyPrice).toBeGreaterThan(0);
    expect(result.maxLoan).toBeGreaterThan(0);
    expect(result.downPayment).toBeGreaterThan(0);
    expect(result.stampDuty).toBeGreaterThan(0);
    expect(result.totalUpfront).toBe(result.downPayment + result.stampDuty);
  });

  it('should return zero for invalid inputs', () => {
    const result = calculateAffordability({
      monthlyIncome: 0,
      annualRate: 8.5,
      tenureYears: 20,
    });
    expect(result.maxPropertyPrice).toBe(0);
  });
});

describe('convertArea', () => {
  it('should convert sq ft to all units correctly', () => {
    const result = convertArea(1000, 'sq-ft');
    expect(result['sq-ft']).toBe(1000);
    expect(result['sq-yd']).toBeCloseTo(111.11, 1);
    expect(result['sq-m']).toBeCloseTo(92.9, 1);
    expect(result.acre).toBeCloseTo(0.023, 3);
  });

  it('should convert sq yd to all units correctly', () => {
    const result = convertArea(100, 'sq-yd');
    expect(result['sq-ft']).toBe(900);
    expect(result['sq-yd']).toBe(100);
  });

  it('should return zeros for invalid input', () => {
    const result = convertArea(0, 'sq-ft');
    expect(result['sq-ft']).toBe(0);
    expect(result['sq-yd']).toBe(0);
  });
});

