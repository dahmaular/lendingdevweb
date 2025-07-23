import React, { useState } from "react";
import { Typography, Box, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import SuccessModal from "./SuccessModal";
import "../pages/login.css";

const INTEREST_RATE = 0.045; // 4.5%

export const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get loan data from the previous page's state
  const { loanAmount, loanTenure, monthlyIncome, loanId } = location.state || {
    loanAmount: 50000, // Default value for demonstration
    loanTenure: 12, // Default value for demonstration
    monthlyIncome: 0, // Default value for demonstration
    loanId: "", // Default value for demonstration
  };

  // Calculate loan details
  const interestFee = loanAmount * INTEREST_RATE;
  const totalRepayment = loanAmount + interestFee;
  const monthlyPayment = totalRepayment / loanTenure;

  const handleSubmit = () => {
    // TODO: Implement loan submission logic
    console.log("Loan application submitted:", {
      loanAmount,
      loanTenure,
      interestFee,
      totalRepayment,
    });

    // Show success modal instead of navigating immediately
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="logo-container">
          <h1 className="logo-text">deVpay</h1>
        </div>
        <div className="illustration-container">
          {/* You can add an illustration here if needed */}
        </div>
      </div>

      <div className="login-right-panel">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <span className="back-icon">‹</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className="login-form-container">
          <ProgressBar currentStep={5} />
          <div className="login-header">
            <h1>Loan Confirmation</h1>
            <p>
              Please review the loan breakdown below before submitting your
              application.
            </p>
          </div>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body1">Loan Amount:</Typography>
              <Typography variant="body1" fontWeight="bold">
                ₦{loanAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body1">Loan Tenure:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {loanTenure} months
              </Typography>
            </Box>

            {/* <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body1">Interest Fee (4.5%):</Typography>
              <Typography variant="body1" fontWeight="bold">
                ₦{interestFee.toLocaleString()}
              </Typography>
            </Box> */}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6">Total Repayment:</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₦{loanAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6">Monthly Payment:</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₦
                {monthlyPayment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <button className="login-button" onClick={handleSubmit}>
              Confirm & Submit
            </button>
          </Box>
        </div>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onClose={handleCloseModal}
        onGoHome={handleGoHome}
      />
    </div>
  );
};
