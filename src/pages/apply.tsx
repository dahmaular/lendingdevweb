import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Mail,
  Calendar,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Shield,
  Clock,
  ChevronDown,
  Search,
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
  useLazyGetCurrentStatusQuery,
  CurrentStatusData,
} from "../store/services/baseApi";
import { EMPLOYERS } from "./personalDetails";
import Logo from "../assets/logo.jpeg";
import { colors, shadows } from "../theme";

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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
              style={{
                ...styles.button,
                width: "100%",
              }}
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

// Progress Steps Component
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

// Custom Select Component
interface SelectOption {
  id: string;
  name: string;
}

const ModernSelect: React.FC<{
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}> = ({ options, value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options.slice(0, 100);
    return options
      .filter((opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 100);
  }, [options, searchQuery]);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <label style={styles.label}>{label}</label>
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
          <Building2
            size={20}
            color={colors.neutral[400]}
            style={{ position: "absolute", left: "16px" }}
          />
          <span
            style={{
              color: selectedOption ? colors.neutral[900] : colors.neutral[400],
            }}
          >
            {selectedOption?.name || placeholder}
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
                  placeholder="Search employers..."
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
              {filteredOptions.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: colors.neutral[500],
                  }}
                >
                  No employers found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
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
                        value === option.id
                          ? colors.primary[50]
                          : "transparent",
                      borderLeft:
                        value === option.id
                          ? `3px solid ${colors.primary[500]}`
                          : "3px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.id) {
                        e.currentTarget.style.background = colors.neutral[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.id) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: colors.neutral[800],
                        wordBreak: "break-word",
                      }}
                    >
                      {option.name}
                    </span>
                    {value === option.id && (
                      <Check size={16} color={colors.primary[500]} />
                    )}
                  </div>
                ))
              )}
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

// Input Component
const ModernInput: React.FC<{
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  maxLength?: number;
  required?: boolean;
}> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  maxLength,
  required,
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
            transition: "color 0.2s ease",
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            ...(focused ? styles.inputFocused : {}),
          }}
        />
      </div>
    </div>
  );
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
  const [dob, setDob] = useState<Date>(eighteenYearsAgo);
  const [firstName, setFirstName] = useState<string>("");
  const [employer, setEmployer] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [loanId, setLoanId] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [showResumeForm, setShowResumeForm] = useState<boolean>(false);
  const [resumeEmail, setResumeEmail] = useState<string>("");
  const [resumeStatus, setResumeStatus] = useState<CurrentStatusData | null>(
    null
  );
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);

  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const [onboarding1, { isLoading }] = useOnboarding1Mutation();
  const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation();
  const [resendEmailOtp, { isLoading: resendLoading, data: resendData }] =
    useResendEmailOtpMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [verifyResendEmailOtp, { isLoading: verifyResendLoading }] =
    useVerifyResendEmailOtpMutation();
  const [getCurrentStatus, { isLoading: statusLoading }] =
    useLazyGetCurrentStatusQuery();

  // Check for existing application on mount
  useEffect(() => {
    const checkExistingApplication = async (storedLoanId: string) => {
      try {
        const response = await getCurrentStatus({
          loanId: storedLoanId,
        }).unwrap();
        if (response.success && response.data && !response.data.isCompleted) {
          setResumeStatus(response.data);
          setShowResumeModal(true);
        }
      } catch (error) {
        // No existing application found or error, continue with fresh start
        console.log("No existing application to resume");
      }
    };

    const storedLoanId = localStorage.getItem("loanId");
    if (storedLoanId) {
      checkExistingApplication(storedLoanId);
    }
  }, [getCurrentStatus]);

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
      if (response.success && response.data) {
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

  const navigateToStep = (stepNumber: number) => {
    const stepRoutes: { [key: number]: string } = {
      1: "/",
      2: "/statement-review",
      3: "/personal-details",
      4: "/loan-application",
      5: "/confirmation",
      6: "/confirmation",
    };
    window.location.href = stepRoutes[stepNumber] || "/";
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
    setLoadingState(true);

    if (!email || !firstName || !lastName) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      setLoadingState(false);
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
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
        employer,
        firstName,
        lastName,
        productId: "372e9a1d-c714-4fc2-b44a-3eeb8ebda4c1",
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
    } catch (error) {
      console.error("Error during onboarding:", error);
      setResendOTP(true);
      setOtp("");
      setModal({
        open: true,
        message: "An error occurred during onboarding. Please try again.",
        title: "Onboarding Error",
      });
      setLoadingState(false);
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

  const features = [
    {
      icon: Sparkles,
      title: "Quick Approval",
      description: "Get approved in minutes",
    },
    {
      icon: Shield,
      title: "Secure Process",
      description: "Bank-level encryption",
    },
    {
      icon: Clock,
      title: "Fast Disbursement",
      description: "Funds in 24 hours",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Left Panel - Hero Section */}
      <div
        style={{ ...styles.leftPanel, display: "none" }}
        className="left-panel-desktop"
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "400px", textAlign: "center", zIndex: 1 }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Financial Freedom Starts Here
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "48px",
              lineHeight: 1.6,
            }}
          >
            Access quick loans with competitive rates and flexible repayment
            options.
          </p>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              style={styles.featureCard}
            >
              <div style={styles.iconWrapper}>
                <feature.icon size={24} color="#fff" />
              </div>
              <div style={{ textAlign: "left" }}>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "14px",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel - Form Section */}
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
          {/* Header */}
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
              alt="Logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
            <button
              onClick={() => setShowResumeForm(true)}
              style={{
                background: "transparent",
                border: "none",
                color: colors.primary[600],
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Resume Application
            </button>
          </div>

          {/* Main Card */}
          <div style={styles.card}>
            <ProgressSteps currentStep={1} />

            <div style={{ marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: colors.neutral[900],
                  marginBottom: "8px",
                }}
              >
                {showResumeForm ? "Resume Your Application" : "Get Started"}
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: colors.neutral[500],
                }}
              >
                {showResumeForm
                  ? "Enter your email to continue where you left off."
                  : "Complete the form below to begin your loan application."}
              </p>
            </div>

            <form onSubmit={isOTP ? handleOTPSubmit : handleSubmit}>
              {showResumeForm ? (
                <div>
                  <ModernInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={resumeEmail}
                    onChange={(e) => setResumeEmail(e.target.value)}
                    icon={<Mail size={20} />}
                    required
                  />
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={handleResumeApplication}
                      disabled={statusLoading || !resumeEmail}
                      style={{
                        ...styles.button,
                        flex: 1,
                        opacity: statusLoading || !resumeEmail ? 0.7 : 1,
                        cursor:
                          statusLoading || !resumeEmail
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {statusLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                          Finding...
                        </>
                      ) : (
                        <>
                          Resume
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResumeForm(false)}
                      style={{
                        ...styles.button,
                        flex: 1,
                        background: colors.neutral[100],
                        color: colors.neutral[700],
                        boxShadow: "none",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ModernSelect
                    options={EMPLOYERS}
                    value={employer}
                    onChange={setEmployer}
                    placeholder="Select your employer"
                    label="Employer"
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <ModernInput
                      label="First Name"
                      type="text"
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      icon={<User size={20} />}
                      required
                    />
                    <ModernInput
                      label="Last Name"
                      type="text"
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      icon={<User size={20} />}
                      required
                    />
                  </div>

                  <ModernInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={20} />}
                    required
                  />

                  <ModernInput
                    label="Date of Birth"
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={dob.toISOString().split("T")[0]}
                    onChange={(e) => setDob(new Date(e.target.value))}
                    icon={<Calendar size={20} />}
                    required
                  />

                  {isOTP && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <ModernInput
                        label="Email OTP"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          if (
                            e.target.value.length <= 6 &&
                            /^\d*$/.test(e.target.value)
                          ) {
                            setOtp(e.target.value);
                          }
                        }}
                        icon={<KeyRound size={20} />}
                        maxLength={6}
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
                          className="animate-spin"
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isOTP ? "Verify OTP" : "Get Started"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Resume Application Section */}
                  {!isOTP && !showResumeForm && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: `1px solid ${colors.neutral[200]}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          color: colors.neutral[600],
                          marginBottom: "8px",
                        }}
                      >
                        Already started an application?
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowResumeForm(true)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: colors.primary[600],
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <RotateCcw size={14} />
                        Resume Application
                      </button>
                    </div>
                  )}

                  {/* Resume Form */}
                  {!isOTP && showResumeForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: `1px solid ${colors.neutral[200]}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: colors.neutral[700],
                          marginBottom: "12px",
                        }}
                      >
                        Resume your application
                      </p>
                      <ModernInput
                        label="Email Address"
                        type="email"
                        placeholder="Enter your registered email"
                        value={resumeEmail}
                        onChange={(e) => setResumeEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                      />
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowResumeForm(false);
                            setResumeEmail("");
                          }}
                          style={{
                            flex: 1,
                            padding: "12px 20px",
                            fontSize: "14px",
                            fontWeight: 600,
                            border: `2px solid ${colors.neutral[200]}`,
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: "#fff",
                            color: colors.neutral[700],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleResumeApplication}
                          disabled={statusLoading || !resumeEmail}
                          style={{
                            flex: 2,
                            padding: "12px 20px",
                            fontSize: "14px",
                            fontWeight: 600,
                            border: "none",
                            borderRadius: "12px",
                            cursor:
                              statusLoading || !resumeEmail
                                ? "not-allowed"
                                : "pointer",
                            background:
                              statusLoading || !resumeEmail
                                ? colors.neutral[300]
                                : `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          {statusLoading ? (
                            <>
                              <Loader2
                                size={16}
                                className="animate-spin"
                                style={{ animation: "spin 1s linear infinite" }}
                              />
                              Checking...
                            </>
                          ) : (
                            <>
                              Find Application
                              <Search size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </form>
          </div>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: colors.neutral[500],
            }}
          >
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              style={{ color: colors.primary[600], textDecoration: "none" }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              style={{ color: colors.primary[600], textDecoration: "none" }}
            >
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>

      {/* Modal */}
      <ModernModal
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
            navigateToStep(resumeStatus.stepNumber);
          }
        }}
        onStartNew={() => {
          localStorage.removeItem("loanId");
          setShowResumeModal(false);
          setResumeStatus(null);
        }}
        onClose={() => setShowResumeModal(false)}
      />

      {/* Global Styles for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (min-width: 1024px) {
          .left-panel-desktop {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
