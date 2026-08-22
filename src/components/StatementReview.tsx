import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CreditCard,
  Hash,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Shield,
  ChevronDown,
  Search,
  Check,
  X,
  Loader2,
  Landmark,
  User,
} from "lucide-react";
import {
  useResentBVNOtpMutation,
  useSalaryReviewMutation,
  useSalaryReviewOTPMutation,
  useVerifyResendBVNOtpMutation,
  useGetBanksQuery,
} from "../store/services/baseApi";
import Logo from "../assets/devpay-logo.png";
import { colors, shadows } from "../theme";

const getBackendErrorMessage = (err: unknown): string | undefined => {
  if (err && typeof err === "object" && "data" in err) {
    return (err as { data?: { message?: string } }).data?.message;
  }
  return undefined;
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 50%, ${colors.secondary[50]} 100%)`,
  } as React.CSSProperties,
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral[200]}`,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "14px 16px",
    paddingLeft: "48px",
    fontSize: "16px",
    border: `2px solid ${colors.neutral[200]}`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    background: colors.neutral[50],
    color: colors.neutral[900],
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  inputFocused: {
    borderColor: colors.primary[500],
    boxShadow: `0 0 0 4px ${colors.primary[100]}`,
    background: "#fff",
  } as React.CSSProperties,
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: colors.neutral[700],
  } as React.CSSProperties,
  button: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
    color: "#fff",
    boxShadow: shadows.md,
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  } as React.CSSProperties,
};

const ProgressSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { label: "Get Started", icon: User },
    { label: "Statement Review", icon: Shield },
    { label: "Personal Details", icon: Building2 },
    { label: "Loan Application", icon: Sparkles },
    { label: "Confirmation", icon: Check },
  ];

  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "24px",
            right: "24px",
            height: "3px",
            background: colors.neutral[200],
            borderRadius: "2px",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "24px",
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 48px)",
            height: "3px",
            background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
            borderRadius: "2px",
            zIndex: 1,
            transition: "width 0.5s ease",
          }}
        />
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;
          const Icon = step.icon;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  background:
                    isCompleted || isCurrent
                      ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`
                      : colors.neutral[100],
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    isCompleted || isCurrent
                      ? "none"
                      : `2px solid ${colors.neutral[300]}`,
                  boxShadow: isCurrent ? shadows.glow : "none",
                }}
              >
                {isCompleted ? (
                  <Check size={20} color="#fff" />
                ) : (
                  <Icon
                    size={18}
                    color={isCurrent ? "#fff" : colors.neutral[400]}
                  />
                )}
              </motion.div>
              <span
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCurrent ? colors.primary[600] : colors.neutral[500],
                  textAlign: "center",
                  maxWidth: "70px",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
}

const ModernModal: React.FC<ModalProps> = ({
  open,
  title,
  message,
  onClose,
  onAction,
  actionText = "Ok, got it",
}) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: shadows.xl,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={24} color={colors.primary[600]} />
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <X size={20} color={colors.neutral[400]} />
              </button>
            </div>
            {title && (
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: colors.neutral[900],
                  marginBottom: "8px",
                }}
              >
                {title}
              </h3>
            )}
            <p
              style={{
                fontSize: "15px",
                color: colors.neutral[600],
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {message}
            </p>
            <button
              onClick={onAction || onClose}
              style={{ ...styles.button, width: "100%" }}
            >
              {actionText}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BankSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  banks: { code: string; name: string }[];
  isLoading?: boolean;
}> = ({ value, onChange, banks, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const safeBanks = useMemo(() => (Array.isArray(banks) ? banks : []), [banks]);
  const filteredBanks = useMemo(() => {
    if (!searchQuery) return safeBanks;
    return safeBanks.filter((bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, safeBanks]);
  const selectedBank = safeBanks.find((bank) => bank.code === value);

  return (
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <label style={styles.label}>Select Bank</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.input,
          paddingLeft: "48px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isOpen ? "#fff" : colors.neutral[50],
          borderColor: isOpen ? colors.primary[500] : colors.neutral[200],
          boxShadow: isOpen ? `0 0 0 4px ${colors.primary[100]}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Landmark
            size={20}
            color={colors.neutral[400]}
            style={{ position: "absolute", left: "16px" }}
          />
          <span
            style={{
              color: selectedBank ? colors.neutral[900] : colors.neutral[400],
            }}
          >
            {isLoading
              ? "Loading banks..."
              : selectedBank?.name || "Select your bank"}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} color={colors.neutral[400]} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: shadows.xl,
              border: `1px solid ${colors.neutral[200]}`,
              zIndex: 100,
              overflow: "hidden",
              maxHeight: "320px",
            }}
          >
            <div
              style={{
                padding: "12px",
                borderBottom: `1px solid ${colors.neutral[100]}`,
              }}
            >
              <div style={{ position: "relative" }}>
                <Search
                  size={18}
                  color={colors.neutral[400]}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search banks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 40px",
                    fontSize: "14px",
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: "8px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>
            </div>
            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
              {filteredBanks.map((bank) => (
                <div
                  key={bank.code}
                  onClick={() => {
                    onChange(bank.code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                      value === bank.code ? colors.primary[50] : "transparent",
                    borderLeft:
                      value === bank.code
                        ? `3px solid ${colors.primary[500]}`
                        : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== bank.code)
                      e.currentTarget.style.background = colors.neutral[50];
                  }}
                  onMouseLeave={(e) => {
                    if (value !== bank.code)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{ fontSize: "14px", color: colors.neutral[800] }}
                  >
                    {bank.name}
                  </span>
                  {value === bank.code && (
                    <Check size={16} color={colors.primary[500]} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => {
            setIsOpen(false);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
};

const ModernInput: React.FC<{
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  maxLength?: number;
  required?: boolean;
  inputMode?: "text" | "numeric" | "tel";
}> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  maxLength,
  required,
  inputMode,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? colors.primary[500] : colors.neutral[400],
          }}
        >
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          required={required}
          inputMode={inputMode}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...styles.input, ...(focused ? styles.inputFocused : {}) }}
        />
      </div>
    </div>
  );
};

interface StatementReviewProps {
  onNext: () => void;
  onBack: () => void;
}

export const StatementReview: React.FC<StatementReviewProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bvn, setBvn] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const { data: banksData = [], isLoading: banksLoading } = useGetBanksQuery();

  const [salaryReview, { isLoading }] = useSalaryReviewMutation();
  const [salaryReviewOTP, { isLoading: verifyLoading }] =
    useSalaryReviewOTPMutation();
  const [resentBVNOtp, { isLoading: resendLoading }] =
    useResentBVNOtpMutation();
  const [, { isLoading: verifyResendLoading }] =
    useVerifyResendBVNOtpMutation();

  const isAnyLoading =
    isLoading || verifyLoading || resendLoading || verifyResendLoading;

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setAccountNumber(value);
  };

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) setBvn(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanId = localStorage.getItem("loanId");
    if (!selectedBank || !accountNumber || !bvn) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      return;
    }
    try {
      const response = await salaryReview({
        bankCode: selectedBank,
        accountNo: accountNumber,
        bvn,
        loanId: loanId || "",
        identityType: "bvn",
      }).unwrap();
      if (response?.success) {
        localStorage.setItem("bvn", bvn);
        setIsOTP(true);
        setModal({
          open: true,
          message: "OTP sent to your phone. Please verify.",
          title: "OTP Sent",
        });
      } else {
        setResendOTP(true);
        setModal({
          open: true,
          message: response.message || "Failed to submit. Please try again.",
          title: "Error",
        });
      }
    } catch (err: unknown) {
      setResendOTP(true);
      const errorMessage =
        getBackendErrorMessage(err) || "Error submitting form. Please try again.";
      setModal({ open: true, message: errorMessage, title: "Error" });
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanId = localStorage.getItem("loanId");
    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        title: "Invalid OTP",
      });
      return;
    }
    const response = await salaryReviewOTP({ loanId: loanId || "", otp });
    if (response.data?.success) {
      setOtpVerified(true);
      setModal({
        open: true,
        message: "OTP verified successfully.",
        title: "Success",
      });
    } else {
      setResendOTP(true);
      setOtp("");
      const errorMessage =
        (response?.error &&
          "data" in response.error &&
          (response.error as { data?: { message?: string } }).data?.message) ||
        "OTP verification failed.";
      setModal({ open: true, message: errorMessage, title: "Error" });
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resentBVNOtp({ bvn }).unwrap();
      if (response?.success) {
        setOtpVerified(false);
        setModal({
          open: true,
          message: response.message || "OTP resent successfully.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message: response.message || "Failed to resend OTP.",
          title: "Error",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        getBackendErrorMessage(err) || "Error resending OTP. Please try again.";
      setModal({
        open: true,
        message: errorMessage,
        title: "Error",
      });
    }
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: "520px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src={Logo}
              alt="devpay"
              style={{ width: "132px", height: "auto", display: "block" }}
            />
            <button
              onClick={onBack}
              style={{
                background: "transparent",
                border: "none",
                color: colors.primary[600],
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
          <div style={styles.card}>
            <ProgressSteps currentStep={2} />
            <div style={{ marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: colors.neutral[900],
                  marginBottom: "8px",
                }}
              >
                Account Review
              </h1>
              <p style={{ fontSize: "15px", color: colors.neutral[500] }}>
                Please provide your bank details for salary statement review.
              </p>
            </div>
            <form onSubmit={isOTP ? handleOTPSubmit : handleSubmit}>
              <BankSelect
                value={selectedBank}
                onChange={setSelectedBank}
                banks={banksData}
                isLoading={banksLoading}
              />
              <ModernInput
                label="Account Number"
                type="text"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                icon={<CreditCard size={20} />}
                maxLength={10}
                inputMode="numeric"
                required
              />
              <ModernInput
                label="BVN"
                type="text"
                placeholder="Enter 11-digit BVN"
                value={bvn}
                onChange={handleBvnChange}
                icon={<Hash size={20} />}
                maxLength={11}
                inputMode="numeric"
                required
              />
              {isOTP && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <ModernInput
                    label="SMS OTP"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= 6 &&
                        /^\d*$/.test(e.target.value)
                      )
                        setOtp(e.target.value);
                    }}
                    icon={<KeyRound size={20} />}
                    maxLength={6}
                    inputMode="numeric"
                    required
                  />
                </motion.div>
              )}
              {resendOTP && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: resendLoading
                      ? colors.neutral[400]
                      : colors.primary[600],
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: resendLoading ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "16px",
                    padding: 0,
                  }}
                >
                  <RefreshCw
                    size={14}
                    className={resendLoading ? "animate-spin" : ""}
                  />
                  {resendLoading
                    ? "Resending..."
                    : "Didn't get the OTP? Resend"}
                </motion.button>
              )}
              <button
                type="submit"
                disabled={isAnyLoading}
                style={{
                  ...styles.button,
                  ...(isAnyLoading ? styles.buttonDisabled : {}),
                }}
              >
                {isAnyLoading ? (
                  <>
                    <Loader2
                      size={20}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    {isOTP ? "Verify OTP" : "Continue"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: colors.neutral[500],
            }}
          >
            Your data is secured with bank-level encryption
          </p>
        </motion.div>
      </div>
      <ModernModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
        onAction={() => {
          if (otpVerified) {
            onNext();
          } else {
            setModal({ ...modal, open: false });
          }
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

export default StatementReview;
