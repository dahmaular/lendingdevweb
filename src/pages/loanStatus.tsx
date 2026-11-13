import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Circle,
  FileSearch,
  Mail,
  Wallet,
} from "lucide-react";
import {
  CurrentStatusData,
  useGetCurrentStatusMutation,
  useLazyGetLoanStatusQuery,
  useRequestResumeOtpMutation,
} from "../store/services/baseApi";
import {
  Callout,
  Field,
  OtpInput,
  PageShell,
  PrimaryButton,
  Receipt,
  SectionLabel,
  Sheet,
  SheetTitle,
  TextButton,
} from "../components/chrome";
import type { ReceiptRow } from "../components/chrome";
import { brand, colors, radii, type } from "../theme";
import { formatCurrency, quote } from "../lending";
import { saveEligibility } from "../eligibility";
import {
  DEAD_CODE_MESSAGE,
  RESUME_CODE_TTL_MS,
  RESUME_RESEND_COOLDOWN_MS,
  RESUME_ROUTES,
  canContinue,
  errorMessage,
  formatCountdown,
} from "../resume";
import {
  LoanStatus as LoanState,
  OnboardingStep,
  RepaymentStatus,
} from "../types/loanApplication";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (iso?: string): string | undefined => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** The soft gold bar used for both application and repayment progress. */
const ProgressBar: React.FC<{ fraction: number }> = ({ fraction }) => (
  <div
    style={{
      height: "10px",
      borderRadius: "999px",
      background: brand.wash,
      border: `1px solid ${colors.border.light}`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.min(100, Math.max(0, fraction * 100))}%`,
        height: "100%",
        background: brand.gold,
        transition: "width 300ms ease",
      }}
    />
  </div>
);

/** One milestone row: done gets a filled check, pending a hollow circle. */
const Milestone: React.FC<{ label: string; at?: string; last?: boolean }> = ({
  label,
  at,
  last,
}) => {
  const done = !!at;
  const when = formatDate(at);
  return (
    <div style={{ display: "flex", gap: "14px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {done ? (
          <CheckCircle2 size={20} strokeWidth={1.8} color={colors.primary.main} />
        ) : (
          <Circle size={20} strokeWidth={1.6} color={colors.text.muted} />
        )}
        {!last && (
          <span
            style={{
              width: "1px",
              flexGrow: 1,
              minHeight: "14px",
              background: colors.border.light,
              marginTop: "4px",
              marginBottom: "4px",
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: last ? 0 : "14px" }}>
        <span
          style={{
            font: `600 14px/1.3 ${type.body}`,
            color: done ? colors.text.primary : colors.text.muted,
          }}
        >
          {label}
        </span>
        <span style={{ font: `400 12px/1.3 ${type.body}`, color: colors.text.secondary }}>
          {when ?? "Not yet"}
        </span>
      </div>
    </div>
  );
};

/** A small state pill — "Disbursed", "Overdue", "Completed". */
const Chip: React.FC<{ label: string; tone?: "neutral" | "success" | "error" }> = ({
  label,
  tone = "neutral",
}) => {
  const palette = {
    neutral: { bg: brand.wash, fg: colors.text.primary, border: colors.border.light },
    success: { bg: colors.status.successLight, fg: colors.status.success, border: "#C6DACC" },
    error: { bg: "#F8E9E6", fg: colors.status.error, border: "#E4C4BD" },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: "999px",
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        font: `600 12px/1 ${type.body}`,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: palette.fg,
      }}
    >
      {label}
    </span>
  );
};

/** A label/figure pair in the loan breakdown grid. */
const Figure: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      padding: "14px 16px",
      background: "#FFFFFF",
      border: `1px solid ${colors.border.light}`,
      borderRadius: `${radii.md}px`,
      minWidth: "140px",
      flexGrow: 1,
    }}
  >
    <span
      style={{
        font: `500 11px/1 ${type.body}`,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: colors.text.muted,
      }}
    >
      {label}
    </span>
    <span style={{ font: `700 18px/1.2 ${type.display}`, color: colors.text.primary }}>
      {value}
    </span>
  </div>
);

type Stage = "email" | "code" | "status";

const LoanStatus: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  // When the latest code was requested; null until one has been.
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [status, setStatus] = useState<CurrentStatusData | null>(null);

  const [requestResumeOtp, { isLoading: sendingCode }] =
    useRequestResumeOtpMutation();
  const [getCurrentStatus, { isLoading: checkingCode }] =
    useGetCurrentStatusMutation();
  const [
    fetchLoanStatus,
    {
      data: loanStatusResponse,
      isFetching: loanLoading,
      originalArgs: loanStatusArgs,
    },
  ] = useLazyGetLoanStatusQuery();

  // The loan's own record; undefined until the fetch lands, and stays
  // undefined if the backend has nothing (the page then falls back to what
  // current-step said). Matched on the email it was fetched for, so a second
  // lookup in the same session never shows the previous borrower's figures.
  const loanDetail =
    loanStatusResponse?.success && loanStatusArgs?.email === email
      ? loanStatusResponse.data
      : undefined;

  // Tick once a second while a code is out, for the countdown and the
  // resend cooldown.
  useEffect(() => {
    if (codeSentAt === null || stage !== "code") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [codeSentAt, stage]);

  const codeLeft = codeSentAt !== null ? codeSentAt + RESUME_CODE_TTL_MS - now : 0;
  const resendWait =
    codeSentAt !== null ? codeSentAt + RESUME_RESEND_COOLDOWN_MS - now : 0;

  // The reply is the same whether or not an application exists, so this
  // screen never says which.
  const sendCode = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    try {
      await requestResumeOtp({ email }).unwrap();
      setOtp("");
      setCodeSentAt(Date.now());
      setNow(Date.now());
      setStage("code");
    } catch (err) {
      setError(errorMessage(err) || "Something went wrong. Please try again.");
    }
  };

  const checkStatus = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    try {
      const response = await getCurrentStatus({ email, otp }).unwrap();
      if (response.success && response.data) {
        setStatus(response.data);
        setStage("status");
        setCodeSentAt(null);
        setOtp("");
        // The OTP just proved this email, and current-step minted a token
        // for the loan lookup; a failure (or an older backend that sends no
        // token) leaves the page on current-step's story.
        if (response.data.statusToken) {
          fetchLoanStatus({ email, statusToken: response.data.statusToken });
        }
      } else {
        setError(response.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      const message =
        errorMessage(err) || "Something went wrong. Please try again.";
      setError(message);
      // A locked, expired or spent code can't be retried — clear it so the
      // next step is plainly "Resend code".
      if (DEAD_CODE_MESSAGE.test(message)) setOtp("");
    }
  };

  const continueApplication = () => {
    if (!status || !canContinue(status)) return;
    localStorage.setItem("loanId", status.loanId);
    saveEligibility(status);
    const step = status.currentStep as OnboardingStep;
    // EmailSent continues on the apply page itself, through its resume form.
    window.location.href =
      step === OnboardingStep.EmailSent
        ? "/apply?resume=1"
        : RESUME_ROUTES[step] || "/apply";
  };

  // The loan figures, from the loan's own record, with the standard pricing
  // filling any figure the backend left out. Before step4 the record exists
  // but has no amount — treated the same as no record.
  const loan = useMemo(() => {
    if (!loanDetail || !loanDetail.amount) return null;
    const q = loanDetail.tenorInMonths
      ? quote(loanDetail.amount, loanDetail.tenorInMonths)
      : null;
    const monthly = loanDetail.monthlyRepayment ?? q?.monthlyPayment;
    const total = loanDetail.totalRepayment ?? q?.totalRepayment;
    const repaid = loanDetail.amountPaid;
    const outstanding = loanDetail.amountPending;
    const paymentsLeft =
      outstanding > 0 && monthly ? Math.ceil(outstanding / monthly) : undefined;
    return {
      principal: loanDetail.amount,
      months: loanDetail.tenorInMonths,
      monthly,
      total,
      repaid,
      outstanding,
      paymentsLeft,
    };
  }, [loanDetail]);

  // Repayment figures only mean something once money has moved.
  const repaying =
    !!loanDetail &&
    (loanDetail.status === LoanState.Disbursed ||
      loanDetail.status === LoanState.Repaid ||
      loanDetail.status === LoanState.Overdue ||
      loanDetail.repaymentStatus !== undefined);

  const loanSubmitted =
    !!status &&
    (!!status.loanSubmittedAt ||
      status.isCompleted ||
      status.currentStep >= OnboardingStep.LoanSubmitted);

  // The backend reports 100% before the borrower is done, so only
  // isCompleted may show a full bar.
  const progress = status
    ? status.isCompleted
      ? 100
      : Math.min(status.progressPercentage, 99)
    : 0;

  const receiptRows: ReceiptRow[] = status
    ? [
        { label: "Name", value: `${status.firstName} ${status.lastName}`.trim() || undefined },
        { label: "Email", value: status.email },
        { label: "Product", value: status.productName },
        { label: "Lender", value: status.companyName },
        { label: "Started", value: formatDate(status.createdAt) },
        { label: "Loan submitted", value: formatDate(status.loanSubmittedAt) },
      ]
    : [];

  const receiptTotal =
    loan && repaying
      ? { label: "Left to repay", value: formatCurrency(loan.outstanding) }
      : loan?.total !== undefined
      ? { label: "Total repayment", value: formatCurrency(loan.total) }
      : undefined;

  return (
    <PageShell
      headerAction={{ label: "Back to home", onClick: () => navigate("/") }}
      showHelp
      aside={
        stage === "status" ? (
          <Receipt
            title="Your application"
            rows={receiptRows}
            total={receiptTotal}
            footer="Only you can see this — it takes the code from your email every time."
          />
        ) : undefined
      }
    >
      <Sheet style={{ maxWidth: stage === "status" ? undefined : "560px" }}>
        {stage === "email" && (
          <>
            <SheetTitle
              title="Check on your loan"
              subtitle="Enter the email you applied with and we'll send a 6-digit code. Your application status, loan breakdown and balance are only ever shown to you."
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendCode();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "26px" }}
            >
              <Field
                label="Email address"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setError("");
                }}
                placeholder="you@example.com"
                icon={Mail}
                inputType="email"
                inputMode="email"
                autoComplete="email"
                error={error || undefined}
              />
              <PrimaryButton submit loading={sendingCode} icon={ArrowRight}>
                Email me a code
              </PrimaryButton>
            </form>
            <TextButton icon={ArrowLeft} onClick={() => navigate("/")}>
              Back to home
            </TextButton>
          </>
        )}

        {stage === "code" && (
          <>
            <SheetTitle
              title="Enter your code"
              subtitle={`If an application exists for ${email}, a 6-digit code is on its way to that inbox.`}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                checkStatus();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "26px" }}
            >
              <OtpInput
                label="Verification code"
                value={otp}
                onChange={(v) => {
                  setOtp(v);
                  setError("");
                }}
                error={error || undefined}
                hint={
                  codeLeft > 0
                    ? `The code expires in ${formatCountdown(codeLeft)}.`
                    : "That code has expired — send a new one."
                }
                action={{
                  label:
                    resendWait > 0
                      ? `Resend in ${formatCountdown(resendWait)}`
                      : "Resend code",
                  onClick: sendCode,
                  disabled: resendWait > 0 || sendingCode,
                }}
              />
              <PrimaryButton
                submit
                loading={checkingCode}
                disabled={otp.length !== 6 || codeLeft <= 0}
                icon={ArrowRight}
              >
                View my status
              </PrimaryButton>
            </form>
            <TextButton
              icon={ArrowLeft}
              onClick={() => {
                setStage("email");
                setOtp("");
                setError("");
                setCodeSentAt(null);
              }}
            >
              Use a different email
            </TextButton>
          </>
        )}

        {stage === "status" && status && (
          <>
            <SheetTitle
              title={`Hello, ${status.firstName || "there"}`}
              subtitle={
                status.isCompleted
                  ? "Your application is complete. Here's where your loan stands."
                  : `You're on step ${status.stepNumber} of ${status.totalSteps}: ${status.currentStepName}.`
              }
            />

            <SectionLabel icon={FileSearch}>Application progress</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <ProgressBar fraction={progress / 100} />
              <span style={{ font: `500 13px/1 ${type.body}`, color: colors.text.secondary }}>
                {progress}% complete
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <Milestone label="Application started" at={status.createdAt} />
              <Milestone label="Email verified" at={status.emailVerifiedAt} />
              <Milestone label="BVN verified" at={status.bvnVerifiedAt} />
              <Milestone label="Bank account connected" at={status.bankVerifiedAt} />
              <Milestone label="Documents uploaded" at={status.documentsUploadedAt} />
              <Milestone label="Loan submitted" at={status.loanSubmittedAt} last />
            </div>

            {!status.isCompleted && (
              <Callout icon={CalendarClock} title={`Next: ${status.nextStepName}`}>
                {status.nextStepDescription}
                {status.requiredActions?.length > 0 && (
                  <ul style={{ margin: "8px 0 0", paddingLeft: "18px" }}>
                    {status.requiredActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                )}
              </Callout>
            )}

            {status.isCompleted && (
              <Callout
                icon={BadgeCheck}
                tone="success"
                title="All steps are done"
              >
                Your repayments are collected by direct debit from the account
                you connected — there's nothing you need to do.
              </Callout>
            )}

            {canContinue(status) && (
              <PrimaryButton onClick={continueApplication} icon={ArrowRight}>
                Continue my application
              </PrimaryButton>
            )}

            <SectionLabel icon={Wallet}>Your loan</SectionLabel>

            {loanDetail && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Chip
                  label={loanDetail.statusDisplay}
                  tone={
                    loanDetail.status === LoanState.Repaid
                      ? "success"
                      : loanDetail.status === LoanState.Overdue ||
                        loanDetail.status === LoanState.Rejected
                      ? "error"
                      : "neutral"
                  }
                />
                {loanDetail.repaymentStatusDisplay && (
                  <Chip
                    label={`Repayment ${loanDetail.repaymentStatusDisplay}`}
                    tone={
                      loanDetail.repaymentStatus === RepaymentStatus.Completed
                        ? "success"
                        : loanDetail.repaymentStatus === RepaymentStatus.Overdue
                        ? "error"
                        : "neutral"
                    }
                  />
                )}
              </div>
            )}

            {loan && loanDetail ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Figure label="Loan amount" value={formatCurrency(loan.principal)} />
                  <Figure
                    label="Duration"
                    value={`${loan.months} month${loan.months > 1 ? "s" : ""}`}
                  />
                  {loanDetail.disbursementAmount !== undefined && (
                    <Figure
                      label="Paid out to you"
                      value={formatCurrency(loanDetail.disbursementAmount)}
                    />
                  )}
                  {loan.monthly !== undefined && (
                    <Figure label="Monthly repayment" value={formatCurrency(loan.monthly)} />
                  )}
                  {loan.total !== undefined && (
                    <Figure label="Total repayment" value={formatCurrency(loan.total)} />
                  )}
                  {loanDetail.dueDate && (
                    <Figure label="Final due date" value={formatDate(loanDetail.dueDate)} />
                  )}
                </div>

                {repaying && loan.total !== undefined && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <ProgressBar fraction={loan.total > 0 ? loan.repaid / loan.total : 0} />
                    <span
                      style={{ font: `500 13px/1.45 ${type.body}`, color: colors.text.secondary }}
                    >
                      You've repaid {formatCurrency(loan.repaid)} of{" "}
                      {formatCurrency(loan.total)} —{" "}
                      {formatCurrency(loan.outstanding)} left
                      {loan.paymentsLeft !== undefined &&
                        `, about ${loan.paymentsLeft} payment${
                          loan.paymentsLeft === 1 ? "" : "s"
                        } to go`}
                      .
                      {loanDetail.lastPaymentAt &&
                        ` Last payment ${formatDate(loanDetail.lastPaymentAt)}.`}
                    </span>
                  </div>
                )}

                {loanDetail.status === LoanState.Repaid ||
                loanDetail.repaymentStatus === RepaymentStatus.Completed ? (
                  <Callout icon={BadgeCheck} tone="success" title="Fully repaid">
                    This loan is settled — there's nothing left to pay.
                  </Callout>
                ) : loanDetail.status === LoanState.Overdue ||
                  loanDetail.repaymentStatus === RepaymentStatus.Overdue ? (
                  <Callout icon={CalendarClock} tone="error" title="Repayment overdue">
                    A scheduled collection could not be completed. Please make
                    sure the account you connected is funded so the direct
                    debit can catch up.
                  </Callout>
                ) : loanDetail.status === LoanState.Rejected ? (
                  <Callout icon={CalendarClock} tone="error" title="Application declined">
                    This application was declined
                    {loanDetail.rejectedAt ? ` on ${formatDate(loanDetail.rejectedAt)}` : ""}.
                  </Callout>
                ) : loanDetail.status === LoanState.Cancelled ? (
                  <Callout icon={Wallet} title="Loan cancelled">
                    This loan was cancelled and no repayments are being
                    collected.
                  </Callout>
                ) : repaying ? (
                  <Callout icon={CalendarClock} title="Collected by direct debit">
                    Repayments come out of the account you connected
                    automatically
                    {loanDetail.dueDate &&
                      `, with everything settled by ${formatDate(loanDetail.dueDate)}`}
                    . You don't need to do anything.
                  </Callout>
                ) : (
                  <Callout icon={Wallet} title="Awaiting disbursement">
                    Your loan is approved and being prepared for payout.
                    Repayment tracking starts once the money is sent.
                  </Callout>
                )}
              </>
            ) : loanLoading ? (
              <Callout icon={Wallet} title="Fetching your loan details">
                One moment — pulling up your balance and repayments.
              </Callout>
            ) : loanSubmitted ? (
              <Callout icon={Wallet} title="Your loan is being processed">
                {status.companyName
                  ? `Your loan is with ${status.companyName}. `
                  : ""}
                The full breakdown and your remaining balance will appear here
                once your offer is finalised.
              </Callout>
            ) : (
              <Callout icon={Wallet} title="No loan yet">
                You choose your loan amount and duration at the last step of
                the application — finish the steps above and your breakdown
                will appear here.
              </Callout>
            )}

            <TextButton
              icon={ArrowLeft}
              onClick={() => {
                setStage("email");
                setStatus(null);
                setEmail("");
              }}
            >
              Check a different application
            </TextButton>
          </>
        )}
      </Sheet>
    </PageShell>
  );
};

export default LoanStatus;
