import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  LoanApplication,
  OnboardingRequest,
  OnboardingResponse,
  SalaryHistoryReviewRequest,
  SavePersonalDetailsRequest,
  SubmitLoan,
  SubmitLoanResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../../types/loanApplication";

interface LoanApplicationResponse {
  applicationId: string;
  status: "pending" | "approved" | "rejected";
  message: string;
}

export interface SalaryHistoryReviewResponse {
  success: boolean;
  message: string;
  data: null | {};
}

export interface SavePersonalDetailsResponse {
  success: boolean;
  message: string;
  data: null | {
    maxLoanEligible?: number;
  };
}
export interface LoanBreakdownRequest {
  amount: number;
  durationInMonths: number;
}
export interface LoanBreakdownResponse {
  success: boolean;
  message: string;
  data: {
    loanAmount: number;
    interestRate: number;
    repaymentPeriod: number;
    monthlyRepayment: number;
    totalRepayment: number;
    totalInterest: number;
  };
}

// Current Status Response for resuming application
export interface CurrentStatusData {
  loanId: string;
  email: string;
  firstName: string;
  lastName: string;
  currentStep: number;
  currentStepName: string;
  currentStepDescription: string;
  nextStepName: string;
  nextStepDescription: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt?: string;
  bvnVerifiedAt?: string;
  bankVerifiedAt?: string;
  personalDetailsAt?: string;
  loanSubmittedAt?: string;
  stepNumber: number;
  totalSteps: number;
  progressPercentage: number;
  companyName: string;
  productName: string;
  requiredActions: string[];
}

export interface CurrentStatusResponse {
  success: boolean;
  message: string;
  data: CurrentStatusData | null;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
    // "http://localhost:5275/api/v1",
      "https://staginlending-fvexbmfhawe7e6ad.southafricanorth-01.azurewebsites.net/api/v1",
    prepareHeaders: (headers) => {
      // Add any required headers here
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    submitLoanApplication: builder.mutation<
      LoanApplicationResponse,
      LoanApplication
    >({
      query: (data) => ({
        url: "/loan-applications",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        if ("status" in response) {
          if (response.status === 429) {
            return "Too many requests. Please try again later.";
          }
          if (response.status === 400) {
            return "Invalid application data. Please check your inputs.";
          }
        }
        return "An error occurred while submitting your application. Please try again.";
      },
    }),
    onboarding1: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: (data) => ({
        url: "/Borrower/step1",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/Borrower/step1b",
        method: "POST",
        body: data,
      }),
    }),
    salaryReview: builder.mutation<
      SalaryHistoryReviewResponse,
      SalaryHistoryReviewRequest
    >({
      query: (data) => ({
        url: "/Borrower/step2",
        method: "POST",
        body: data,
      }),
    }),
    salaryReviewOTP: builder.mutation<
      SalaryHistoryReviewResponse,
      VerifyOtpRequest
    >({
      query: (data) => ({
        url: "/Borrower/step2b",
        method: "POST",
        body: data,
      }),
    }),
    resentBVNOtp: builder.mutation<VerifyOtpResponse, { bvn: string }>({
      query: (data) => ({
        url: "/Borrower/generate-bvn-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendEmailOtp: builder.mutation<VerifyOtpResponse, { loanId: string }>({
      query: (data) => ({
        url: "/Borrower/resend-step1-email-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyResendEmailOtp: builder.mutation<
      VerifyOtpResponse,
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: "/Borrower/validate-email-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyResendBVNOtp: builder.mutation<
      VerifyOtpResponse,
      { bvn: string; otp: string }
    >({
      query: (data) => ({
        url: "/Borrower/validate-bvn-otp",
        method: "POST",
        body: data,
      }),
    }),
    savePersonalDetails: builder.mutation<
      SavePersonalDetailsResponse,
      SavePersonalDetailsRequest
    >({
      query: (data) => ({
        url: "/Borrower/step3",
        method: "POST",
        body: data,
      }),
    }),
    uploadID: builder.mutation<
      {
        data: {
          documentId: string;
          url: string;
          id: string;
          documentName: string;
          uploadedAt: string;
        };
      },
      {
        documentName: string;
        base64String: string;
        fileExtension: string;
      }
    >({
      query: (body) => {
        return {
          url: "/Document/upload",
          method: "POST",
          body,
        };
      },
    }),
    loanBreakdown: builder.mutation<
      LoanApplicationResponse,
      LoanBreakdownRequest
    >({
      query: (data) => ({
        url: "/Loan/breakdown",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: FetchBaseQueryError) => {
        if ("status" in response) {
          if (response.status === 400) {
            return "Invalid OTP. Please check your input.";
          }
        }
        return "An error occurred while verifying the OTP. Please try again.";
      },
    }),
    submitLoan: builder.mutation<SubmitLoanResponse, SubmitLoan>({
      query: (data) => ({
        url: "/Borrower/step4",
        method: "POST",
        body: data,
      }),
    }),
    // Get current application status for resuming
    getCurrentStatus: builder.mutation<
      CurrentStatusResponse,
      { email: string }
    >({
      query: (body) => ({
        url: "/Borrower/current-step",
        method: "POST",
        body,
      }),
    }),
    getBanks: builder.query<{ code: string; name: string }[], void>({
      query: () => ({ url: "/Mono/banks", method: "GET" }),
      transformResponse: (response: unknown) => {
        const r = response as Record<string, unknown>;
        const inner = r?.data as Record<string, unknown> | undefined;
        const list = inner?.data;
        if (!Array.isArray(list)) return [];
        return list.map((b: { bank_code: string; name: string }) => ({
          code: b.bank_code,
          name: b.name,
        }));
      },
    }),
    // Upload signed offer letter
    uploadSignedOfferLetter: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          documentId: string;
          url: string;
        } | null;
      },
      {
        loanId: string;
        signedOfferLetterDocumentId: string;
      }
    >({
      query: ({ loanId, ...body }) => ({
        url: `/Borrower/${loanId}/upload-signed-offer-letter`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useOnboarding1Mutation,
  useVerifyOtpMutation,
  useSubmitLoanApplicationMutation,
  useSalaryReviewMutation,
  useSavePersonalDetailsMutation,
  useLoanBreakdownMutation,
  useSubmitLoanMutation,
  useSalaryReviewOTPMutation,
  useResentBVNOtpMutation,
  useVerifyResendBVNOtpMutation,
  useResendEmailOtpMutation,
  useVerifyResendEmailOtpMutation,
  useGetCurrentStatusMutation,
  useUploadIDMutation,
  useUploadSignedOfferLetterMutation,
  useGetBanksQuery,
} = baseApi;