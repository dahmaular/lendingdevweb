import React, { use, useState } from "react";
import "./login.css";
import peopleBg from "../assets/people.svg";
import ProgressBar from "../components/ProgressBar";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  useSubmitLoanApplicationMutation,
  useSubmitLoanMutation,
} from "../store/services/baseApi";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onSubmitApplication: (
    loanAmount: number,
    duration: number,
    monthlyIncome: number
  ) => void;
  onGoBack: () => void;
}

// Duration options in months
const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `${i + 1} ${i + 1 === 1 ? "Month" : "Months"}`,
}));

// Format number to Nigerian Naira
const formatCurrency = (value: string): string => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

const LoanApplicationPage: React.FC<LoginPageProps> = ({
  onSubmitApplication,
  onGoBack,
}) => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("12");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [isLoanBreakDown, setIsLoanBreakDown] = useState<boolean>(false);
  const navigate = useNavigate();

  const [submitLoan, { isLoading }] = useSubmitLoanMutation();
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const [breakdown, setBreakdown] = useState<{
    loanId: string;
    monthlyRepaymentAmount: number;
    repaymentAmount: number;
    tenor: number;
  } | null>(null);

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove currency symbols and commas
    value = value.replace(/[₦,\s]/g, "");
    // Remove any non-digit characters except decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    const numValue = parseFloat(value || "0");
    if (!value || (numValue >= 0 && numValue <= 100000000)) {
      setLoanAmount(value);
    }
  };

  const handleMonthlyIncomeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    // Remove currency symbols and commas
    value = value.replace(/[₦,\s]/g, "");
    // Remove any non-digit characters except decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    const numValue = parseFloat(value || "0");
    if (!value || numValue >= 0) {
      setMonthlyIncome(value);
    }
  };

  const formatDisplay = (value: string): string => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";
    return formatCurrency(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const loanId = localStorage.getItem("loanId");
    e.preventDefault();
    if (!loanAmount || !duration) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      return;
    }
    console.log("requested loan amount:", {
      loanAmount: Number(loanAmount),
      tenor: Number(duration),
      loanId: loanId || "",
    });
    try {
      const response = await submitLoan({
        loanAmount: Number(loanAmount),
        tenor: Number(duration),
        loanId: loanId || "",
      }).unwrap();
      console.log("Loan submission response:", response);
      if (!response.success) {
        setModal({
          open: true,
          message: response?.message || "Error submitting application.",
          title: "Submission Failed",
        });
        return;
      }
      if (isLoading) {
        setModal({
          open: true,
          message: "Submitting your application, please wait...",
          title: "Please Wait",
        });
        return;
      }
      if (response.success) {
        setIsLoanBreakDown(true);
        setBreakdown({
          loanId: response.data.loanId,
          monthlyRepaymentAmount: response.data.monthlyRepaymentAmount,
          repaymentAmount: response.data.repaymentAmount,
          tenor: response.data.tenor,
        });
        setModal({
          open: true,
          message: response.message || "Application submitted successfully!",
          title: "Success",
        });
      }
    } catch (error: any) {
      console.error("Error loan application:", error);
      setModal({
        open: true,
        message: error?.message || "An error occurred. Please try again.",
        title: "Submission Error",
      });
    }
    // if (onSubmitApplication) {
    //   onSubmitApplication(
    //     parseFloat(loanAmount),
    //     parseInt(duration),
    //     parseFloat(monthlyIncome)
    //   );
    // }
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
          <button className="back-button" onClick={onGoBack}>
            <span className="back-icon">‹</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className="login-form-container">
          <ProgressBar currentStep={4} />
          <div className="login-header">
            <h1>Loan Form</h1>
            <p>Please provide your desired loan amount and income details.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <TextField
                fullWidth
                label="Loan Amount"
                value={formatDisplay(loanAmount)}
                onChange={handleLoanAmountChange}
                required
                placeholder="Enter amount in Naira"
                type="text"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    height: "48px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                  },
                }}
              />
              {loanAmount && parseFloat(loanAmount) < 10000 && (
                <div className="error-text">Minimum amount is ₦1,000</div>
              )}
              {loanAmount && parseFloat(loanAmount) > 10000000 && (
                <div className="error-text">
                  Maximum loan amount is ₦10,000,000
                </div>
              )}
              <p
                className="info-text"
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginTop: "8px",
                  fontStyle: "italic",
                }}
              >
                Based on your credit score review, the maximum amount you're
                eligible for is ₦10,000,000
              </p>
            </div>

            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="duration-select-label">Duration</InputLabel>
                <Select
                  labelId="duration-select-label"
                  id="duration-select"
                  value={duration}
                  label="Duration"
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  sx={{
                    height: "48px",
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
                  {DURATION_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* <div className="form-group">
              <TextField
                fullWidth
                label="Monthly Income"
                value={formatDisplay(monthlyIncome)}
                onChange={handleMonthlyIncomeChange}
                required
                placeholder="Enter your monthly income"
                type="text"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    height: "48px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                  },
                }}
              />
              {monthlyIncome && parseFloat(monthlyIncome) < 0 && (
                <div className="error-text">
                  Monthly income cannot be negative
                </div>
              )}
            </div> */}

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
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        actions={
          <button
            className="login-button"
            onClick={() => {
              if (isLoanBreakDown) {
                navigate("/confirmation", {
                  state: {
                    loanAmount: breakdown?.repaymentAmount || 0,
                    loanTenure: breakdown?.tenor || 0,
                    monthlyIncome: breakdown?.monthlyRepaymentAmount || 0,
                    loanId: breakdown?.loanId || "",
                  },
                });
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
  );
};

export default LoanApplicationPage;
