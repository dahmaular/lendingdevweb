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
  };
}
