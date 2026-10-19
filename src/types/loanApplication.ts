export interface LoanApplication {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  purpose: string;
  employmentStatus: "employed" | "self-employed" | "unemployed";
  monthlyIncome: number;
  loanTerm: number; // in months
}

export type LoanApplicationStatus = "pending" | "approved" | "rejected";

export interface OnboardingRequest {
  // employer: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  productId: string;
}

export interface VerifyOtpRequest {
  loanId: string;
  otp: string;
}
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    loanId: string;
  };
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data: {
    loanId: string;
  };
}

export interface SalaryHistoryReviewRequest {
  bankCode: string;
  accountNo: string;
  bvn?: string;
  nin?: string;
  loanId: string;
  identityType: string;
}

export interface SavePersonalDetailsRequest {
  address: string;
  idNumber: string;
  imageIds: string[];
  loanId: string;
  bvn?: string;
}

export interface SubmitLoan {
  loanId: string;
  loanAmount: number;
  tenor: number;
  acceptOfferLetter: boolean;
  monoCustomerId: string;
}

export interface SubmitLoanResponse {
  success: boolean;
  message: string;
  data: {
    loanId: string;
    monthlyRepaymentAmount: number;
    repaymentAmount: number;
    tenor: number;
    monoUrl: string;
  };
}

/**
 * The backend's BorrowerOnboardingStep, sent as `currentStep`. Each value is
 * the last thing the borrower finished, not the screen to show next — see
 * DevPayAPI docs/borrower-onboarding-current-step.md.
 */
export enum OnboardingStep {
  EmailSent = 1,
  EmailValidated = 2,
  BvnSent = 3,
  BvnValidated = 4,
  DocumentsUploaded = 5,
  /** 6 and 7 mean step4 saved the loan but the mandate call failed. */
  LoanSubmitted = 6,
  MandateGenerated = 7,
  /** Remita only; this app runs on Mono, so it should never be seen. */
  MandateActivationPending = 8,
  MandateActivated = 9,
}
