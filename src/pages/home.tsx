import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { useIsNarrow, useMediaQuery } from "../components/chrome/useMediaQuery";
import { MIN_LOAN_AMOUNT, formatCurrency } from "../lending";

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

/**
 * Hero slides. Each headline and line is copy that already existed in the
 * product — the first pair is the old hero panel, the second is the Get started
 * subtitle, the third is what the confirmation screen tells applicants. Nothing
 * here is a new claim.
 */
const SLIDES: { headline: string; body: string }[] = [
  {
    headline: "Financial Freedom Starts Here",
    body: "Access quick loans with competitive rates and flexible repayment options.",
  },
  {
    headline: "Get approved in minutes",
    body: "Five short steps. We check your bank account, confirm who you are, and show you exactly what you'd repay before you commit to anything.",
  },
  {
    headline: "Funds in 24 hours",
    body: "Your application is reviewed within 24 hours. Once approved, the loan is disbursed to the bank account you verified.",
  },
];

const SLIDE_INTERVAL_MS = 6500;

/**
 * The landing page sits on white; the application screens behind it stay on the
 * Ledger's warm paper (colors.background.main). A marketing page and a form are
 * doing different jobs, and this is a deliberate split rather than a drift.
 *
 * These three move together, and that is the point. The Ledger's card surface
 * (#FFFDF8) is a shade *warmer* than white: on paper it sits lighter than its
 * surroundings and reads as lifted, but on a white ground the relationship
 * inverts and the same card reads as a beige patch. So on white, surfaces are
 * white too and their separation comes from the 1px rule and the hard ink
 * offset — which was carrying most of it anyway.
 *
 * To put the page back on paper, set all three to colors.background.main,
 * colors.background.card and "#FBF7EC" respectively.
 */
const GROUND = "#FFFFFF";
const SURFACE = "#FFFFFF";
const TINT = "#FFFFFF";

/**
 * Container metrics, matched to fairmoney.io: a centred container capped at
 * 1400px with a 32px gutter. Measured off their `.container` — the same bound
 * their nav, hero and every section sit on.
 *
 * The effect is that on a laptop (~1440px) the page reads as near full width,
 * with only a small gutter, while on an ultrawide display it stops growing
 * rather than stretching lines of text across the whole screen.
 *
 * The header, the body and the footer must all use both values, or the logo
 * stops lining up with the content beneath it.
 */
const MAX_WIDTH = 1400;
const INSET = 32;

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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Motion is deliberately concentrated in two places: the hero's entrance and
 * its slide changes. Everything else gets one quiet reveal as it scrolls into
 * view. A page where every element moves reads as noise, not craft.
 *
 * `reduceMotion` collapses all of it to plain visible content — never to
 * hidden content, which is how reduced-motion implementations usually break.
 */
const wordIn = {
  hidden: { opacity: 0, y: "0.4em" },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.045, duration: 0.55, ease: EASE_OUT },
  }),
};

const bodyIn = {
  hidden: { opacity: 0, y: 12 },
  shown: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: EASE_OUT },
  }),
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const narrow = useIsNarrow();
  const apply = () => navigate("/apply");

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  // Anyone who has asked for less motion gets the slides without the sliding;
  // they can still move between them with the controls.
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (paused || reduceMotion) return;
    // Keyed on `slide` as well, so choosing one by hand restarts the clock
    // instead of being advanced out from under you a moment later.
    const id = window.setTimeout(
      () => setSlide((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS
    );
    return () => window.clearTimeout(id);
  }, [slide, paused, reduceMotion]);

  /** One quiet rise as a section reaches the viewport. Runs once. */
  const reveal = reduceMotion
    ? { initial: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-90px" },
        transition: { duration: 0.6, ease: EASE_OUT },
      };

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
    background: SURFACE,
    border: `1px solid ${colors.border.light}`,
    borderRadius: `${radii.lg}px`,
    boxShadow: narrow ? "3px 3px 0 #0B2621" : shadows.xl,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: GROUND,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
      }}
    >
      <AppHeader
        action={{ label: "Apply now", onClick: apply }}
        background={GROUND}
        inset={INSET}
        maxWidth={MAX_WIDTH}
      />

      <main
        style={{
          flexGrow: 1,
          width: "100%",
          maxWidth: `${MAX_WIDTH}px`,
          margin: "0 auto",
          padding: narrow ? "44px 20px 72px" : `76px ${INSET}px 104px`,
          display: "flex",
          flexDirection: "column",
          gap: narrow ? "68px" : "104px",
        }}
      >
        {/* ------------------------------------------------------------ hero */}
        <section
          aria-roledescription="carousel"
          aria-label="What devpay offers"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          style={{ display: "flex", flexDirection: "column", gap: "26px", maxWidth: "820px" }}
        >
          {/* The track is a flex row, so its height is the tallest slide's and
              nothing below it jumps as slides change. No fixed height needed. */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: `${SLIDES.length * 100}%`,
                transform: `translateX(-${(slide * 100) / SLIDES.length}%)`,
                transition: reduceMotion ? "none" : "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {SLIDES.map((s, i) => (
                <div
                  key={s.headline}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${SLIDES.length}`}
                  aria-hidden={i !== slide}
                  style={{
                    width: `${100 / SLIDES.length}%`,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "22px",
                    paddingRight: "24px",
                    boxSizing: "border-box",
                    opacity: i === slide ? 1 : 0,
                    transition: reduceMotion ? "none" : "opacity 620ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {React.createElement(
                    i === 0 ? "h1" : "p",
                    {
                      "aria-hidden": i === 0 ? undefined : "true",
                      style: {
                        margin: 0,
                        font: `700 clamp(40px, 7vw, 76px)/1.04 ${type.display}`,
                        letterSpacing: "-0.035em",
                        color: colors.text.primary,
                        textWrap: "balance" as const,
                      },
                    },
                    // Word by word, so the incoming slide's headline assembles
                    // as it arrives rather than sliding in as a finished block.
                    s.headline.split(" ").map((word, w) => (
                      <span
                        key={`${word}-${w}`}
                        style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
                      >
                        <motion.span
                          style={{ display: "inline-block", willChange: "transform" }}
                          custom={w}
                          variants={wordIn}
                          initial={reduceMotion ? { opacity: 1, y: 0 } : "hidden"}
                          animate={
                            reduceMotion
                              ? { opacity: 1, y: 0 }
                              : i === slide
                              ? "shown"
                              : "hidden"
                          }
                        >
                          {word}
                          {w < s.headline.split(" ").length - 1 ? "\u00A0" : ""}
                        </motion.span>
                      </span>
                    ))
                  )}
                  <motion.p
                    custom={0.1 + s.headline.split(" ").length * 0.045}
                    variants={bodyIn}
                    initial={reduceMotion ? { opacity: 1, y: 0 } : "hidden"}
                    animate={
                      reduceMotion
                        ? { opacity: 1, y: 0 }
                        : i === slide
                        ? "shown"
                        : "hidden"
                    }
                    style={{
                      margin: 0,
                      maxWidth: "46ch",
                      font: `400 clamp(17px, 2vw, 20px)/1.55 ${type.body}`,
                      color: colors.text.secondary,
                      textWrap: "pretty",
                    }}
                  >
                    {s.body}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>

          {/* Slide controls. Rules, not dots — they read as progress rather than
              decoration, and give a 44px target without a 44px circle. */}
          <div style={{ display: "flex", gap: "10px" }} role="tablist" aria-label="Choose a slide">
            {SLIDES.map((s, i) => (
              <button
                key={s.headline}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={s.headline}
                onClick={() => setSlide(i)}
                style={{
                  width: "56px",
                  height: "30px",
                  padding: "13px 0",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  boxSizing: "content-box",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: "4px",
                    borderRadius: "2px",
                    overflow: "hidden",
                    background: i < slide ? brand.gold : colors.border.light,
                    transition: reduceMotion ? "none" : "background 400ms ease",
                  }}
                >
                  {/* Only the current rule fills, and it fills over exactly the
                      time left before the slide changes. */}
                  {i === slide && (
                    <span
                      key={slide}
                      className="dv-progress"
                      style={{
                        display: "block",
                        height: "100%",
                        borderRadius: "2px",
                        background: brand.gold,
                        animationDuration: `${SLIDE_INTERVAL_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex" }}>
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
        </section>

        {/* -------------------------------------------------------- features */}
        <motion.section
          {...reveal}
          style={{
            display: "grid",
            gridTemplateColumns: narrow ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: narrow ? "16px" : "24px",
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: EASE_OUT }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -5, boxShadow: narrow ? "3px 3px 0 #0B2621" : "10px 10px 0 #0B2621" }
              }
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
        </motion.section>

        {/* ---------------------------------------------------- how it works */}
        <motion.section {...reveal} style={section}>
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
              <motion.li
                key={step.name}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE_OUT }}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
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
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* ------------------------------------------------ what you'll need */}
        <motion.section {...reveal} style={section}>
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
                    background: TINT,
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
        </motion.section>

        {/* -------------------------------------------------------------- faq */}
        <motion.section {...reveal} style={section}>
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
        </motion.section>

        {/* ---------------------------------------------------- closing call */}
        <motion.section
          {...reveal}
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

          <motion.button
            type="button"
            onClick={apply}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { y: 0, scale: 0.985 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
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
          </motion.button>
        </motion.section>
      </main>

      {/* ----------------------------------------------------------- footer */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border.light}`,
          padding: narrow ? "28px 0 40px" : "34px 0 48px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: `${MAX_WIDTH}px`,
            margin: "0 auto",
            padding: narrow ? "0 20px" : `0 ${INSET}px`,
            boxSizing: "border-box",
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
