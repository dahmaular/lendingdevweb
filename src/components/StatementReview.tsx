import React, { useState } from "react";
import { Box, Typography, keyframes, Chip, Container } from "@mui/material";
import {
  useResentBVNOtpMutation,
  useSalaryReviewMutation,
  useSalaryReviewOTPMutation,
  useVerifyResendBVNOtpMutation,
} from "../store/services/baseApi";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LockIcon from "@mui/icons-material/Lock";
import Logo from "../assets/logo.jpeg";

import {
  GlassCard,
  ModernButton,
  ModernInput,
  ModernProgressBar,
  ModernModal,
  ModernSelect,
  AnimatedBackground,
} from "./ui";

interface StatementReviewProps {
  onNext: () => void;
  onBack: () => void;
}

const NIGERIAN_BANKS = [
  { value: "044", label: "Access Bank" },
  { value: "023", label: "Citibank" },
  { value: "063", label: "Access Bank (Diamond)" },
  { value: "050", label: "Ecobank" },
  { value: "070", label: "Fidelity Bank" },
  { value: "011", label: "First Bank" },
  { value: "214", label: "FCMB" },
  { value: "058", label: "Guaranty Trust Bank" },
  { value: "030", label: "Heritage Bank" },
  { value: "082", label: "Keystone Bank" },
  { value: "076", label: "Polaris Bank" },
  { value: "221", label: "Stanbic IBTC" },
  { value: "232", label: "Sterling Bank" },
  { value: "032", label: "Union Bank" },
  { value: "033", label: "United Bank for Africa" },
  { value: "215", label: "Unity Bank" },
  { value: "035", label: "Wema Bank" },
  { value: "057", label: "Zenith Bank" },
];

const float1 = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(2deg); }
  75% { transform: translateY(10px) rotate(-2deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-25px) scale(1.05); }
`;

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

export const StatementReview: React.FC<StatementReviewProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [salaryReview, { isLoading }] = useSalaryReviewMutation();
  const [salaryReviewOTP, { isLoading: verifyLoading }] =
    useSalaryReviewOTPMutation();
  const [resentBVNOtp, { isLoading: resendLoading }] =
    useResentBVNOtpMutation();
  const [verifyResendBVNOtp] = useVerifyResendBVNOtpMutation();

  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
    type?: "success" | "error";
  }>({ open: false, message: "", title: undefined, type: "success" });

  const isAnyLoading = isLoading || verifyLoading || resendLoading;

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setAccountNumber(value);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    const loanId = localStorage.getItem("loanId");
    e.preventDefault();

    if (otpVerified) {
      handleVerifyResendOTP();
      return;
    }

    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        title: "Invalid OTP",
        type: "error",
      });
      return;
    }

    const response = await salaryReviewOTP({
      loanId: loanId || "",
      otp: otp,
    });

    if (response.data?.success) {
      setOtpVerified(true);
      setModal({
        open: true,
        message: "OTP verified successfully.",
        title: "Success!",
        type: "success",
      });
    } else {
      setResendOTP(true);
      setOtp("");
      setModal({
        open: true,
        message:
          (response?.error &&
            "data" in response.error &&
            (response.error as any).data?.message) ||
          "OTP verification failed.",
        title: "Error",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanId = localStorage.getItem("loanId");

    if (selectedBank && accountNumber && phoneNumber) {
      try {
        salaryReview({
          bankCode: selectedBank,
          accountNo: accountNumber,
          bvn: phoneNumber,
          loanId: loanId || "",
        })
          .unwrap()
          .then((response) => {
            if (response?.success) {
              setIsOTP(true);
            } else {
              setResendOTP(true);
              setOtp("");
              setModal({
                open: true,
                message: response.message || "Failed to submit form.",
                title: "Submission Failed",
                type: "error",
              });
            }
          })
          .catch((err) => {
            setResendOTP(true);
            setModal({
              open: true,
              message: err?.message || "Error submitting form.",
              title: "Submission Error",
              type: "error",
            });
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resentBVNOtp({ bvn: phoneNumber }).unwrap();
      if (response?.success) {
        setIsOTP(true);
        setOtpVerified(false);
        setModal({
          open: true,
          message: response.message || "OTP resent successfully.",
          title: "OTP Resent",
          type: "success",
        });
      } else {
        setModal({
          open: true,
          message: response.message || "Failed to resend OTP.",
          title: "Resend Failed",
          type: "error",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message: error?.message || "Error resending OTP.",
        title: "Resend Error",
        type: "error",
      });
    }
  };

  const handleVerifyResendOTP = async () => {
    try {
      const response = await verifyResendBVNOtp({
        bvn: phoneNumber,
        otp: otp,
      }).unwrap();
      if (response?.success) {
        setIsOTP(true);
        setModal({
          open: true,
          message: "OTP verified successfully.",
          title: "Success!",
          type: "success",
        });
      } else {
        setModal({
          open: true,
          message: response.message || "Failed to verify OTP.",
          title: "Verification Failed",
          type: "error",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message: error?.message || "Error verifying OTP.",
        title: "Verification Error",
        type: "error",
      });
    }
  };

  const securityFeatures = [
    {
      icon: <ShieldIcon sx={{ fontSize: 24 }} />,
      title: "Bank-Level Security",
      description: "256-bit encryption",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 24 }} />,
      title: "Verified Process",
      description: "BVN protected",
    },
    {
      icon: <LockIcon sx={{ fontSize: 24 }} />,
      title: "Data Privacy",
      description: "Your data is safe",
    },
  ];

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
        {/* Floating decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 80,
            height: 80,
            borderRadius: "24px",
            background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
            opacity: 0.2,
            animation: `${float1} 6s ease-in-out infinite`,
            transform: "rotate(15deg)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            opacity: 0.2,
            animation: `${float2} 8s ease-in-out infinite`,
          }}
        />

        <Box
          sx={{
            textAlign: "center",
            maxWidth: "480px",
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          {/* Bank Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "28px",
              background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
              boxShadow: "0 20px 40px rgba(0, 168, 89, 0.3)",
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 50, color: "#fff" }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { lg: "2.75rem", xl: "3.25rem" },
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              mb: 2,
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            Secure Account Verification
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Link your bank account securely. We use bank-level encryption to protect your information.
          </Typography>

          {/* Security Features */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {securityFeatures.map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  flex: "1 1 120px",
                  maxWidth: "140px",
                  transition: "all 0.3s ease",
                  animation: `${fadeInUp} 0.8s ease-out ${0.2 + idx * 0.1}s backwards`,
                  "&:hover": {
                    transform: "translateY(-5px)",
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(0, 168, 89, 0.5)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    mb: 1.5,
                    mx: "auto",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    mb: 0.5,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Form Section */}
      <Box
        sx={{
          flex: { xs: 1, lg: "0 0 560px" },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          background: { 
            xs: "transparent", 
            lg: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)" 
          },
          backdropFilter: { xs: "none", lg: "blur(20px)" },
          borderLeft: { xs: "none", lg: "1px solid rgba(255,255,255,0.2)" },
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4, flex: 1, display: "flex", flexDirection: "column" }}>
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
                p: 1.5,
                borderRadius: "16px",
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0, 168, 89, 0.1)",
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
              onClick={onBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderColor: { xs: "rgba(255,255,255,0.5)", lg: "#00A859" },
                color: { xs: "#fff", lg: "#00A859" },
                "&:hover": {
                  background: { xs: "rgba(255,255,255,0.1)", lg: "rgba(0, 168, 89, 0.05)" },
                  borderColor: { xs: "#fff", lg: "#008847" },
                },
              }}
            >
              Back
            </ModernButton>
          </Box>

          {/* Main Card */}
          <GlassCard
            variant="elevated"
            sx={{
              flex: 1,
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              background: { xs: "rgba(255,255,255,0.95)", lg: "#fff" },
              border: "1px solid rgba(0, 168, 89, 0.08)",
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            {/* Progress */}
            <Box sx={{ mb: 4 }}>
              <ModernProgressBar 
                steps={4} 
                currentStep={2} 
                stepLabels={["Details", "Verify", "Review", "Complete"]}
              />
            </Box>

            {/* Form Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Chip
                label="Step 2 of 4"
                sx={{
                  mb: 2,
                  background: "linear-gradient(135deg, rgba(0, 168, 89, 0.1) 0%, rgba(0, 201, 106, 0.1) 100%)",
                  color: "#00A859",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  border: "1px solid rgba(0, 168, 89, 0.2)",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  mb: 1,
                }}
              >
                Bank Account Details
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#64748B",
                  maxWidth: "320px",
                  mx: "auto",
                }}
              >
                Link your salary account for automatic statement retrieval
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                flex: 1,
              }}
            >
              <ModernSelect
                label="Select Bank"
                value={selectedBank}
                onChange={(value) => setSelectedBank(value)}
                options={NIGERIAN_BANKS}
                startIcon={<AccountBalanceIcon />}
                searchable
                searchPlaceholder="Search banks..."
                required
              />

              <ModernInput
                label="Account Number"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                startIcon={<CreditCardIcon />}
                required
                inputProps={{ maxLength: 10 }}
              />

              <ModernInput
                label="BVN"
                placeholder="Enter 11-digit BVN"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                startIcon={<FingerprintIcon />}
                required
                inputProps={{ maxLength: 11 }}
              />

              {isOTP && (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, rgba(0, 168, 89, 0.05) 0%, rgba(0, 201, 106, 0.05) 100%)",
                    border: "1px solid rgba(0, 168, 89, 0.15)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CheckCircleOutlineIcon sx={{ color: "#00A859", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#00A859", fontWeight: 500 }}
                    >
                      OTP sent to your registered phone
                    </Typography>
                  </Box>
                  <ModernInput
                    label="Enter OTP"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) setOtp(value);
                    }}
                    startIcon={<LockOutlinedIcon />}
                    required
                  />
                </Box>
              )}

              {resendOTP && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: resendLoading ? "not-allowed" : "pointer",
                    opacity: resendLoading ? 0.6 : 1,
                    transition: "all 0.3s ease",
                    py: 1,
                    "&:hover": {
                      opacity: resendLoading ? 0.6 : 0.8,
                    },
                  }}
                  onClick={() => !resendLoading && handleResendOTP()}
                >
                  <RefreshIcon
                    sx={{
                      color: "#00A859",
                      animation: resendLoading
                        ? "spin 1s linear infinite"
                        : "none",
                      "@keyframes spin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#00A859",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    {resendLoading ? "Resending..." : "Didn't get the OTP? Resend"}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: "auto", pt: 3 }}>
                <ModernButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isAnyLoading}
                  endIcon={!isAnyLoading && <ArrowForwardIcon />}
                  glow
                  sx={{
                    py: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {isOTP ? "Verify & Continue" : "Continue"}
                </ModernButton>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <LockIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#94A3B8" }}
                  >
                    Your information is encrypted and secure
                  </Typography>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </Container>
      </Box>

      {/* Modal */}
      <ModernModal
        open={modal.open}
        onClose={() => {
          if (otpVerified) {
            onNext();
          } else {
            setModal({ ...modal, open: false });
          }
        }}
        title={modal.title || ""}
        type={modal.type || "success"}
        primaryAction={{
          label: otpVerified ? "Continue" : "Got it",
          onClick: () => {
            if (otpVerified) {
              onNext();
            } else {
              setModal({ ...modal, open: false });
            }
          },
        }}
      >
        <Typography variant="body1" sx={{ textAlign: "center", color: "#475569" }}>
          {modal.message}
        </Typography>
      </ModernModal>
    </Box>
  );
};

export default StatementReview;
