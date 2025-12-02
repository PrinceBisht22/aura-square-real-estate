# Aura Square Calculators

This document describes the four real estate calculators available in the Aura Square platform.

## Available Calculators

1. **EMI Calculator** (`/tools/emi`)
2. **Loan Eligibility Calculator** (`/tools/loan-eligibility`)
3. **Budget Calculator** (`/tools/budget`)
4. **Area Converter** (`/tools/area-converter`)

## EMI Calculator

### Purpose
Calculate Equated Monthly Installment (EMI) for a home loan.

### Inputs
- **Loan Amount (₹)**: Total principal amount
- **Annual Interest Rate (%)**: Annual interest rate percentage
- **Tenure (years)**: Loan duration in years

### Formula
```
monthly_rate = annual_rate / 12 / 100
num_months = years * 12
EMI = (principal * monthly_rate * (1 + monthly_rate)^num_months) / ((1 + monthly_rate)^num_months - 1)
```

### Outputs
- Monthly EMI (rounded to nearest rupee)
- Total Payment (EMI × number of months)
- Total Interest (Total Payment - Principal)
- Amortization Schedule (first 12 months + last month)

### Features
- Real-time calculation as you type
- Amortization table showing principal vs interest breakdown
- Monthly/Yearly view toggle for schedule
- Save calculations to localStorage
- Share via URL with query parameters
- Export results as CSV

## Loan Eligibility Calculator

### Purpose
Estimate maximum loan amount based on salary and existing EMIs.

### Inputs
- **Monthly Salary**: Net or Gross salary (toggle)
- **Existing EMIs (₹)**: Sum of all existing loan EMIs
- **EMI Ratio**: Slider (40-60%, default 50%)
- **Interest Rate (%)**: Expected annual rate (default 8.5%)
- **Tenure (years)**: Preferred loan tenure (default 20)

### Business Logic
```
Affordable EMI = (Monthly Salary × EMI Ratio) - Existing EMIs
Max Loan = Calculate loan amount from Affordable EMI using reverse EMI formula
```

### Formula (Reverse EMI)
```
monthly_rate = annual_rate / 12 / 100
num_months = years * 12
Max Loan = (Affordable EMI × ((1 + monthly_rate)^num_months - 1)) / (monthly_rate × (1 + monthly_rate)^num_months)
```

### Outputs
- Maximum Loan Amount (₹)
- Affordable EMI (₹)
- Expected EMI for max loan (₹)

### Edge Cases
- If `Affordable EMI ≤ 0`: Shows error "Existing EMIs exceed safe limit"

## Budget Calculator

### Purpose
Calculate maximum affordable property price based on income, expenses, and loan preferences.

### Inputs
- **Monthly Income**: Net or Gross (toggle)
- **Monthly Expenses (₹)**: Optional expenses
- **EMI Ratio**: Slider (40-50%, default 45%)
- **Interest Rate (%)**: Expected rate (default 8.5%)
- **Tenure (years)**: Loan tenure (default 20)
- **Down Payment (%)**: Down payment percentage (default 20%)
- **Stamp Duty (%)**: State-specific stamp duty (default 5%)

### Formula
```
Net Disposable = Monthly Income - Monthly Expenses
Affordable EMI = min(Net Disposable × EMI Ratio, Monthly Income × EMI Ratio)
Max Loan = Calculate from Affordable EMI (using reverse EMI formula)
Max Property Price = Max Loan / (1 - Down Payment %)
Down Payment = Max Property Price × Down Payment %
Stamp Duty = Max Property Price × Stamp Duty %
Total Upfront = Down Payment + Stamp Duty
```

### Outputs
- Maximum Property Price (₹)
- Maximum Loan Amount (₹)
- Required Down Payment (₹)
- Estimated Stamp Duty (₹)
- Total Upfront Cost (₹)
- Monthly EMI Estimate (₹)
- Visual donut chart showing cost breakdown

## Area Converter

### Purpose
Convert area measurements between different units.

### Supported Units
- Square Feet (sq ft)
- Square Yard (sq yd)
- Square Meter (sq m)
- Acre

### Conversion Constants
- 1 sq ft = 0.09290304 sq m
- 1 sq yd = 9 sq ft
- 1 acre = 43,560 sq ft
- 1 sq m = 10.7639104 sq ft

### Features
- Real-time conversion as you type
- Convert from any unit to all units simultaneously
- Toggle comma formatting
- Copy all values to clipboard
- Export as CSV

## Technical Implementation

### Utility Functions
All calculator logic is in `src/utils/calculators.js`:
- `calculateEMI(principal, annualRate, years)`
- `generateAmortizationSchedule(principal, annualRate, years, maxRows)`
- `calculateLoanFromEMI(affordableEMI, annualRate, years)`
- `calculateLoanEligibility({ monthlySalary, existingEMIs, emiRatio, annualRate, tenureYears })`
- `calculateAffordability({ monthlyIncome, monthlyExpenses, emiRatio, annualRate, tenureYears, downPaymentPercent, stampDutyPercent })`
- `convertArea(value, fromUnit)`

### Components
- `CalculatorInput`: Reusable input component with validation
- `ResultPanel`: Sidebar panel for displaying results
- `CalculatorCard`: Card component for tools index page

### Data Persistence
- Calculations saved to `localStorage` (last 10 per calculator)
- URL query parameters for sharing
- CSV export functionality

### Testing
Unit tests available in `src/utils/calculators.test.js` (Vitest)

## Accessibility
- All inputs have proper labels and ARIA attributes
- Results use `role="status"` for screen readers
- Keyboard navigation supported
- Minimum 44px touch targets on mobile

## Currency Formatting
All currency values use Indian format (₹1,23,456) via `Intl.NumberFormat('en-IN')`.

