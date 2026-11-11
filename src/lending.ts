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

/** Default tenor bounds, used when the backend doesn't send a range. */
export const MIN_TENOR_MONTHS = 3;
export const MAX_TENOR_MONTHS = 18;

/** Selectable terms: every month from MIN_TENOR_MONTHS to MAX_TENOR_MONTHS. */
export const LOAN_DURATIONS: number[] = Array.from(
  { length: MAX_TENOR_MONTHS - MIN_TENOR_MONTHS + 1 },
  (_, i) => MIN_TENOR_MONTHS + i,
);

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
