/**
 * The borrower's loan limits. The backend sends them from step 3 (personal
 * details) onwards and again from current-step when an application is
 * resumed; the loan screen reads them back from here.
 */
export interface Eligibility {
  maxLoanEligible?: number;
  minLoanEligible?: number;
  maxTenor?: number;
  minTenor?: number;
}

const KEYS = [
  "maxLoanEligible",
  "minLoanEligible",
  "maxTenor",
  "minTenor",
] as const;

/**
 * Store the limits, clearing any a field leaves out so values from an
 * earlier application in the same browser don't linger.
 */
export const saveEligibility = (limits: Eligibility): void => {
  KEYS.forEach((key) => {
    const value = limits[key];
    if (value === undefined || value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  });
};

export const readEligibility = (): Eligibility => {
  const limits: Eligibility = {};
  KEYS.forEach((key) => {
    const value = parseFloat(localStorage.getItem(key) ?? "");
    if (!Number.isNaN(value)) limits[key] = value;
  });
  return limits;
};
