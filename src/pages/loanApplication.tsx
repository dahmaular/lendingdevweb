import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  X,
} from "lucide-react";
import { useSubmitLoanMutation } from "../store/services/baseApi";
import { MONO_COMPLETE_MESSAGE } from "./monoComplete";
import { brand, colors, radii, shadows, type } from "../theme";
import {
  Callout,
  PageShell,
  PrimaryButton,
  Receipt,
  SecondaryButton,
  Sheet,
  SheetTitle,
} from "../components/chrome";

// ============== Loan Duration Options ==============
const LOAN_DURATIONS = [
  { value: 1, label: "1 Month" },
  { value: 2, label: "2 Months" },
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

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
  const [offerLetterAccepted, setOfferLetterAccepted] = useState(false);
  const [monoUrl, setMonoUrl] = useState<string>("");
  const [showMonoWebview, setShowMonoWebview] = useState(false);

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
      navigate("/apply");
    }
  }, [navigate]);

  // Listen for the Mono webview reaching our redirect page (`/mono/complete`).
  // When the mandate flow finishes, that page posts a message from inside the
  // iframe; we close the webview and continue to the confirmation screen.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only trust messages from our own origin (the redirect page is same-origin).
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== MONO_COMPLETE_MESSAGE) return;

      setShowMonoWebview(false);
      navigate("/confirmation");
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  // Any existing mandate URL was generated for a specific amount/tenor. If the
  // user changes either, invalidate it so the next submit re-runs step4 with the
  // new figures instead of reopening a stale mandate.
  useEffect(() => {
    setMonoUrl("");
  }, [loanAmount, duration]);

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

  // Manually closing the webview is a cancellation, NOT a success — the
  // mandate wasn't completed, so keep the user on this page and tell them.
  const handleCloseMonoWebview = () => {
    setShowMonoWebview(false);
    setError(
      "Authorization was not completed. Please finish the mandate setup to submit your loan.",
    );
  };

  const handleSubmit = async () => {
    if (loanAmount < 5000) {
      setError("Minimum loan amount is ₦5,000");
      return;
    }

    // If we already generated a mandate URL (e.g. the user closed the webview
    // and is resuming), just reopen it instead of re-running step4.
    if (monoUrl) {
      setError("");
      setShowMonoWebview(true);
      return;
    }

    try {
      const loanId = localStorage.getItem("loanId");
      if (!loanId) {
        navigate("/apply");
        return;
      }

      const response = await submitLoan({
        loanId,
        loanAmount,
        tenor: duration,
        acceptOfferLetter: offerLetterAccepted,
        monoCustomerId: localStorage.getItem("monoCustomerId") || "",
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
          JSON.stringify(loanDetailsForConfirmation),
        );

        if (response.data?.monoUrl) {
          setMonoUrl(response.data.monoUrl);
          setShowMonoWebview(true);
        } else {
          navigate("/confirmation");
        }
      }
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const sliderPct =
    maxLoanAmount > 5000
      ? ((loanAmount - 5000) / (maxLoanAmount - 5000)) * 100
      : 0;

  return (
    <>
      <PageShell
        step={4}
        headerAction={{ label: "Back", onClick: () => navigate("/personal-details") }}
        aside={
          <Receipt
            title="Loan breakdown"
            rows={[
              { label: "Loan amount", value: formatCurrency(loanBreakdown.principal) },
              { label: "Duration", value: `${duration} month${duration > 1 ? "s" : ""}` },
              { label: "Interest rate", value: `${interestRate * 100}% per month` },
              { label: "Total interest", value: formatCurrency(loanBreakdown.totalInterest) },
              { label: "Processing fee (1%)", value: formatCurrency(loanBreakdown.processingFee) },
              { label: "Monthly payment", value: formatCurrency(loanBreakdown.monthlyPayment) },
            ]}
            total={{
              label: "Total repayment",
              value: formatCurrency(loanBreakdown.totalRepayment),
            }}
            footer="Figures update as you change the amount or duration."
          />
        }
      >
        <Sheet>
          <SheetTitle
            title="How much do you need?"
            subtitle="You're almost there — choose your loan amount and repayment duration. The numbers beside this update as you move the slider."
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "26px", flexGrow: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "24px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    font: `500 13px/1 ${type.body}`,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: colors.text.muted,
                  }}
                >
                  Loan amount
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                  <span
                    style={{
                      font: `600 clamp(24px, 3vw, 34px)/1 ${type.display}`,
                      color: colors.secondary.main,
                    }}
                  >
                    &#8358;
                  </span>
                  <input
                    // formatCurrency already prefixes the naira sign; the
                    // display sets it separately in gold, so strip it here.
                    value={inputValue.replace(/^[^0-9]+/, "")}
                    onChange={handleAmountChange}
                    inputMode="numeric"
                    aria-label="Loan amount"
                    placeholder="0"
                    style={{
                      width: `${Math.max(inputValue.replace(/^[^0-9]+/, "").length || 1, 6)}ch`,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: 0,
                      font: `700 clamp(40px, 6vw, 60px)/1 ${type.display}`,
                      letterSpacing: "-0.035em",
                      color: error ? colors.status.error : colors.text.primary,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "5px",
                  paddingBottom: "8px",
                }}
              >
                <span
                  style={{
                    font: `500 13px/1 ${type.body}`,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: colors.text.muted,
                  }}
                >
                  You can borrow up to
                </span>
                <span
                  style={{
                    font: `600 22px/1 ${type.display}`,
                    color: colors.text.primary,
                  }}
                >
                  {formatCurrency(maxLoanAmount)}
                </span>
              </div>
            </div>

            {error && (
              <Callout icon={AlertCircle} tone="error">
                {error}
              </Callout>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="range"
                min={5000}
                max={maxLoanAmount || 5000}
                step={1000}
                value={loanAmount}
                onChange={handleSliderChange}
                aria-label="Loan amount slider"
                className="dv-range"
                style={{
                  background: `linear-gradient(to right, ${brand.gold} 0%, ${brand.gold} ${sliderPct}%, ${colors.border.light} ${sliderPct}%, ${colors.border.light} 100%)`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  font: `500 13px/1 ${type.body}`,
                  color: colors.text.secondary,
                }}
              >
                <span>{formatCurrency(5000)}</span>
                <span>{formatCurrency(maxLoanAmount)}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>
                Repayment duration
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {LOAN_DURATIONS.map((option) => {
                  const active = option.value === duration;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDuration(option.value)}
                      style={{
                        flexGrow: 1,
                        minWidth: "76px",
                        height: "64px",
                        borderRadius: `${radii.lg - 2}px`,
                        border: active
                          ? `2px solid ${colors.primary.main}`
                          : `1px solid ${colors.border.light}`,
                        background: active ? brand.gold : "#FFFFFF",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2px",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          font: `700 20px/1 ${type.display}`,
                          color: colors.text.primary,
                        }}
                      >
                        {option.value}
                      </span>
                      <span
                        style={{
                          font: `500 11px/1 ${type.body}`,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: active ? colors.text.primary : colors.text.muted,
                        }}
                      >
                        {option.value === 1 ? "month" : "months"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Callout
              icon={Calendar}
              title={`You'll repay ${formatCurrency(
                loanBreakdown.monthlyPayment
              )} a month for ${duration} month${duration > 1 ? "s" : ""}`}
            >
              Collected by direct debit from the account you connected. Total repayment is{" "}
              {formatCurrency(loanBreakdown.totalRepayment)} — that is{" "}
              {formatCurrency(
                loanBreakdown.totalInterest + loanBreakdown.processingFee
              )}{" "}
              on top of what you borrow.
            </Callout>

            <label
              htmlFor="offerLetterAccept"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "18px 20px",
                background: "#FBF7EC",
                border: `1px solid ${colors.border.light}`,
                borderRadius: `${radii.lg - 2}px`,
                cursor: "pointer",
                userSelect: "none" as const,
              }}
            >
              <input
                type="checkbox"
                id="offerLetterAccept"
                checked={offerLetterAccepted}
                onChange={(e) => setOfferLetterAccepted(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  accentColor: colors.primary.main,
                  cursor: "pointer",
                  marginTop: "1px",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  font: `400 14px/1.6 ${type.body}`,
                  color: colors.text.primary,
                }}
              >
                <strong style={{ fontWeight: 600 }}>I accept the loan offer letter</strong> and
                agree to the terms and conditions outlined in the loan agreement. I understand
                the repayment schedule and all associated fees.
              </span>
            </label>

            <div style={{ marginTop: "auto", display: "flex", gap: "16px" }}>
              <SecondaryButton icon={ArrowLeft} onClick={() => navigate("/personal-details")}>
                Back
              </SecondaryButton>
              <div style={{ flexGrow: 1 }}>
                <PrimaryButton
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={loanAmount < 5000 || !offerLetterAccepted}
                  icon={ArrowRight}
                >
                  {isLoading ? "Submitting" : "Accept and continue"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Sheet>
      </PageShell>
      {showMonoWebview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: colors.background.card,
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              height: "min(720px, 90vh)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: shadows.lg,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: `1px solid ${colors.border.light}`,
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: colors.text.primary,
                  margin: 0,
                }}
              >
                Complete Authorization
              </h3>
              <button
                onClick={handleCloseMonoWebview}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close"
              >
                <X size={20} color={colors.text.muted} />
              </button>
            </div>
            <iframe
              src={monoUrl}
              title="Mono Authorization"
              style={{
                flex: 1,
                border: "none",
                width: "100%",
              }}
              allow="camera"
            />
          </motion.div>
        </motion.div>
      )}

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
    </>
  );
};

export default LoanApplication;
