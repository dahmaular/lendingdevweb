import React, { useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";
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
import Logo from "../assets/logo.jpeg";

import {
  GlassCard,
  ModernButton,
  ModernInput,
  ModernProgressBar,
  ModernModal,
  ModernSelect,
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

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
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
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          animation: `${floatAnimation} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
        }}
      />

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
        <GlassCard sx={{ p: 6, textAlign: "center", maxWidth: "450px" }}>
          <AccountBalanceIcon sx={{ fontSize: 80, color: "white", mb: 3 }} />
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "white", mb: 2 }}
          >
            Account Review
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 300 }}
          >
            Securely link your bank account for instant verification
          </Typography>
        </GlassCard>
      </Box>

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
            variant="ghost"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            Go Back
          </ModernButton>
        </Box>

        <GlassCard
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            maxWidth: "600px",
            mx: "auto",
            width: "100%",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <ModernProgressBar currentStep={2} />

          <Box sx={{ mb: 4, mt: 3 }}>
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
              Bank Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Provide your bank account details for statement review.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}
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
                    "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                  border: "1px solid rgba(102,126,234,0.2)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Enter the OTP sent to your registered phone number
                </Typography>
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
                }}
                onClick={() => !resendLoading && handleResendOTP()}
              >
                <RefreshIcon sx={{ color: "#667eea" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#667eea",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: "auto", pt: 2 }}>
              <ModernButton
                type="submit"
                variant="gradient"
                fullWidth
                loading={isAnyLoading}
                endIcon={!isAnyLoading && <ArrowForwardIcon />}
                sx={{ py: 2, fontSize: "1.1rem" }}
              >
                Continue
              </ModernButton>
            </Box>
          </Box>
        </GlassCard>
      </Box>

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
          label: "Got it",
          onClick: () => {
            if (otpVerified) {
              onNext();
            } else {
              setModal({ ...modal, open: false });
            }
          },
        }}
      >
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {modal.message}
        </Typography>
      </ModernModal>
    </Box>
  );
};

export default StatementReview;
