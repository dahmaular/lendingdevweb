/**
 * Loan pricing, in one place.
 *
 * These were magic numbers inside loanApplication.tsx. They moved here when the
 * landing page started quoting them: a public page advertising a rate that has
 * drifted from the rate the application actually charges is the kind of bug
 * nobody notices until a customer does.
 *
 * Anything user-facing that states a rate, a fee, a term or a minimum should
 * read it from here rather than writing the number out.
 */

/** Interest, charged per month on the principal, not reducing balance. */
export const INTEREST_RATE_MONTHLY = 0.05;

/** One-off processing fee, taken as a share of the principal. */
export const PROCESSING_FEE_RATE = 0.01;

/** The slider floor, and what the amount validator rejects below. */
export const MIN_LOAN_AMOUNT = 5000;

/** Selectable terms, in months. */
export const LOAN_DURATIONS = [
  { value: 1, label: "1 Month" },
  { value: 2, label: "2 Months" },
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

export interface LoanQuote {
  principal: number;
  totalInterest: number;
  processingFee: number;
  totalRepayment: number;
  monthlyPayment: number;
}

/** The whole cost of a loan. The one place this arithmetic is written down. */
export const quote = (principal: number, months: number): LoanQuote => {
  const totalInterest = principal * INTEREST_RATE_MONTHLY * months;
  const processingFee = principal * PROCESSING_FEE_RATE;
  const totalRepayment = principal + totalInterest + processingFee;

  return {
    principal,
    totalInterest,
    processingFee,
    totalRepayment,
    monthlyPayment: months > 0 ? totalRepayment / months : 0,
  };
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");

/** Rendered as "5%" — the rate as a percentage, without inventing precision. */
export const monthlyRatePercent = `${INTEREST_RATE_MONTHLY * 100}%`;
export const processingFeePercent = `${PROCESSING_FEE_RATE * 100}%`;
