import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Hash,
  Lock,
  Shield,
  Sparkles,
  User,
  LucideIcon,
} from "lucide-react";
import { brand, colors, controls, radii, shadows, type } from "../theme";
import { AppHeader, PrimaryButton, STEPS } from "../components/chrome";
import { useIsNarrow } from "../components/chrome/useMediaQuery";
import {
  LOAN_DURATIONS,
  MIN_LOAN_AMOUNT,
  formatCurrency,
  monthlyRatePercent,
  processingFeePercent,
  quote,
} from "../lending";

/**
 * The public landing page. The application flow lives at /apply.
 *
 * Every figure here is read from src/lending.ts, so the page cannot advertise a
 * rate the application does not charge. Everything else is drawn from copy that
 * already existed in the product. Facts nobody has given us — contact details,
 * the licence — are visible [PLACEHOLDERS] rather than invented.
 */

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Sparkles, title: "Quick Approval", description: "Get approved in minutes" },
  { icon: Shield, title: "Secure Process", description: "Bank-level encryption" },
  { icon: Clock, title: "Fast Disbursement", description: "Funds in 24 hours" },
];

const REQUIREMENTS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: User, title: "To be 18 or older", body: "We ask for your date of birth up front." },
  {
    icon: CreditCard,
    title: "A bank account in your name",
    body: "You connect it read-only so we can review six months of account history.",
  },
  {
    icon: Hash,
    title: "Your BVN",
    body: "It confirms your identity. It never lets us move money.",
  },
  {
    icon: Shield,
    title: "A valid ID document",
    body: "International Passport, National ID Card, Driver's License or Voter's Card.",
  },
];

// A worked example at a round figure, computed with the same function the loan
// screen uses — never typed out by hand.
const EXAMPLE_PRINCIPAL = 100000;
const EXAMPLE_MONTHS = 3;
const example = quote(EXAMPLE_PRINCIPAL, EXAMPLE_MONTHS);

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Can devpay take money out of my account?",
    a: (
      <>
        Two separate things, and it is worth being precise. The connection you make when we review
        your account is <strong>read-only</strong> &mdash; it cannot move money, and you can revoke
        it from your bank at any time. Repayment is collected by a{" "}
        <strong>direct debit mandate you authorise separately</strong> at the end of the
        application, for the amount and schedule shown to you before you accept.
      </>
    ),
  },
  {
    q: "How much can I borrow?",
    a: (
      <>
        From {formatCurrency(MIN_LOAN_AMOUNT)} up to a limit we assess from six months of your
        account history. You see your own limit before you choose an amount.
      </>
    ),
  },
  {
    q: "How long does a decision take?",
    a: "Your application is reviewed within 24 hours. We notify you by SMS and email, and once approved the loan is disbursed to the bank account you verified.",
  },
  {
    q: "Does applying affect my credit score?",
    a: "Checking your eligibility does not affect your credit score.",
  },
  {
    q: "I started an application and did not finish it.",
    a: 'Open the application and choose "Resume application" in the header. Enter the email you applied with and we will find it.',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const narrow = useIsNarrow();
  const apply = () => navigate("/apply");

  const section: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: narrow ? "22px" : "30px",
  };

  const eyebrow = (text: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span
        style={{
          font: `600 12px/1 ${type.body}`,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: colors.text.secondary,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <span style={{ height: "1px", flexGrow: 1, background: colors.border.light }} />
    </div>
  );

  const heading = (text: string) => (
    <h2
      style={{
        margin: 0,
        font: `700 clamp(26px, 3.6vw, 38px)/1.12 ${type.display}`,
        letterSpacing: "-0.03em",
        color: colors.text.primary,
        maxWidth: "20ch",
        textWrap: "balance",
      }}
    >
      {text}
    </h2>
  );

  const sheet: React.CSSProperties = {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: `${radii.lg}px`,
    boxShadow: narrow ? "3px 3px 0 #0B2621" : shadows.xl,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background.main,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <AppHeader action={{ label: "Apply now", onClick: apply }} />

      <main
        style={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "1120px",
          margin: "0 auto",
          padding: narrow ? "44px 20px 72px" : "76px 48px 104px",
          display: "flex",
          flexDirection: "column",
          gap: narrow ? "68px" : "104px",
        }}
      >
        {/* ------------------------------------------------------------ hero */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: "flex", flexDirection: "column", gap: "26px", maxWidth: "780px" }}
        >
          <h1
            style={{
              margin: 0,
              font: `700 clamp(40px, 7vw, 76px)/1.04 ${type.display}`,
              letterSpacing: "-0.035em",
              color: colors.text.primary,
              textWrap: "balance",
            }}
          >
            Financial Freedom Starts Here
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "46ch",
              font: `400 clamp(17px, 2vw, 20px)/1.55 ${type.body}`,
              color: colors.text.secondary,
              textWrap: "pretty",
            }}
          >
            Access quick loans with competitive rates and flexible repayment options.
          </p>

          <div style={{ display: "flex", marginTop: "6px" }}>
            <PrimaryButton fullWidth={narrow} icon={ArrowRight} onClick={apply}>
              Start your application
            </PrimaryButton>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <Lock size={16} strokeWidth={1.7} color={colors.secondary.main} />
            <span style={{ font: `400 13px/1.4 ${type.body}`, color: colors.text.secondary }}>
              Checking your eligibility does not affect your credit score.
            </span>
          </div>
        </motion.section>

        {/* -------------------------------------------------------- features */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: narrow ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: narrow ? "16px" : "24px",
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              style={{ ...sheet, padding: "28px 26px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: `${radii.md}px`,
                  background: colors.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} strokeWidth={1.7} color={brand.gold} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <h3
                  style={{
                    margin: 0,
                    font: `700 19px/1.2 ${type.display}`,
                    letterSpacing: "-0.015em",
                    color: colors.text.primary,
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, font: `400 15px/1.5 ${type.body}`, color: colors.text.secondary }}>
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </section>

        {/* ---------------------------------------------------- how it works */}
        <section style={section}>
          {eyebrow("How it works")}
          {heading("Five steps, start to finish")}

          <ol
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "grid",
              // five is a fixed count, and 190px tracks wrapped 4+1 at 1120px
              gridTemplateColumns: narrow ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))",
              gap: narrow ? "18px" : "24px",
            }}
          >
            {STEPS.map((step, i) => (
              <li key={step.name} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: "14px",
                    borderBottom: `2px solid ${i === 0 ? brand.gold : colors.border.light}`,
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      flexShrink: 0,
                      borderRadius: `${radii.sm + 2}px`,
                      background: i === 0 ? brand.gold : "transparent",
                      border: i === 0 ? "none" : `1.5px solid ${colors.border.light}`,
                      color: i === 0 ? colors.primary.main : colors.text.muted,
                      font: `700 14px/30px ${type.display}`,
                      textAlign: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      font: `600 15px/1.2 ${type.display}`,
                      letterSpacing: "-0.01em",
                      color: colors.text.primary,
                    }}
                  >
                    {step.name}
                  </span>
                </div>
                <p style={{ margin: 0, font: `400 14px/1.5 ${type.body}`, color: colors.text.secondary }}>
                  {step.sub}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ what it costs */}
        <section style={section}>
          {eyebrow("What it costs")}
          {heading("The whole cost, before you commit")}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: narrow ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
              gap: narrow ? "20px" : "32px",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { label: "Interest", value: `${monthlyRatePercent} per month`, note: "Charged on the amount you borrow." },
                { label: "Processing fee", value: `${processingFeePercent} of the loan`, note: "One-off, included in the figures you are shown." },
                { label: "Terms available", value: LOAN_DURATIONS.map((d) => d.value).join(", ") + " months", note: "You pick the term before you accept." },
                { label: "Minimum loan", value: formatCurrency(MIN_LOAN_AMOUNT), note: "Your maximum is assessed from your account history." },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    paddingBottom: "16px",
                    borderBottom: `1px dashed ${colors.border.light}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: "16px",
                    }}
                  >
                    <span style={{ font: `400 15px/1.3 ${type.body}`, color: colors.text.secondary }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        font: `700 18px/1.2 ${type.display}`,
                        color: colors.text.primary,
                        textAlign: "right",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                  <span style={{ font: `400 13px/1.45 ${type.body}`, color: colors.text.muted }}>
                    {row.note}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ ...sheet, padding: narrow ? "24px 20px" : "30px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{
                  font: `600 12px/1 ${type.body}`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: colors.text.muted,
                }}
              >
                For example
              </div>
              <p style={{ margin: 0, font: `400 15px/1.55 ${type.body}`, color: colors.text.secondary }}>
                Borrow {formatCurrency(EXAMPLE_PRINCIPAL)} over {EXAMPLE_MONTHS} months and this is
                the whole of it:
              </p>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  ["Amount borrowed", example.principal],
                  [`Interest (${monthlyRatePercent} × ${EXAMPLE_MONTHS} months)`, example.totalInterest],
                  [`Processing fee (${processingFeePercent})`, example.processingFee],
                  ["Monthly payment", example.monthlyPayment],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: "16px",
                      padding: "10px 0",
                      borderBottom: `1px dashed ${colors.border.light}`,
                    }}
                  >
                    <span style={{ font: `400 14px/1.3 ${type.body}`, color: colors.text.secondary }}>
                      {label}
                    </span>
                    <span style={{ font: `600 15px/1 ${type.display}`, color: colors.text.primary }}>
                      {formatCurrency(value as number)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: `${radii.md}px`,
                  background: colors.primary.main,
                  borderBottom: `4px solid ${brand.gold}`,
                }}
              >
                <span style={{ font: `600 14px/1 ${type.body}`, color: colors.background.main }}>
                  Total repayment
                </span>
                <span
                  style={{
                    font: `700 24px/1 ${type.display}`,
                    letterSpacing: "-0.02em",
                    color: brand.gold,
                  }}
                >
                  {formatCurrency(example.totalRepayment)}
                </span>
              </div>

              <p style={{ margin: 0, font: `400 12px/1.5 ${type.body}`, color: colors.text.muted }}>
                An illustration, not an offer. Your own figures are shown before you accept
                anything.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ what you'll need */}
        <section style={section}>
          {eyebrow("What you'll need")}
          {heading("Have these to hand")}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: narrow ? "1fr" : "repeat(2, minmax(0, 1fr))",
              gap: narrow ? "16px" : "20px 32px",
            }}
          >
            {REQUIREMENTS.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    borderRadius: `${radii.sm + 2}px`,
                    background: "#FBF7EC",
                    border: `1px solid ${colors.border.light}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} strokeWidth={1.7} color={colors.secondary.main} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ font: `600 15px/1.3 ${type.body}`, color: colors.text.primary }}>
                    {title}
                  </span>
                  <span style={{ font: `400 14px/1.5 ${type.body}`, color: colors.text.secondary }}>
                    {body}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- faq */}
        <section style={section}>
          {eyebrow("Questions")}
          {heading("Before you apply")}

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                style={{ borderBottom: `1px solid ${colors.border.light}`, padding: "18px 0" }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    minHeight: `${controls.minTapTarget}px`,
                    font: `600 17px/1.35 ${type.display}`,
                    letterSpacing: "-0.015em",
                    color: colors.text.primary,
                  }}
                >
                  {q}
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: `1.5px solid ${colors.border.light}`,
                      color: colors.secondary.main,
                      font: `600 15px/21px ${type.body}`,
                      textAlign: "center",
                    }}
                  >
                    +
                  </span>
                </summary>
                <p
                  style={{
                    margin: "12px 0 0",
                    maxWidth: "70ch",
                    font: `400 15px/1.6 ${type.body}`,
                    color: colors.text.secondary,
                  }}
                >
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- closing call */}
        <section
          style={{
            ...sheet,
            background: colors.primary.main,
            border: "none",
            boxShadow: "none",
            borderBottom: `5px solid ${brand.gold}`,
            padding: narrow ? "34px 24px" : "52px 48px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "26px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h2
              style={{
                margin: 0,
                font: `700 clamp(24px, 3.2vw, 34px)/1.15 ${type.display}`,
                letterSpacing: "-0.03em",
                color: colors.background.main,
                maxWidth: "18ch",
              }}
            >
              See what you qualify for
            </h2>
            <p
              style={{
                margin: 0,
                font: `400 15px/1.5 ${type.body}`,
                color: "rgba(246, 242, 232, 0.72)",
              }}
            >
              Five short steps, and no commitment until you accept the offer.
            </p>
          </div>

          <button
            type="button"
            onClick={apply}
            style={{
              height: "60px",
              padding: "0 30px",
              border: "none",
              borderRadius: `${radii.md}px`,
              background: brand.gold,
              color: colors.primary.main,
              font: `600 16px/1 ${type.display}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              flexGrow: narrow ? 1 : 0,
              justifyContent: "center",
            }}
          >
            Start your application
            <ArrowRight size={19} strokeWidth={2} />
          </button>
        </section>
      </main>

      {/* ----------------------------------------------------------- footer */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border.light}`,
          padding: narrow ? "28px 20px 40px" : "34px 48px 48px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px 40px",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "46ch" }}>
            <span style={{ font: `600 14px/1.3 ${type.body}`, color: colors.text.primary }}>
              Devtage Financial Services Limited
            </span>
            <span style={{ font: `400 13px/1.55 ${type.body}`, color: colors.text.secondary }}>
              [PLACEHOLDER: registered address, RC number and lending licence details go here.]
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ font: `600 14px/1.3 ${type.body}`, color: colors.text.primary }}>
              Contact
            </span>
            <span style={{ font: `400 13px/1.55 ${type.body}`, color: colors.text.secondary }}>
              [PLACEHOLDER: support email]
              <br />
              [PLACEHOLDER: support phone]
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <Check size={16} strokeWidth={2.2} color={colors.secondary.main} />
            <span style={{ font: `400 13px/1.4 ${type.body}`, color: colors.text.secondary }}>
              Your data is secured with bank-level encryption.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
