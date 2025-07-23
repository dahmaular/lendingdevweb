import React, { useState } from "react";
import "../pages/login.css";
import peopleBg from "../assets/people.svg";
import ProgressBar from "./ProgressBar";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  useResentBVNOtpMutation,
  useSalaryReviewMutation,
  useSalaryReviewOTPMutation,
  useVerifyResendBVNOtpMutation,
} from "../store/services/baseApi";
import Spinner from "./Spinner";
import Modal from "./Modal";

interface StatementReviewProps {
  onNext: () => void;
  onBack: () => void;
}

// Nigerian banks list
const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "050", name: "Ecobank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank" },
  { code: "214", name: "FCMB" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "221", name: "Stanbic IBTC" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank" },
  { code: "033", name: "United Bank for Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

export const StatementReview: React.FC<StatementReviewProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [salaryReview, { isLoading, isError, error }] =
    useSalaryReviewMutation();
  const [salaryReviewOTP, { isLoading: verifyLoading }] =
    useSalaryReviewOTPMutation();
  const [resentBVNOtp, { isLoading: resendLoading }] =
    useResentBVNOtpMutation();
  const [verifyResendBVNOtp, { isLoading: verifyResendLoading }] =
    useVerifyResendBVNOtpMutation();

  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });
  // const [resendLoading, setResendLoading] = useState<boolean>(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setAccountNumber(value);
    }
  };

  const handleOtpView = async () => {
    setTimeout(() => {
      setIsOTP(true);
      // setLoadingState(false);
    }, 1000);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    const loanId = localStorage.getItem("loanId");
    e.preventDefault();
    if (otpVerified) {
      handleVerifyResendOTP();
      return;
    }
    // onLogin(email, bvn, dob.toDateString());
    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 4-digit OTP.",
        title: "Invalid OTP",
      });
      return;
    }
    if (verifyLoading) {
      setModal({
        open: true,
        message: "Processing, please wait...",
        title: "Please Wait",
      });
      return;
    }
    console.log("Loan ID:", {
      loanId: loanId || "",
      otp: otp,
    });
    const response = await salaryReviewOTP({
      loanId: loanId || "",
      otp: otp,
    });

    console.log("Verify OTP Response:", response);
    if (response.data?.success) {
      // OTP verification successful
      setOtpVerified(true);
      setModal({
        open: true,
        message: "OTP verified successfully.",
        title: "Success",
      });
    } else {
      // OTP verification failed
      setResendOTP(true);
      setOtp("");
      setModal({
        open: true,
        message: response.data?.message || "OTP verification failed.",
        title: "Error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onNext();
    console.log("Bank:", selectedBank);
    console.log("Account Number:", accountNumber);
    console.log("Phone Number:", phoneNumber);
    const loanId = localStorage.getItem("loanId");

    console.log("Loan ID:", {
      bankCode: selectedBank,
      accountNo: accountNumber,
      bvn: phoneNumber,
      loanId: loanId || "",
    });
    // Here you can handle the form submission, e.g., send data to an API
    if (selectedBank && accountNumber && phoneNumber) {
      // Simulate API call or further processing
      try {
        salaryReview({
          bankCode: selectedBank,
          accountNo: accountNumber,
          bvn: phoneNumber,
          loanId: loanId || "",
        })
          .unwrap()
          .then((response) => {
            console.log("Form submitted successfully:", response.data);
            if (response?.success) {
              setIsOTP(true);
            } else {
              setResendOTP(true);
              setOtp("");
              setModal({
                open: true,
                message:
                  response.message ||
                  "Failed to submit form. Please try again.",
                title: "Submission Failed",
              });
            }
          })
          .catch((err) => {
            setResendOTP(true);
            setModal({
              open: true,
              message:
                err?.message || "Error submitting form. Please try again.",
              title: "Submission Error",
            });
            if (isError) {
              console.error("Error details:", error);
            }
          });
      } catch (error) {
        console.error("Error submitting form:", error);
        // onNext();
      }
    } else {
      console.error("Please fill in all fields correctly.");
    }
  };

  const handleResendOTP = async () => {
    // setResendLoading(true);
    const loanId = localStorage.getItem("loanId");
    try {
      const response = await resentBVNOtp({
        bvn: phoneNumber,
      }).unwrap();
      if (response?.success) {
        setIsOTP(true);
        setOtpVerified(false);
        setModal({
          open: true,
          message: "OTP resent successfully. Please check your email.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message:
            response.message || "Failed to resend OTP. Please try again.",
          title: "Resend Failed",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message: error?.message || "Error resending OTP. Please try again.",
        title: "Resend Error",
      });
    }
  };

  const handleVerifyResendOTP = async () => {
    console.log("Verifying Resend OTP...");
    try {
      const response = await verifyResendBVNOtp({
        bvn: phoneNumber,
        otp: otp,
      }).unwrap();
      if (response?.success) {
        setIsOTP(true);
        setModal({
          open: true,
          message: "OTP resent successfully. Please check your email.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message:
            response.message || "Failed to resend OTP. Please try again.",
          title: "Resend Failed",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message: error?.message || "Error resending OTP. Please try again.",
        title: "Resend Error",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="logo-container">
          <h1 className="logo-text">deVpay</h1>
        </div>
        <div className="illustration-container">
          <img src={peopleBg} alt="Business People" className="illustration" />
        </div>
      </div>

      <div className="login-right-panel">
        <div className="back-button-container">
          <button className="back-button" onClick={onBack}>
            <span className="back-icon">‹</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className="login-form-container">
          <ProgressBar currentStep={2} />
          <div className="login-header">
            <h1>Account Review</h1>
            <p>Please provide your bank details for statement review.</p>
          </div>

          <form
            onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
            className="login-form"
          >
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="bank-select-label">Select Bank</InputLabel>
                <Select
                  labelId="bank-select-label"
                  id="bank-select"
                  value={selectedBank}
                  label="Select Bank"
                  onChange={(e) => setSelectedBank(e.target.value)}
                  required
                  sx={{
                    height: "48px", // Matches the input field height
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "& .MuiSelect-select": {
                      padding: "12px 16px",
                      fontSize: "16px",
                    },
                  }}
                  className="form-input"
                >
                  {NIGERIAN_BANKS.map((bank) => (
                    <MenuItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                required
                className="form-input"
                maxLength={10}
                pattern="\d{10}"
                inputMode="numeric"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">BVN</label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="Enter 11-digit phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                className="form-input"
                maxLength={11}
                pattern="\d{11}"
                inputMode="numeric"
              />
            </div>

            {isOTP && (
              <div className="form-group">
                <label htmlFor="otp">Email OTP</label>
                <div
                  className="password-input-container"
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    id="otp"
                    placeholder="Enter the OTP sent to your Email"
                    value={otp}
                    onChange={(e) => {
                      if (e.target.value.length <= 6) {
                        setOtp(e.target.value);
                      }
                    }}
                    required
                    className="form-input"
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>
            )}

            {resendOTP && (
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    color: resendLoading ? "#aaa" : "#1976d2",
                    textDecoration: "underline",
                    cursor: resendLoading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    if (
                      !resendLoading &&
                      selectedBank &&
                      accountNumber &&
                      phoneNumber
                    ) {
                      handleResendOTP();
                    }
                  }}
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </span>
              </div>
            )}

            <div className="form-group">
              {isLoading ? (
                <button
                  type="submit"
                  className="login-button"
                  disabled
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Spinner size={22} />
                </button>
              ) : (
                <button type="submit" className="login-button">
                  Continue
                </button>
              )}
            </div>
          </form>

          <Modal
            open={modal.open}
            onClose={() => setModal({ ...modal, open: false })}
            title={modal.title}
            actions={
              <button
                className="login-button"
                onClick={() => {
                  if (otpVerified) {
                    onNext();
                  } else {
                    setModal({ ...modal, open: false });
                  }
                }}
              >
                Close
              </button>
            }
          >
            {modal.message}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default StatementReview;
