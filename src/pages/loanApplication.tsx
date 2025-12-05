import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  FileText,
  Calculator,
  TrendingUp,
  Clock,
  Percent,
  Wallet,
  Info,
  Loader2,
  AlertCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import { useSubmitLoanMutation } from "../store/services/baseApi";

// ============== Color Theme ==============
const colors = {
  primary: {
    main: "#1E88E5",
    light: "#64B5F6",
    dark: "#1565C0",
    gradient: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
  },
  secondary: {
    main: "#00ACC1",
    light: "#4DD0E1",
    dark: "#00838F",
  },
  accent: {
    orange: "#FF6B35",
    green: "#00C853",
    purple: "#7C4DFF",
  },
  background: {
    main: "#F8FAFC",
    card: "#FFFFFF",
    elevated: "rgba(255, 255, 255, 0.95)",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
  },
  border: {
    light: "#E2E8F0",
    focus: "#1E88E5",
  },
  status: {
    success: "#00C853",
    error: "#FF4757",
    warning: "#FFB020",
  },
};

const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  glow: "0 0 20px rgba(30, 136, 229, 0.3)",
  card: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

// ============== Loan Duration Options ==============
const LOAN_DURATIONS = [
  { value: 1, label: "1 Month" },
  { value: 2, label: "2 Months" },
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

// ============== Styles ==============
const styles = {
  container: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.background.main} 0%, #E3F2FD 100%)`,
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,

  innerContainer: {
    maxWidth: "640px",
    margin: "0 auto",
  } as React.CSSProperties,

  header: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },

  logo: {
    width: "160px",
    height: "auto",
    marginBottom: "16px",
  },

  progressContainer: {
    marginBottom: "32px",
  } as React.CSSProperties,

  progressSteps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
  } as React.CSSProperties,

  stepCircle: (active: boolean, completed: boolean) =>
    ({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: completed
        ? colors.status.success
        : active
        ? colors.primary.gradient
        : "#E2E8F0",
      color: completed || active ? "#FFFFFF" : colors.text.muted,
      fontSize: "14px",
      fontWeight: 600,
      transition: "all 0.3s ease",
      boxShadow: active ? shadows.glow : "none",
    } as React.CSSProperties),

  stepLine: (completed: boolean) =>
    ({
      width: "40px",
      height: "3px",
      background: completed ? colors.status.success : "#E2E8F0",
      borderRadius: "2px",
      marginLeft: "4px",
      marginRight: "4px",
    } as React.CSSProperties),

  card: {
    background: colors.background.card,
    borderRadius: "20px",
    padding: "32px",
    boxShadow: shadows.card,
    border: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: colors.text.primary,
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,

  subtitle: {
    fontSize: "15px",
    color: colors.text.secondary,
    marginBottom: "24px",
    lineHeight: 1.6,
  } as React.CSSProperties,

  eligibilityCard: {
    background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    border: `1px solid ${colors.primary.light}`,
  } as React.CSSProperties,

  eligibilityHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  } as React.CSSProperties,

  eligibilityAmount: {
    fontSize: "32px",
    fontWeight: 700,
    color: colors.primary.dark,
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  } as React.CSSProperties,

  formSection: {
    marginBottom: "24px",
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.text.primary,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,

  inputGroup: {
    marginBottom: "20px",
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text.primary,
    marginBottom: "8px",
  } as React.CSSProperties,

  inputWrapper: {
    position: "relative" as const,
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "16px 16px 16px 48px",
    fontSize: "18px",
    fontWeight: 600,
    border: `2px solid ${colors.border.light}`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#FFFFFF",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  inputIcon: {
    position: "absolute" as const,
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.primary.main,
    pointerEvents: "none" as const,
  } as React.CSSProperties,

  slider: {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "#E2E8F0",
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
  } as React.CSSProperties,

  durationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "8px",
  } as React.CSSProperties,

  durationButton: (selected: boolean) =>
    ({
      padding: "14px 8px",
      fontSize: "13px",
      fontWeight: selected ? 600 : 500,
      color: selected ? "#FFFFFF" : colors.text.primary,
      background: selected ? colors.primary.gradient : "#F8FAFC",
      border: `2px solid ${
        selected ? colors.primary.main : colors.border.light
      }`,
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "center" as const,
    } as React.CSSProperties),

  breakdownCard: {
    background: "#F8FAFC",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "24px",
    border: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  breakdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  } as React.CSSProperties,

  breakdownLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: colors.text.secondary,
  } as React.CSSProperties,

  breakdownValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: colors.text.primary,
  } as React.CSSProperties,

  breakdownTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    marginTop: "8px",
    borderTop: `2px solid ${colors.primary.light}`,
  } as React.CSSProperties,

  totalLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: colors.text.primary,
  } as React.CSSProperties,

  totalValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: colors.primary.main,
  } as React.CSSProperties,

  button: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#FFFFFF",
    background: colors.primary.gradient,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: shadows.md,
  } as React.CSSProperties,

  buttonSecondary: {
    width: "100%",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 500,
    color: colors.text.primary,
    background: "#F1F5F9",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  } as React.CSSProperties,

  error: {
    fontSize: "13px",
    color: colors.status.error,
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  } as React.CSSProperties,
};

// ============== Progress Steps Component ==============
const ProgressSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { icon: User, label: "Start" },
    { icon: FileText, label: "Review" },
    { icon: User, label: "Details" },
    { icon: CreditCard, label: "Loan" },
    { icon: CheckCircle, label: "Confirm" },
  ];

  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressSteps}>
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <React.Fragment key={index}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={styles.stepCircle(isActive, isCompleted)}>
                  {isCompleted ? (
                    <CheckCircle size={18} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
              </motion.div>
              {index < steps.length - 1 && (
                <div style={styles.stepLine(isCompleted)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ============== Format Currency ==============
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");
};

// ============== Main Component ==============
const LoanApplication: React.FC = () => {
  const navigate = useNavigate();
  const [submitLoan, { isLoading }] = useSubmitLoanMutation();

  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [duration, setDuration] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Interest rate (example: 5% per month)
  const interestRate = 0.05;

  useEffect(() => {
    const maxEligible = localStorage.getItem("maxLoanEligible");
    if (maxEligible) {
      const amount = parseFloat(maxEligible);
      setMaxLoanAmount(amount);
      setLoanAmount(Math.min(amount, 50000));
      setInputValue(formatCurrency(Math.min(amount, 50000)));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const loanBreakdown = useMemo(() => {
    const principal = loanAmount;
    const totalInterest = principal * interestRate * duration;
    const processingFee = principal * 0.01; // 1% processing fee
    const totalRepayment = principal + totalInterest + processingFee;
    const monthlyPayment = totalRepayment / duration;

    return {
      principal,
      totalInterest,
      processingFee,
      totalRepayment,
      monthlyPayment,
    };
  }, [loanAmount, duration]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(value) || 0;

    if (numericValue > maxLoanAmount) {
      setError(`Maximum loan amount is ${formatCurrency(maxLoanAmount)}`);
      setLoanAmount(maxLoanAmount);
      setInputValue(formatCurrency(maxLoanAmount));
    } else if (numericValue < 5000 && numericValue !== 0) {
      setError("Minimum loan amount is ₦5,000");
      setLoanAmount(numericValue);
      setInputValue(formatCurrency(numericValue));
    } else {
      setError("");
      setLoanAmount(numericValue);
      setInputValue(numericValue ? formatCurrency(numericValue) : "");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLoanAmount(value);
    setInputValue(formatCurrency(value));
    setError("");
  };

  const handleSubmit = async () => {
    if (loanAmount < 5000) {
      setError("Minimum loan amount is ₦5,000");
      return;
    }

    try {
      const loanId = localStorage.getItem("loanId");
      if (!loanId) {
        navigate("/");
        return;
      }

      const response = await submitLoan({
        loanId,
        loanAmount,
        tenor: duration,
      }).unwrap();

      if (response.success) {
        // Store loan data for confirmation page
        const loanDetailsForConfirmation = {
          loanAmount,
          duration,
          interestRate,
          processingFee: loanBreakdown.processingFee,
          totalInterest: loanBreakdown.totalInterest,
          totalRepayment: loanBreakdown.totalRepayment,
          monthlyPayment: loanBreakdown.monthlyPayment,
        };
        localStorage.setItem(
          "loanDetails",
          JSON.stringify(loanDetailsForConfirmation)
        );
        navigate("/confirmation");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={styles.logo}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>

        <ProgressSteps currentStep={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.card}
        >
          <h1 style={styles.title}>
            <CreditCard size={28} color={colors.primary.main} />
            Loan Application
          </h1>
          <p style={styles.subtitle}>
            You&apos;re almost there! Choose your loan amount and repayment
            duration.
          </p>

          {/* Eligibility Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={styles.eligibilityCard}
          >
            <div style={styles.eligibilityHeader}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: colors.primary.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={20} color="#FFFFFF" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    color: colors.text.secondary,
                    margin: 0,
                  }}
                >
                  Your Maximum Eligibility
                </p>
                <div style={styles.eligibilityAmount}>
                  <span style={{ fontSize: "20px" }}>₦</span>
                  {maxLoanAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loan Amount Section */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <DollarSign size={16} color={colors.primary.main} />
              Select Loan Amount
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Enter amount</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  {/* <DollarSign size={20} /> */}₦
                </span>
                <input
                  type="text"
                  placeholder="₦0"
                  value={inputValue}
                  onChange={handleAmountChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary.main;
                    e.target.style.boxShadow = shadows.glow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? colors.status.error
                      : colors.border.light;
                    e.target.style.boxShadow = "none";
                  }}
                  style={{
                    ...styles.input,
                    borderColor: error
                      ? colors.status.error
                      : colors.border.light,
                  }}
                />
              </div>

              {/* Amount Slider */}
              <div style={{ marginTop: "16px", padding: "0 4px" }}>
                <input
                  type="range"
                  min={5000}
                  max={maxLoanAmount}
                  step={1000}
                  value={loanAmount}
                  onChange={handleSliderChange}
                  style={{
                    ...styles.slider,
                    background: `linear-gradient(to right, ${
                      colors.primary.main
                    } 0%, ${colors.primary.main} ${
                      (loanAmount / maxLoanAmount) * 100
                    }%, #E2E8F0 ${
                      (loanAmount / maxLoanAmount) * 100
                    }%, #E2E8F0 100%)`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    fontSize: "12px",
                    color: colors.text.muted,
                  }}
                >
                  <span>₦5,000</span>
                  <span>{formatCurrency(maxLoanAmount)}</span>
                </div>
              </div>

              {error && (
                <div style={styles.error}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Duration Section */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <Calendar size={16} color={colors.primary.main} />
              Repayment Duration
            </div>

            <div style={styles.durationGrid}>
              {LOAN_DURATIONS.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.durationButton(duration === option.value)}
                  onClick={() => setDuration(option.value)}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Loan Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={styles.breakdownCard}
          >
            <div style={styles.breakdownHeader}>
              <Calculator size={20} color={colors.primary.main} />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Loan Breakdown
              </span>
            </div>

            <div style={styles.breakdownRow}>
              <div style={styles.breakdownLabel}>
                <Wallet size={16} color={colors.text.muted} />
                Principal Amount
              </div>
              <span style={styles.breakdownValue}>
                {formatCurrency(loanBreakdown.principal)}
              </span>
            </div>

            <div style={styles.breakdownRow}>
              <div style={styles.breakdownLabel}>
                <Percent size={16} color={colors.text.muted} />
                Total Interest ({interestRate * 100}% × {duration} month
                {duration > 1 ? "s" : ""})
              </div>
              <span style={styles.breakdownValue}>
                {formatCurrency(loanBreakdown.totalInterest)}
              </span>
            </div>

            <div style={styles.breakdownRow}>
              <div style={styles.breakdownLabel}>
                <TrendingUp size={16} color={colors.text.muted} />
                Processing Fee (1%)
              </div>
              <span style={styles.breakdownValue}>
                {formatCurrency(loanBreakdown.processingFee)}
              </span>
            </div>

            <div style={styles.breakdownRow}>
              <div style={styles.breakdownLabel}>
                <Clock size={16} color={colors.text.muted} />
                Monthly Payment
              </div>
              <span
                style={{
                  ...styles.breakdownValue,
                  color: colors.secondary.main,
                }}
              >
                {formatCurrency(loanBreakdown.monthlyPayment)}
              </span>
            </div>

            <div style={styles.breakdownTotal}>
              <span style={styles.totalLabel}>Total Repayment</span>
              <span style={styles.totalValue}>
                {formatCurrency(loanBreakdown.totalRepayment)}
              </span>
            </div>
          </motion.div>

          {/* Info Box */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              background: "#FFF8E1",
              borderRadius: "12px",
              marginTop: "24px",
              border: "1px solid #FFE082",
            }}
          >
            <Info
              size={20}
              color={colors.status.warning}
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "13px",
                  color: colors.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Loan will be disbursed to your verified bank account within 24
                hours of approval.
              </p>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ ...styles.buttonSecondary, flex: 1 }}
              onClick={() => navigate("/personal-details")}
            >
              <ArrowLeft size={18} />
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: shadows.lg }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...styles.button,
                flex: 2,
                opacity: isLoading ? 0.7 : 1,
              }}
              onClick={handleSubmit}
              disabled={isLoading || loanAmount < 5000}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={20}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <Shield size={14} color={colors.text.muted} />
          <p
            style={{
              fontSize: "13px",
              color: colors.text.muted,
              margin: 0,
            }}
          >
            Secured with bank-level encryption
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${colors.primary.main};
          cursor: pointer;
          box-shadow: ${shadows.md};
          border: 4px solid white;
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${colors.primary.main};
          cursor: pointer;
          box-shadow: ${shadows.md};
          border: 4px solid white;
        }
        input::placeholder {
          color: ${colors.text.muted};
        }
      `}</style>
    </div>
  );
};

export default LoanApplication;
