import React, { useState } from "react";
import { Box, Typography, Container, Chip, keyframes } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import CalculateIcon from "@mui/icons-material/Calculate";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
  AnimatedBackground,
} from "../components/ui";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

// Feature items for left panel
const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 24 }} />,
    title: "Instant Calculation",
    description: "Get real-time loan breakdown",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
    title: "Flexible Terms",
    description: "Choose your preferred duration",
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />,
    title: "Quick Approval",
    description: "Fast decision on your application",
  },
];

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground variant="dark" />

      {/* Left Panel - Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: "480px",
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "24px",
              background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              boxShadow: "0 20px 60px rgba(0, 168, 89, 0.4)",
              animation: `${pulse} 3s ease-in-out infinite`,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 45, color: "white" }} />
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "white",
              mb: 2,
              fontSize: { lg: "3rem", xl: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            Choose Your
            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Loan Amount
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.2rem",
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Select the amount you need and your preferred repayment duration.
            Our calculator will show you the exact monthly payments.
          </Typography>

          {/* Feature Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {features.map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 2.5,
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  animation: `${fadeInUp} 0.8s ease-out ${0.2 + idx * 0.1}s both`,
                  "&:hover": {
                    background: "rgba(0, 168, 89, 0.1)",
                    border: "1px solid rgba(0, 168, 89, 0.3)",
                    transform: "translateX(8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 0.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: { xs: 1, lg: "0 0 560px" },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          background: { xs: "transparent", lg: "rgba(255,255,255,0.02)" },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            py: 4,
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "16px",
                background: "white",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "100px", height: "auto", borderRadius: "8px" }}
              />
            </Box>
            <ModernButton
              variant="outline"
              startIcon={<ArrowBackIcon />}
              onClick={onGoBack}
              sx={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": {
                  borderColor: "#00A859",
                  background: "rgba(0, 168, 89, 0.1)",
                  color: "#00A859",
                },
              }}
            >
              Back
            </ModernButton>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <GlassCard
              variant="elevated"
              sx={{
                p: { xs: 3, sm: 4 },
                animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
              }}
            >
              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <ModernProgressBar
                  steps={4}
                  currentStep={4}
                  stepLabels={["Apply", "Bank Link", "Details", "Loan"]}
                />
              </Box>

              {/* Step Label */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Chip
                  label="Final Step"
                  icon={<CalculateIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    px: 2,
                    py: 2.5,
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1a1a2e",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Loan Details
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  mb: 4,
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              >
                Enter your desired loan amount and duration
              </Typography>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Loan Amount Input */}
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
                    
                    {/* Eligibility Info Box */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, rgba(0,168,89,0.08) 0%, rgba(0,201,106,0.05) 100%)",
                        border: "1px solid rgba(0,168,89,0.2)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#00A859",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                        Maximum eligible: {formatCurrency(maxLoanAmount.toString())}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Duration Select */}
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
                      variant="primary"
                      fullWidth
                      disabled={isLoading}
                      glow
                      startIcon={!isLoading ? <SendIcon /> : undefined}
                      sx={{
                        height: 56,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderRadius: "100px",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <ModernSpinner size={24} />
                          <span>Processing...</span>
                        </Box>
                      ) : (
                        "Submit Application"
                      )}
                    </ModernButton>
                  </Box>

                  {/* Security Note */}
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                      textAlign: "center",
                      mt: 1,
                    }}
                  >
                    🔒 Your information is secured with bank-grade encryption
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </Box>
        </Container>
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
