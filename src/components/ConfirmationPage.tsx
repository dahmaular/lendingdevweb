import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Download,
  Home,
  PartyPopper,
  Clock,
  Check,
} from "lucide-react";
import { brand, colors, radii, shadows, type } from "../theme";
import {
  Callout,
  PageShell,
  PrimaryButton,
  Receipt,
  SecondaryButton,
  Sheet,
} from "./chrome";

// ============== Styles ==============
const styles = {
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
    color: [brand.gold, colors.primary.main, brand.goldDeep, colors.status.success, brand.ink2][
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
              background: "rgba(11, 38, 33, 0.42)",
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
                background: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                borderRadius: `${radii.lg}px`,
                boxShadow: shadows.xl,
                padding: "40px 32px",
                maxWidth: "400px",
                width: "100%",
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={styles.successIcon}
              >
                <PartyPopper size={38} color={colors.primary.main} />
              </motion.div>

              <h2
                style={{
                  font: `700 26px/1.15 ${type.display}`,
                  letterSpacing: "-0.02em",
                  color: colors.text.primary,
                  margin: "0 0 12px",
                }}
              >
                Application Submitted!
              </h2>
              <p
                style={{
                  font: `400 15px/1.55 ${type.body}`,
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                }}
              >
                Your loan application has been successfully submitted. You will
                receive an SMS and email notification within 24 hours.
              </p>

              <PrimaryButton icon={CheckCircle} iconPosition="start" onClick={onClose}>
                View application details
              </PrimaryButton>
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
      navigate("/apply");
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
    navigate("/apply");
  };

  const summary: [string, string][] = [
    ["Loan amount", formatCurrency(loanData.loanAmount)],
    ["Interest rate", `${loanData.interestRate * 100}% per month`],
    ["Duration", `${loanData.duration} month${loanData.duration > 1 ? "s" : ""}`],
    ["Processing fee (1%)", formatCurrency(loanData.processingFee)],
    ["Monthly payment", formatCurrency(loanData.monthlyPayment)],
    ["Total interest", formatCurrency(loanData.totalInterest)],
  ];

  return (
    <>
      <PageShell
        step={5}
        showHelp={false}
        aside={
          <Receipt
            title="On file"
            rows={[
              { label: "Reference", value: loanData.referenceNumber },
              { label: "Disbursement account", value: loanData.bankName },
              { label: "Account number", value: loanData.accountNumber },
              { label: "Submitted", value: loanData.submittedDate },
            ]}
            footer="Keep your reference handy if you contact support about this application."
          />
        }
      >
        <Sheet>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: `${radii.lg + 2}px`,
                background: brand.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={30} strokeWidth={2.6} color={colors.primary.main} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h1
                style={{
                  margin: 0,
                  font: `700 clamp(26px, 3.4vw, 36px)/1.1 ${type.display}`,
                  letterSpacing: "-0.025em",
                  color: colors.text.primary,
                }}
              >
                Application complete
              </h1>
              <p
                style={{
                  margin: 0,
                  font: `400 16px/1.5 ${type.body}`,
                  color: colors.text.secondary,
                }}
              >
                Your loan application has been submitted successfully. Here&rsquo;s a summary of
                your application.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: "9px",
              padding: "9px 16px",
              borderRadius: `${radii.pill}px`,
              background: "rgba(230, 190, 88, 0.35)",
              color: colors.text.primary,
              font: `600 13px/1 ${type.body}`,
            }}
          >
            <Clock size={16} strokeWidth={1.9} />
            {loanData.status} &middot; usually within 24 hours
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "0 40px",
            }}
          >
            {summary.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "16px",
                  padding: "11px 0",
                  borderBottom: `1px dashed ${colors.border.light}`,
                }}
              >
                <span style={{ font: `400 14px/1.3 ${type.body}`, color: colors.text.secondary }}>
                  {label}
                </span>
                <span style={{ font: `600 15px/1 ${type.display}`, color: colors.text.primary }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              padding: "20px 24px",
              borderRadius: `${radii.lg - 2}px`,
              background: colors.primary.main,
              borderBottom: `4px solid ${brand.gold}`,
            }}
          >
            <span style={{ font: `600 15px/1 ${type.body}`, color: colors.background.main }}>
              Total repayment
            </span>
            <span
              style={{
                font: `700 clamp(24px, 3vw, 32px)/1 ${type.display}`,
                letterSpacing: "-0.025em",
                color: brand.gold,
              }}
            >
              {formatCurrency(loanData.totalRepayment)}
            </span>
          </div>

          <Callout icon={Clock} title="What happens next?">
            Your application will be reviewed within 24 hours. Once approved, the loan will be
            disbursed to your verified bank account.
          </Callout>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <SecondaryButton icon={Download} onClick={() => window.print()}>
                Download summary
              </SecondaryButton>
              <div style={{ flexGrow: 1, minWidth: "200px" }}>
                <PrimaryButton icon={Home} iconPosition="start" onClick={handleNewApplication}>
                  New application
                </PrimaryButton>
              </div>
            </div>
            <p
              style={{
                margin: 0,
                textAlign: "center",
                font: `400 12px/1.5 ${type.body}`,
                color: colors.text.secondary,
              }}
            >
              Application submitted on {loanData.submittedDate}.
            </p>
          </div>
        </Sheet>
      </PageShell>

      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};


export default ConfirmationPage;
