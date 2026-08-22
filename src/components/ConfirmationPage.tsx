import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  User,
  FileText,
  CreditCard,
  Download,
  Home,
  PartyPopper,
  Wallet,
  Calendar,
  Percent,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
import { colors, shadows } from "../theme";
import Logo from "../assets/devpay-logo.png";

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
    width: "132px",
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
      boxShadow: active ? shadows.successGlow : "none",
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

  successIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: colors.status.successLight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: shadows.successGlow,
  } as React.CSSProperties,

  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: colors.text.primary,
    marginBottom: "8px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  subtitle: {
    fontSize: "15px",
    color: colors.text.secondary,
    marginBottom: "32px",
    lineHeight: 1.6,
    textAlign: "center" as const,
  } as React.CSSProperties,

  referenceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "#E3F2FD",
    borderRadius: "12px",
    marginBottom: "24px",
    border: `1px solid ${colors.primary.light}`,
  } as React.CSSProperties,

  referenceLabel: {
    fontSize: "13px",
    color: colors.text.secondary,
    margin: 0,
  } as React.CSSProperties,

  referenceNumber: {
    fontSize: "18px",
    fontWeight: 700,
    color: colors.primary.dark,
    margin: "4px 0 0",
    fontFamily: "monospace",
  } as React.CSSProperties,

  summaryCard: {
    background: "#F8FAFC",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    border: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  summaryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  } as React.CSSProperties,

  summaryLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: colors.text.secondary,
  } as React.CSSProperties,

  summaryValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: colors.text.primary,
  } as React.CSSProperties,

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    marginTop: "8px",
    borderTop: `2px solid ${colors.status.success}`,
  } as React.CSSProperties,

  totalLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: colors.text.primary,
  } as React.CSSProperties,

  totalValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: colors.status.success,
  } as React.CSSProperties,

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: colors.status.successLight,
    color: colors.status.success,
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
  } as React.CSSProperties,

  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    background: "#FFF8E1",
    borderRadius: "12px",
    marginBottom: "24px",
    border: "1px solid #FFE082",
  } as React.CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  } as React.CSSProperties,

  button: {
    flex: 1,
    padding: "16px 24px",
    fontSize: "15px",
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
    flex: 1,
    padding: "16px 24px",
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

  copyButton: {
    padding: "8px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
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
                  {isCompleted || isActive ? (
                    <CheckCircle size={18} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
              </motion.div>
              {index < steps.length - 1 && (
                <div style={styles.stepLine(isCompleted || isActive)} />
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

// ============== Confetti Animation ==============
const Confetti: React.FC = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ["#1E88E5", "#00C853", "#7C4DFF", "#FF6B35", "#FFB020"][
      Math.floor(Math.random() * 5)
    ],
  }));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 360 }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            background: piece.color,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
};

// ============== Success Modal ==============
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#FFFFFF",
                borderRadius: "24px",
                padding: "40px 32px",
                maxWidth: "400px",
                width: "100%",
                textAlign: "center",
                boxShadow: shadows.xl,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={styles.successIcon}
              >
                <PartyPopper size={40} color={colors.status.success} />
              </motion.div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: colors.text.primary,
                  margin: "0 0 12px",
                }}
              >
                Application Submitted!
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                }}
              >
                Your loan application has been successfully submitted. You will
                receive an SMS and email notification within 24 hours.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                style={{
                  ...styles.button,
                  width: "100%",
                }}
              >
                <CheckCircle size={18} />
                View Application Details
              </motion.button>
            </motion.div>
          </motion.div>
          <Confetti />
        </>
      )}
    </AnimatePresence>
  );
};

// ============== Main Component ==============
const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  // Loan data from localStorage
  const [loanData, setLoanData] = useState({
    referenceNumber: "LN-2024-00001",
    loanAmount: 0,
    duration: 0,
    interestRate: 0,
    processingFee: 0,
    totalInterest: 0,
    totalRepayment: 0,
    monthlyPayment: 0,
    bankName: "Access Bank",
    accountNumber: "****1234",
    status: "Processing",
    submittedDate: new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });

  useEffect(() => {
    const loanId = localStorage.getItem("loanId");
    if (!loanId) {
      navigate("/");
      return;
    }

    // Get loan details from localStorage
    const storedLoanDetails = localStorage.getItem("loanDetails");
    if (storedLoanDetails) {
      try {
        const loanDetails = JSON.parse(storedLoanDetails);
        setLoanData((prev) => ({
          ...prev,
          loanAmount: loanDetails.loanAmount || 0,
          duration: loanDetails.duration || 0,
          interestRate: loanDetails.interestRate || 0,
          processingFee: loanDetails.processingFee || 0,
          totalInterest: loanDetails.totalInterest || 0,
          totalRepayment: loanDetails.totalRepayment || 0,
          monthlyPayment: loanDetails.monthlyPayment || 0,
        }));
      } catch (error) {
        console.error("Error parsing loan details:", error);
      }
    }
  }, [navigate]);

  const handleNewApplication = () => {
    localStorage.removeItem("loanId");
    localStorage.removeItem("maxLoanEligible");
    localStorage.removeItem("loanDetails");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <img src={Logo} alt="devpay" style={styles.logo} />
        </motion.div>

        <ProgressSteps currentStep={5} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.card}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={styles.successIcon}
          >
            <CheckCircle size={40} color={colors.status.success} />
          </motion.div>

          <h1 style={styles.title}>Application Complete!</h1>
          <p style={styles.subtitle}>
            Your loan application has been submitted successfully. Here&apos;s a
            summary of your application.
          </p>

          {/* Reference Number */}
          {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={styles.referenceBox}
          >
            <div>
              <p style={styles.referenceLabel}>Application Reference</p>
              <p style={styles.referenceNumber}>{loanData.referenceNumber}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyReference}
              style={styles.copyButton}
            >
              {copied ? (
                <Check size={20} color={colors.status.success} />
              ) : (
                <Copy size={20} color={colors.primary.main} />
              )}
            </motion.button>
          </motion.div> */}

          {/* Status Badge */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={styles.statusBadge}
            >
              <Clock size={16} />
              {loanData.status}
            </motion.span>
          </div>

          {/* Loan Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={styles.summaryCard}
          >
            <div style={styles.summaryHeader}>
              <Sparkles size={20} color={colors.primary.main} />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Loan Summary
              </span>
            </div>

            <div style={styles.summaryRow}>
              <div style={styles.summaryLabel}>
                <Wallet size={16} color={colors.text.muted} />
                Loan Amount
              </div>
              <span style={styles.summaryValue}>
                {formatCurrency(loanData.loanAmount)}
              </span>
            </div>

            <div style={styles.summaryRow}>
              <div style={styles.summaryLabel}>
                <Calendar size={16} color={colors.text.muted} />
                Duration
              </div>
              <span style={styles.summaryValue}>
                {loanData.duration} month{loanData.duration > 1 ? "s" : ""}
              </span>
            </div>

            <div style={styles.summaryRow}>
              <div style={styles.summaryLabel}>
                <Percent size={16} color={colors.text.muted} />
                Interest Rate
              </div>
              <span style={styles.summaryValue}>
                {loanData.interestRate * 100}% per month
              </span>
            </div>

            <div style={styles.summaryRow}>
              <div style={styles.summaryLabel}>
                <Clock size={16} color={colors.text.muted} />
                Monthly Payment
              </div>
              <span
                style={{ ...styles.summaryValue, color: colors.secondary.main }}
              >
                {formatCurrency(loanData.monthlyPayment)}
              </span>
            </div>

            {/* <div style={styles.summaryRow}>
              <div style={styles.summaryLabel}>
                <Building2 size={16} color={colors.text.muted} />
                Disbursement Account
              </div>
              <span style={styles.summaryValue}>
                {loanData.bankName} ({loanData.accountNumber})
              </span>
            </div> */}

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Repayment</span>
              <span style={styles.totalValue}>
                {formatCurrency(loanData.totalRepayment)}
              </span>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={styles.infoBox}
          >
            <Shield
              size={20}
              color={colors.status.warning}
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: colors.text.primary,
                  margin: "0 0 4px",
                }}
              >
                What happens next?
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: colors.text.secondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Your application will be reviewed within 24 hours. Once
                approved, the loan will be disbursed to your verified bank
                account.
              </p>
            </div>
          </motion.div>

          <div style={styles.buttonGroup}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={styles.buttonSecondary}
              onClick={() => {
                /* Download functionality */
              }}
            >
              <Download size={18} />
              Download
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: shadows.lg }}
              whileTap={{ scale: 0.98 }}
              style={styles.button}
              onClick={handleNewApplication}
            >
              <Home size={18} />
              New Application
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
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
            Application submitted on {loanData.submittedDate}
          </p>
        </motion.div>
      </div>

      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ConfirmationPage;
