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
  data: null | {};
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

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://staginlending-fvexbmfhawe7e6ad.southafricanorth-01.azurewebsites.net/api",
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
} = baseApi;
