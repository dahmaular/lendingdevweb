import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { GlassCard, ModernButton, ModernSpinner } from "./ui";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Logo from "../assets/logo.jpeg";
import { useSubmitLoanMutation } from "../store/services/baseApi";
import SuccessModal from "./SuccessModal";
import { keyframes } from "@mui/system";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

interface ConfirmationPageProps {
  formData: {
    employer_id: string;
    employer_name: string;
    email: string;
    salary: number;
    bank_name: string;
    account_name: string;
    account_number: string;
    bvn: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    nin: string;
    lga: string;
    home_address: string;
    state: string;
    date_of_birth: string;
    sex: string;
    loan_amount: number;
    loan_duration: number;
  };
  onBack: () => void;
  onSubmitSuccess: (reference: string) => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  formData,
  onBack,
  onSubmitSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loanReference, setLoanReference] = useState("");

  const [submitLoan, { isLoading, isSuccess, isError, error, data }] =
    useSubmitLoanMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setLoanReference(data.data?.loanId || "");
      setShowSuccessModal(true);
    }
  }, [isSuccess, data]);

  const handleSubmit = async () => {
    const loanId = localStorage.getItem("loanId");
    try {
      await submitLoan({
        loanId: loanId || "",
        loanAmount: formData.loan_amount,
        tenor: formData.loan_duration,
      }).unwrap();
    } catch (err) {
      console.error("Failed to submit loan application:", err);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onSubmitSuccess(loanReference);
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    window.location.href = "/";
  };

  // Calculate monthly repayment (simple interest calculation)
  const interestRate = 0.05; // 5% monthly interest
  const totalInterest =
    formData.loan_amount * interestRate * formData.loan_duration;
  const totalRepayment = formData.loan_amount + totalInterest;
  const monthlyRepayment = totalRepayment / formData.loan_duration;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: "#334155",
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          pointerEvents: "none",
        }}
      />

      {/* Left Panel - Branding */}
      <Box
        sx={{
          flex: isMobile ? "none" : "0 0 40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 3 : 6,
          minHeight: isMobile ? "auto" : "100vh",
        }}
      >
        <GlassCard
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: "400px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "24px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              animation: `${float} 3s ease-in-out infinite`,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 50, color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Review & Confirm
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1rem",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Please review your application details carefully before submitting
          </Typography>

          {/* Features */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { icon: <VerifiedIcon />, text: "Verified Information" },
              { icon: <SecurityIcon />, text: "Secure Submission" },
              { icon: <CheckCircleIcon />, text: "Instant Processing" },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Box
                  sx={{
                    color: "#60a5fa",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}
                >
                  {feature.text}
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
          p: isMobile ? 2 : 4,
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="DevPay Logo"
            sx={{
              height: 50,
              borderRadius: "12px",
            }}
          />
        </Box>

        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <ModernButton
            variant="outline"
            onClick={onBack}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.4)",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
            Go Back
          </ModernButton>
        </Box>

        {/* Main Form Card */}
        <GlassCard
          sx={{
            p: isMobile ? 3 : 4,
            flex: 1,
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Title */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Application Summary
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "1rem" }}>
              Step 5 of 5 - Final Review
            </Typography>
          </Box>

          {/* Loan Summary Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              mb: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-50%",
                right: "-30%",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              Total Loan Amount
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontSize: "2.5rem",
                fontWeight: 800,
                mb: 2,
              }}
            >
              {formatCurrency(formData.loan_amount)}
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}
                >
                  Duration
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  {formData.loan_duration} Month
                  {formData.loan_duration > 1 ? "s" : ""}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}
                >
                  Monthly Payment
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  {formatCurrency(monthlyRepayment)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}
                >
                  Total Repayment
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  {formatCurrency(totalRepayment)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Personal Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#334155",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                }}
              />
              Personal Information
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: "rgba(241, 245, 249, 0.8)",
              }}
            >
              <InfoRow
                label="Full Name"
                value={`${formData.first_name} ${formData.middle_name} ${formData.last_name}`}
              />
              <InfoRow label="Email" value={formData.email} />
              <InfoRow label="Phone Number" value={formData.phone_number} />
              <InfoRow label="Date of Birth" value={formData.date_of_birth} />
              <InfoRow label="Gender" value={formData.sex} />
              <InfoRow label="NIN" value={formData.nin} />
              <InfoRow label="BVN" value={formData.bvn} />
            </Box>
          </Box>

          {/* Address Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#334155",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
              />
              Address Information
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: "rgba(241, 245, 249, 0.8)",
              }}
            >
              <InfoRow label="Home Address" value={formData.home_address} />
              <InfoRow label="State" value={formData.state} />
              <InfoRow label="LGA" value={formData.lga} />
            </Box>
          </Box>

          {/* Employment Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#334155",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                }}
              />
              Employment Information
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: "rgba(241, 245, 249, 0.8)",
              }}
            >
              <InfoRow label="Employer" value={formData.employer_name} />
              <InfoRow
                label="Monthly Salary"
                value={formatCurrency(formData.salary)}
              />
            </Box>
          </Box>

          {/* Bank Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#334155",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                }}
              />
              Bank Information
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: "rgba(241, 245, 249, 0.8)",
              }}
            >
              <InfoRow label="Bank Name" value={formData.bank_name} />
              <InfoRow label="Account Name" value={formData.account_name} />
              <InfoRow label="Account Number" value={formData.account_number} />
            </Box>
          </Box>

          {/* Terms Notice */}
          <Box
            sx={{
              p: 3,
              borderRadius: "12px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              mb: 4,
            }}
          >
            <Typography
              sx={{
                color: "#334155",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              By clicking "Submit Application", you agree to our{" "}
              <Typography
                component="span"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Terms of Service
              </Typography>{" "}
              and{" "}
              <Typography
                component="span"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Privacy Policy
              </Typography>
              . Your information will be processed securely.
            </Typography>
          </Box>

          {/* Error Message */}
          {isError && (
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                mb: 3,
              }}
            >
              <Typography sx={{ color: "#dc2626", fontSize: "0.9rem" }}>
                {(error as any)?.data?.message ||
                  "Failed to submit application. Please try again."}
              </Typography>
            </Box>
          )}

          {/* Submit Button */}
          <ModernButton
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ModernSpinner size="sm" />
                <span>Processing...</span>
              </Box>
            ) : (
              "Submit Application"
            )}
          </ModernButton>
        </GlassCard>
      </Box>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleCloseModal}
        onGoHome={handleGoHome}
      />
    </Box>
  );
};

export default ConfirmationPage;
