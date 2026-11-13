import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoanStatus from "./loanStatus";

// react-router-dom v7 ships ESM-first and does not resolve under CRA's jest
// config. The page only needs useNavigate, so it is mocked virtually rather
// than dragging the router into a test about rendering.
jest.mock(
  "react-router-dom",
  () => ({ useNavigate: () => jest.fn() }),
  { virtual: true }
);

// RTK Query's dist doesn't parse under CRA's jest either, and these tests are
// about the form, not the wire — so the two mutations are stubbed.
const mockRequestOtp = jest.fn();
jest.mock("../store/services/baseApi", () => ({
  useRequestResumeOtpMutation: () => [mockRequestOtp, { isLoading: false }],
  useGetCurrentStatusMutation: () => [jest.fn(), { isLoading: false }],
  useLazyGetLoanStatusQuery: () => [
    jest.fn(),
    { data: undefined, isFetching: false },
  ],
}));

// jsdom has no matchMedia, which the page shell's media-query hook needs.
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe("loan status page", () => {
  it("opens on the email form", () => {
    render(<LoanStatus />);
    expect(screen.getByText("Check on your loan")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Email me a code")).toBeInTheDocument();
  });

  it("rejects an invalid email without calling the backend", () => {
    render(<LoanStatus />);
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByText("Email me a code"));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(mockRequestOtp).not.toHaveBeenCalled();
  });
});
