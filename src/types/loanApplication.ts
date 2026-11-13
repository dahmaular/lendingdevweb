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

// ----- GET loan/{id}/status — the life of the loan itself -----

/** The backend's LoanStatus, sent as `status`. */
export enum LoanStatus {
  Pending = 0,
  NotBooked = 1,
  Approved = 2,
  Rejected = 3,
  Disbursed = 4,
  Repaid = 5,
  Overdue = 6,
  Cancelled = 7,
  OfferLettered = 9,
}

export enum RepaymentStatus {
  Active = 0,
  Overdue = 1,
  Completed = 2,
}

export interface LoanStatusData {
  loanId: string;
  borrowerName: string;
  status: LoanStatus;
  /** e.g. "Disbursed" — the backend's own wording, shown as-is. */
  statusDisplay: string;

  // Terms (₦ amounts as decimals)
  /** Principal applied for. */
  amount: number;
  tenorInMonths: number;
  /** Product rate, percent. */
  interestRate: number;
  appliedInterest?: number;
  /** Deducted before payout. */
  applicableFees?: number;
  /** What actually lands in the account. */
  disbursementAmount?: number;
  monthlyRepayment?: number;
  totalRepayment?: number;

  // Repayment progress
  /** 0 until the first collection. */
  amountPaid: number;
  /** What is still scheduled to be collected. */
  amountPending: number;
  lastPaymentAt?: string;
  /** Absent until repayment starts. */
  repaymentStatus?: RepaymentStatus;
  repaymentStatusDisplay?: string;

  // Lifecycle (ISO 8601 UTC)
  appliedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  disbursementDate?: string;
  dueDate?: string;

  productId: string;
  productName: string;
  isMandateCreated: boolean;
}

export interface LoanStatusResponse {
  success: boolean;
  message: string;
  /** Only on failures. */
  code?: string;
  /** Absent on failures. */
  data?: LoanStatusData;
}
