import React, { useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import { useSubmitLoanMutation } from "../store/services/baseApi";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import {
  GlassCard,
  ModernButton,
  ModernInput,
  ModernProgressBar,
  ModernModal,
  ModernSpinner,
  ModernSelect,
} from "../components/ui";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

interface LoginPageProps {
  onSubmitApplication: (
    loanAmount: number,
    duration: number,
    monthlyIncome: number
  ) => void;
  onGoBack: () => void;
}

const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} ${i + 1 === 1 ? "Month" : "Months"}`,
}));

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
  const [isLoanBreakDown, setIsLoanBreakDown] = useState<boolean>(false);
  const navigate = useNavigate();

  const maxLoanEligible = localStorage.getItem("maxLoanEligible");
  const maxLoanAmount = maxLoanEligible
    ? parseFloat(maxLoanEligible)
    : 10000000;

  const [submitLoan, { isLoading }] = useSubmitLoanMutation();
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
    isSuccess?: boolean;
  }>({ open: false, message: "", title: undefined, isSuccess: false });

  const [breakdown, setBreakdown] = useState<{
    loanId: string;
    monthlyRepaymentAmount: number;
    repaymentAmount: number;
    tenor: number;
  } | null>(null);

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[₦,\s]/g, "");
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    const numValue = parseFloat(value || "0");
    if (!value || (numValue >= 0 && numValue <= 100000000)) {
      setLoanAmount(value);
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
        isSuccess: false,
      });
      return;
    }
    try {
      const response = await submitLoan({
        loanAmount: Number(loanAmount),
        tenor: Number(duration),
        loanId: loanId || "",
      }).unwrap();
      if (!response.success) {
        setModal({
          open: true,
          message: response?.message || "Error submitting application.",
          title: "Submission Failed",
          isSuccess: false,
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
          isSuccess: true,
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message: error?.message || "An error occurred. Please try again.",
        title: "Submission Error",
        isSuccess: false,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 15s ease infinite`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          animation: `${floatAnimation} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          animation: `${pulseAnimation} 4s ease-in-out infinite`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Left Panel - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <GlassCard
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: "500px",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "white",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Loan Application
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 4,
              fontWeight: 300,
            }}
          >
            Get the funds you need
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: <SpeedIcon />, text: "Fast" },
              { icon: <TrendingUpIcon />, text: "Flexible" },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "30px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ color: "white", display: "flex" }}>{item.icon}</Box>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </GlassCard>
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "16px",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "120px", height: "auto", borderRadius: "8px" }}
            />
          </Box>
          <ModernButton
            variant="outline"
            startIcon={<ArrowBackIcon />}
            onClick={onGoBack}
            sx={{
              borderColor: "rgba(255,255,255,0.5)",
              color: "white",
              backdropFilter: "blur(10px)",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Go Back
          </ModernButton>
        </Box>

        {/* Form Card */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "500px",
            width: "100%",
            mx: "auto",
          }}
        >
          <GlassCard sx={{ p: { xs: 3, md: 4 } }}>
            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <ModernProgressBar currentStep={4} steps={4} />
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Loan Details
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                mb: 4,
                fontSize: "1rem",
              }}
            >
              Enter your desired loan amount and duration
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <ModernInput
                    label="Loan Amount"
                    value={formatDisplay(loanAmount)}
                    onChange={handleLoanAmountChange}
                    required
                    placeholder="Enter amount in Naira"
                    startIcon={<AttachMoneyIcon />}
                  />
                  {loanAmount && parseFloat(loanAmount) < 10000 && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        mt: 1,
                        pl: 1,
                      }}
                    >
                      Minimum amount is ₦10,000
                    </Typography>
                  )}
                  {loanAmount && parseFloat(loanAmount) > maxLoanAmount && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        mt: 1,
                        pl: 1,
                      }}
                    >
                      Maximum loan amount is{" "}
                      {formatCurrency(maxLoanAmount.toString())}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      mt: 1,
                      pl: 1,
                      fontStyle: "italic",
                    }}
                  >
                    Based on your credit score, the maximum you're eligible for
                    is {formatCurrency(maxLoanAmount.toString())}
                  </Typography>
                </Box>

                <ModernSelect
                  label="Loan Duration"
                  value={duration}
                  onChange={(value) => setDuration(value)}
                  options={DURATION_OPTIONS}
                  icon={<AccessTimeIcon />}
                />

                {/* Submit Button */}
                <Box sx={{ mt: 2 }}>
                  <ModernButton
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    startIcon={!isLoading ? <SendIcon /> : undefined}
                    sx={{
                      height: 56,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <ModernSpinner size="sm" />
                        <span>Processing...</span>
                      </Box>
                    ) : (
                      "Submit Application"
                    )}
                  </ModernButton>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </Box>
      </Box>

      {/* Modal */}
      <ModernModal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        type={modal.isSuccess ? "success" : "error"}
        primaryAction={{
          label: isLoanBreakDown ? "View Breakdown" : "Close",
          onClick: () => {
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
          },
        }}
      >
        <Typography sx={{ color: "#64748b", textAlign: "center" }}>
          {modal.message}
        </Typography>
      </ModernModal>
    </Box>
  );
};

export default LoanApplicationPage;
