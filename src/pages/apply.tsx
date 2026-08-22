import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  Shield,
  Check,
  X,
  Loader2,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import {
  useOnboarding1Mutation,
  useResendEmailOtpMutation,
  useVerifyOtpMutation,
  useVerifyResendEmailOtpMutation,
  useGetCurrentStatusMutation,
  CurrentStatusData,
} from "../store/services/baseApi";
import { colors, shadows, type } from "../theme";
import {
  Field,
  FieldRow,
  Modal,
  OtpInput,
  PageShell,
  PrimaryButton,
  Receipt,
  SecondaryButton,
  Sheet,
  SheetTitle,
} from "../components/chrome";

// The loan product this build onboards against. Staging and production have
// different product records, so this is set per environment alongside
// REACT_APP_API_BASE_URL — see .env.development / .env.production.
//
// Deliberately no fallback: a build with no product id must fail loudly rather
// than quietly onboarding staging applicants onto the production product.
const PRODUCT_ID = process.env.REACT_APP_PRODUCT_ID;

if (!PRODUCT_ID) {
  throw new Error(
    "REACT_APP_PRODUCT_ID is not set. Set it in the deployment environment, " +
      "or restore .env.development / .env.production."
  );
}

// Styled Components using inline styles for Shopify-inspired design
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 50%, ${colors.secondary[50]} 100%)`,
  } as React.CSSProperties,

  leftPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 50%, ${colors.secondary[700]} 100%)`,
    position: "relative" as const,
    overflow: "hidden",
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

  featureCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    marginBottom: "16px",
  } as React.CSSProperties,

  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.2)",
  } as React.CSSProperties,
};

// Resume Application Modal
interface ResumeModalProps {
  open: boolean;
  statusData: CurrentStatusData | null;
  onContinue: () => void;
  onStartNew: () => void;
  onClose: () => void;
}

const ResumeApplicationModal: React.FC<ResumeModalProps> = ({
  open,
  statusData,
  onContinue,
  onStartNew,
  onClose,
}) => {
  if (!open || !statusData) return null;

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
            background: "rgba(0, 0, 0, 0.6)",
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
              maxWidth: "480px",
              width: "100%",
              boxShadow: shadows.xl,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RotateCcw size={28} color={colors.primary[600]} />
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} color={colors.neutral[400]} />
              </button>
            </div>

            {/* Welcome Back Message */}
            <h3
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: colors.neutral[900],
                marginBottom: "8px",
              }}
            >
              Welcome back, {statusData.firstName}! 👋
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: colors.neutral[600],
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              You have an ongoing application for{" "}
              <strong>{statusData.productName}</strong>. Would you like to
              continue where you left off?
            </p>

            {/* Progress Info */}
            <div
              style={{
                background: colors.neutral[50],
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Progress Bar */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: colors.neutral[700],
                    }}
                  >
                    Application Progress
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: colors.primary[600],
                    }}
                  >
                    {statusData.progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: colors.neutral[200],
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${statusData.progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "#fff",
                  borderRadius: "12px",
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {statusData.stepNumber}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: colors.neutral[800],
                      margin: 0,
                    }}
                  >
                    {statusData.currentStepName}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: colors.neutral[500],
                      margin: "2px 0 0",
                    }}
                  >
                    Step {statusData.stepNumber} of {statusData.totalSteps}
                  </p>
                </div>
              </div>

              {/* Next Step Preview */}
              {statusData.nextStepName && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: colors.primary[50],
                    borderRadius: "12px",
                    borderLeft: `3px solid ${colors.primary[500]}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: colors.primary[700],
                      margin: 0,
                    }}
                  >
                    Next: {statusData.nextStepName}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: colors.primary[600],
                      margin: "4px 0 0",
                    }}
                  >
                    {statusData.nextStepDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <button
                onClick={onContinue}
                style={{
                  ...styles.button,
                  width: "100%",
                }}
              >
                Continue Application
                <ArrowRight size={18} />
              </button>
              <button
                onClick={onStartNew}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  background: "#fff",
                  color: colors.neutral[700],
                }}
              >
                <ArrowLeft size={18} />
                Start Fresh Application
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Consent Modal Component
interface ConsentModalProps {
  open: boolean;
  onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ open, onAccept }) => {
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
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              background: "#fff",
              borderRadius: "28px",
              padding: "0",
              maxWidth: "580px",
              width: "100%",
              boxShadow: shadows.xl,
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              margin: "auto",
            }}
          >
            {/* Gradient Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
                padding: "32px",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "-20px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Shield size={32} color="#fff" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "4px",
                      lineHeight: 1.2,
                    }}
                  >
                    Terms & Consent
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.9)",
                      margin: 0,
                    }}
                  >
                    Please review and accept to continue
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "32px", overflowY: "auto", flexGrow: 1 }}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: `2px solid ${colors.primary[100]}`,
                  position: "relative",
                }}
              >
                {/* Decorative accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: `linear-gradient(180deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                    borderRadius: "16px 0 0 16px",
                  }}
                />

                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: colors.neutral[800],
                    margin: 0,
                    textAlign: "justify",
                  }}
                >
                  By clicking{" "}
                  <strong style={{ color: colors.primary[700] }}>Accept</strong>
                  , I consent to{" "}
                  <strong style={{ color: colors.primary[700] }}>
                    Devtage Financial Services Limited
                  </strong>{" "}
                  obtaining information from relevant third parties as may be
                  necessary, on my <strong>employment details</strong>,{" "}
                  <strong>bank account history</strong>,{" "}
                  <strong>loans</strong>, and{" "}
                  <strong>other related data</strong>, to make a decision on my
                  loan application.
                  <br />
                  <br />I also consent to loan repayments being{" "}
                  <strong>
                    collected by direct debit from the bank account I authorise
                  </strong>
                  ; and any outstanding loans being{" "}
                  <strong>
                    recovered automatically from any BVN accounts linked to me
                  </strong>{" "}
                  in the case of default.
                </p>
              </div>

              {/* Info boxes */}
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "24px" }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: colors.neutral[50],
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                >
                  <Shield
                    size={18}
                    color={colors.primary[600]}
                    style={{ flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.neutral[600],
                        margin: 0,
                        marginBottom: "2px",
                      }}
                    >
                      Secure
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: colors.neutral[800],
                        margin: 0,
                      }}
                    >
                      Bank-level security
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: colors.neutral[50],
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                >
                  <Check
                    size={18}
                    color={colors.secondary[600]}
                    style={{ flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.neutral[600],
                        margin: 0,
                        marginBottom: "2px",
                      }}
                    >
                      Verified
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: colors.neutral[800],
                        margin: 0,
                      }}
                    >
                      Regulated lender
                    </p>
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  fontSize: "16px",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                  color: "#fff",
                  boxShadow: `0 8px 24px ${colors.primary[200]}`,
                  transition: "all 0.2s ease",
                }}
              >
                <Check size={20} />
                I Accept & Continue
                <ArrowRight size={20} />
              </motion.button>

              <p
                style={{
                  fontSize: "12px",
                  color: colors.neutral[500],
                  textAlign: "center",
                  marginTop: "16px",
                  marginBottom: 0,
                }}
              >
                Your data is protected under applicable privacy laws
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// Formats a Date as the YYYY-MM-DD string a native date input expects,
// using local calendar parts so the day never shifts across timezones.
/** yyyy-mm-dd from the date input, rendered the way the receipt reads. */
const formatDob = (value: string): string => {
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${d} / ${m} / ${y}`;
};

const toDateInputValue = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

// Main Component
interface LoginPageProps {
  onLogin: (email: string, bvn: string, dob: string) => void;
  onGoBack: () => void;
  onCreateAccount: () => void;
  onResetPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const [email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<string>(toDateInputValue(eighteenYearsAgo));
  const [firstName, setFirstName] = useState<string>("");
const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [loanId, setLoanId] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [showResumeForm, setShowResumeForm] = useState<boolean>(false);
  const [resumeEmail, setResumeEmail] = useState<string>("");
  const [resumeStatus, setResumeStatus] = useState<CurrentStatusData | null>(
    null,
  );
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [activeAppModal, setActiveAppModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const [onboarding1, { isLoading }] = useOnboarding1Mutation();
  const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation();
  const [resendEmailOtp, { isLoading: resendLoading, data: resendData }] =
    useResendEmailOtpMutation();
  const [, { isLoading: verifyResendLoading }] =
    useVerifyResendEmailOtpMutation();
  const [getCurrentStatus, { isLoading: statusLoading }] =
    useGetCurrentStatusMutation();

  // Check for existing application on mount
  // useEffect(() => {
  //   const checkExistingApplication = async (storedLoanId: string) => {
  //     try {
  //       const response = await getCurrentStatus({
  //         email: storedLoanId,
  //       }).unwrap();
  //       if (response.success && response.data && !response.data.isCompleted) {
  //         setResumeStatus(response.data);
  //         setShowResumeModal(true);
  //       }
  //     } catch (error) {
  //       // No existing application found or error, continue with fresh start
  //       console.log("No existing application to resume");
  //     }
  //   };

  //   const storedLoanId = localStorage.getItem("loanId");
  //   if (storedLoanId) {
  //     checkExistingApplication(storedLoanId);
  //   }
  // }, [getCurrentStatus]);

  const handleResumeApplication = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!resumeEmail) {
      setModal({
        open: true,
        message: "Please enter your email address to resume your application.",
        title: "Email Required",
      });
      return;
    }

    if (!emailRegex.test(resumeEmail)) {
      setModal({
        open: true,
        message: "Please enter a valid email address.",
        title: "Invalid Email",
      });
      return;
    }

    try {
      const response = await getCurrentStatus({ email: resumeEmail }).unwrap();
      console.log("Resume application response:", response);
      if (response.success && response.data) {
        console.log("Current step:", response.data.currentStep);
        console.log("Step number:", response.data.stepNumber);
        setResumeStatus(response.data);
        localStorage.setItem("loanId", response.data.loanId);
        setShowResumeModal(true);
        setShowResumeForm(false);
      } else {
        setModal({
          open: true,
          message:
            "No application found with this email. Please start a new application.",
          title: "Application Not Found",
        });
      }
    } catch (error) {
      console.log("Error fetching application status:", error);
      setModal({
        open: true,
        message:
          "Unable to find your application. Please try again or start a new application.",
        title: "Error",
      });
    }
  };

  const handleProceedWithActiveApp = async () => {
    try {
      const response = await getCurrentStatus({ email }).unwrap();
      if (response.success && response.data) {
        setResumeStatus(response.data);
        localStorage.setItem("loanId", response.data.loanId);
        setActiveAppModal({ open: false, message: "" });
        setShowResumeModal(true);
      } else {
        setActiveAppModal({ open: false, message: "" });
        setModal({
          open: true,
          message: "Unable to retrieve your application. Please try again.",
          title: "Error",
        });
      }
    } catch {
      setActiveAppModal({ open: false, message: "" });
      setModal({
        open: true,
        message: "Unable to retrieve your application. Please try again.",
        title: "Error",
      });
    }
  };

  const navigateToStep = (stepNumber: number) => {
    const stepRoutes: { [key: number]: string } = {
      1: "/apply",
      2: "/statement-review",
      3: "/personal-details",
      4: "/loan-application",
      5: "/personal-details",
      6: "/confirmation",
    };
    window.location.href = stepRoutes[stepNumber] || "/apply";
  };

  const isAnyLoading =
    isLoading ||
    loadingState ||
    verifyLoading ||
    resendLoading ||
    verifyResendLoading ||
    statusLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !phoneNumber) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      return;
    }

    // Show consent modal if not yet accepted
    if (!consentAccepted) {
      setShowConsentModal(true);
      return;
    }

    const [dobYear, dobMonth, dobDay] = dob.split("-").map(Number);
    const dobDate = new Date(dobYear, dobMonth - 1, dobDay);
    if (!dob || Number.isNaN(dobDate.getTime())) {
      setModal({
        open: true,
        message: "Please enter a valid date of birth.",
        title: "Invalid Date of Birth",
      });
      return;
    }

    setLoadingState(true);

    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      setModal({
        open: true,
        message: "You must be at least 18 years old to apply for a loan.",
        title: "Age Requirement",
      });
      setLoadingState(false);
      return;
    }

    try {
      const response = await onboarding1({
        email,
        firstName,
        lastName,
        phoneNumber,
        productId: PRODUCT_ID,
      }).unwrap();

      if (response.success) {
        setLoanId(response?.data?.loanId);
        localStorage.setItem("loanId", response?.data?.loanId || "");
        setModal({
          open: true,
          message:
            response?.message ||
            "Success! Please check your email for the OTP.",
          title: "Onboarding Success",
        });
        setLoadingState(false);
        setIsOTP(true);
      }
    } catch (error: unknown) {
      
      setLoadingState(false);
      const errData = (error as { data?: { message?: string } })?.data;
      const errMsg = errData?.message ?? "";
      if (errMsg.toLowerCase().includes("active application")) {
        setActiveAppModal({ open: true, message: errMsg });
      } else {
        setResendOTP(true);
        setOtp("");
        setModal({
          open: true,
          message: errMsg || "An error occurred during onboarding. Please try again.",
          title: "Onboarding Error",
        });
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        title: "Invalid OTP",
      });
      return;
    }

    const response = await verifyOtp({ loanId, otp });

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
      setModal({
        open: true,
        message:
          (response?.error &&
            typeof response.error === "object" &&
            "data" in response.error &&
            (response.error as { data?: { message?: string } })?.data
              ?.message) ||
          "OTP verification failed.",
        title: "Error",
      });
    }
  };

  const handleResendOTP = async () => {
    const storedLoanId = localStorage.getItem("loanId") || "";
    try {
      const response = await resendEmailOtp({ loanId: storedLoanId }).unwrap();
      if (response?.success) {
        setResendOTP(false);
        setIsOTP(true);
        setOtpVerified(false);
        setModal({
          open: true,
          message:
            response.message ||
            "OTP resent successfully. Please check your email.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message:
            response.message || "Failed to resend OTP. Please try again.",
          title: "Resend Failed",
        });
      }
    } catch (error) {
      setModal({
        open: true,
        message:
          resendData?.message || "Error resending OTP. Please try again.",
        title: "Resend Error",
      });
    }
  };
  const applicantName = `${firstName} ${lastName}`.trim();

  return (
    <>
      <PageShell
        step={1}
        headerAction={
          showResumeForm
            ? undefined
            : { label: "Resume application", onClick: () => setShowResumeForm(true) }
        }
        aside={
          <Receipt
            rows={[
              { label: "Applicant", value: applicantName || undefined },
              { label: "Email", value: email || undefined },
              { label: "Phone", value: phoneNumber || undefined },
              { label: "Date of birth", value: dob ? formatDob(dob) : undefined },
            ]}
            footer="Everything you enter is encrypted and only read by the team underwriting this application."
          />
        }
      >
        <Sheet>
          <SheetTitle
            title={showResumeForm ? "Pick up where you left off" : "Let's get you started"}
            subtitle={
              showResumeForm
                ? "Enter the email you applied with and we'll find your application."
                : "Five short steps. We check your bank account, confirm who you are, and show you exactly what you'd repay before you commit to anything."
            }
          />

          <form
            onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "22px", flexGrow: 1 }}
          >
            {showResumeForm ? (
              <>
                <Field
                  label="Email address"
                  inputType="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your registered email"
                  value={resumeEmail}
                  onChange={setResumeEmail}
                  icon={Mail}
                  hint="We'll look up the application filed under this address."
                />
                <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
                  <SecondaryButton
                    icon={ArrowLeft}
                    onClick={() => {
                      setShowResumeForm(false);
                      setResumeEmail("");
                    }}
                  >
                    Back
                  </SecondaryButton>
                  <div style={{ flexGrow: 1 }}>
                    <PrimaryButton
                      onClick={handleResumeApplication}
                      loading={statusLoading}
                      disabled={!resumeEmail}
                    >
                      {statusLoading ? "Finding your application" : "Resume"}
                    </PrimaryButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <FieldRow>
                  <Field
                    label="First name"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={setFirstName}
                    icon={User}
                  />
                  <Field
                    label="Last name"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={setLastName}
                    icon={User}
                  />
                </FieldRow>

                <FieldRow>
                  <Field
                    label="Email address"
                    inputType="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                    hint="We send your offer letter here."
                  />
                  <Field
                    label="Phone number"
                    inputType="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    icon={Phone}
                    maxLength={11}
                    hint="Used for one-time codes only."
                  />
                </FieldRow>

                <Field
                  label="Date of birth"
                  inputType="date"
                  value={dob}
                  onChange={setDob}
                  icon={Calendar}
                  hint="You must be 18 or older to apply."
                  inputAttrs={{ max: toDateInputValue(new Date()), required: true }}
                />

                {isOTP && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <OtpInput
                      label="Enter the code we emailed you"
                      value={otp}
                      onChange={setOtp}
                      hint={`Sent to ${email || "your email address"}.`}
                      action={
                        resendOTP
                          ? {
                              label: resendLoading ? "Resending..." : "Resend code",
                              onClick: handleResendOTP,
                              disabled: resendLoading,
                            }
                          : undefined
                      }
                    />
                  </motion.div>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <PrimaryButton submit loading={isAnyLoading} icon={ArrowRight}>
                    {isAnyLoading ? "Processing" : isOTP ? "Verify code" : "Get started"}
                  </PrimaryButton>
                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                      font: `400 12px/1.5 ${type.body}`,
                      color: colors.text.secondary,
                    }}
                  >
                    Checking your eligibility does not affect your credit score.
                  </p>
                </div>
              </>
            )}
          </form>
        </Sheet>
      </PageShell>
      {/* Consent Modal */}
      <ConsentModal
        open={showConsentModal}
        onAccept={() => {
          setShowConsentModal(false);
          setConsentAccepted(true);
          // Trigger form submission after consent
          const form = document.querySelector("form");
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
          }
        }}
      />

      {/* Modal */}
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
        onAction={() => {
          if (otpVerified) {
            window.location.href = "/statement-review";
          } else {
            setModal({ ...modal, open: false });
          }
        }}
      />

      {/* Resume Application Modal */}
      <ResumeApplicationModal
        open={showResumeModal}
        statusData={resumeStatus}
        onContinue={() => {
          if (resumeStatus) {
            console.log("currentStep value:", resumeStatus.currentStep);
            console.log("stepNumber value:", resumeStatus.stepNumber);

            // Navigate to currentStep (the step user needs to complete)
            const stepToNavigate = resumeStatus.currentStep;
            console.log("Navigating to step:", stepToNavigate);

            // Step 1 is this same page, so stay put, pre-fill the
            // fields with the resumed application's data, and drop the
            // user straight into the OTP screen so they can resend and
            // verify instead of resubmitting the whole form.
            if (stepToNavigate === 1) {
              setEmail(resumeStatus.email || "");
              setFirstName(resumeStatus.firstName || "");
              setLastName(resumeStatus.lastName || "");
              setLoanId(resumeStatus.loanId || "");
              localStorage.setItem("loanId", resumeStatus.loanId || "");
              setIsOTP(true);
              setResendOTP(true);
              setShowResumeModal(false);
              return;
            }

            // If navigating to step 4 (loan application), ensure maxLoanEligible is set
            if (
              stepToNavigate === 4 &&
              !localStorage.getItem("maxLoanEligible")
            ) {
              // Set a default high value if not available from API
              localStorage.setItem("maxLoanEligible", "1000000");
              console.log("Set default maxLoanEligible for step 4");
            }

            navigateToStep(stepToNavigate);
          }
        }}
        onStartNew={() => {
          localStorage.removeItem("loanId");
          setShowResumeModal(false);
          setResumeStatus(null);
        }}
        onClose={() => setShowResumeModal(false)}
      />

      {/* Active Application Modal */}
      <AnimatePresence>
        {activeAppModal.open && (
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
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "32px",
                maxWidth: "420px",
                width: "100%",
                boxShadow: shadows.xl,
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
                  marginBottom: "16px",
                }}
              >
                <RotateCcw size={24} color={colors.primary[600]} />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: colors.neutral[900],
                  marginBottom: "8px",
                }}
              >
                Active Application Found
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: colors.neutral[600],
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {activeAppModal.message}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  onClick={handleProceedWithActiveApp}
                  disabled={statusLoading}
                  style={{
                    ...styles.button,
                    opacity: statusLoading ? 0.7 : 1,
                    cursor: statusLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {statusLoading ? (
                    <>
                      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={18} />
                      Proceed with Application
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveAppModal({ open: false, message: "" })}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: `2px solid ${colors.neutral[200]}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: "#fff",
                    color: colors.neutral[700],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Start a New One
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default LoginPage;
