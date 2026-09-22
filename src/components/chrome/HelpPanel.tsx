import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, HelpCircle, Mail, MessageCircle, Phone, X } from "lucide-react";
import { brand, colors, radii, shadows, type } from "../../theme";
import { SUPPORT, isPlaceholder, telHref } from "../../support";
import { useIsNarrow, useMediaQuery } from "./useMediaQuery";

/**
 * Answers are copy the product already states elsewhere — the landing page,
 * the Get started screen, the confirmation screen. Nothing here is a new claim.
 */
const QUESTIONS: { q: string; a: React.ReactNode }[] = [
  {
    q: "How long does it take?",
    a: "Applying takes five short steps. Your application is reviewed within 24 hours, and once it's approved the money is paid into the bank account you verified.",
  },
  {
    q: "Will checking my eligibility affect my credit score?",
    a: "No. Checking your eligibility does not affect your credit score.",
  },
  {
    q: "I started an application. Can I finish it later?",
    a: (
      <>
        Yes.{" "}
        <a href="/apply?resume=1" style={{ color: colors.text.primary, fontWeight: 600 }}>
          Resume your application
        </a>{" "}
        with the email address you applied with.
      </>
    ),
  },
  {
    q: "Why do you need my BVN?",
    a: "It confirms your identity. It never lets us move money.",
  },
  {
    q: "What do I need to apply?",
    a: "You need to be 18 or older, have a bank account in your name, your BVN, and a valid ID: International Passport, National ID Card, Driver's License or Voter's Card.",
  },
];

/** One contact row. A detail still in [brackets] is shown, but never linked. */
const ContactRow: React.FC<{ icon: typeof Mail; label: string; value: string; href?: string }> = ({
  icon: Icon,
  label,
  value,
  href,
}) => {
  const linked = href && !isPlaceholder(value);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <Icon size={18} strokeWidth={1.7} color={colors.text.secondary} style={{ marginTop: "2px", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ font: `500 12px/1.3 ${type.body}`, color: colors.text.muted }}>{label}</span>
        {linked ? (
          <a
            href={href}
            target={href!.startsWith("http") ? "_blank" : undefined}
            rel={href!.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ font: `600 15px/1.4 ${type.body}`, color: colors.text.primary }}
          >
            {value}
          </a>
        ) : (
          <span style={{ font: `600 15px/1.4 ${type.body}`, color: colors.text.primary }}>{value}</span>
        )}
      </div>
    </div>
  );
};

export interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The help panel. It opens over whatever screen the applicant is on rather
 * than navigating away, so nothing they have typed into the form is lost.
 */
export const HelpPanel: React.FC<HelpPanelProps> = ({ open, onClose }) => {
  const narrow = useIsNarrow();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Remember what had focus so closing hands it back, instead of dropping
    // keyboard users at the top of the page.
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  const whatsappHref = `https://wa.me/234${SUPPORT.phone.replace(/\D/g, "").replace(/^0/, "")}`;
  const slide = reduceMotion ? { opacity: 0 } : { x: "100%" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="help-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(11, 38, 33, 0.42)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-panel-title"
            initial={slide}
            animate={{ x: 0, opacity: 1 }}
            exit={slide}
            transition={{ duration: reduceMotion ? 0.12 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: narrow ? "100%" : "440px",
              height: "100%",
              overflowY: "auto",
              background: colors.background.card,
              borderLeft: narrow ? "none" : `1px solid ${colors.border.light}`,
              boxShadow: narrow ? "none" : shadows.xl,
              padding: narrow ? "22px 20px 32px" : "30px 32px 40px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "26px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
              <h2
                id="help-panel-title"
                style={{
                  margin: 0,
                  font: `700 26px/1.15 ${type.display}`,
                  letterSpacing: "-0.02em",
                  color: colors.text.primary,
                }}
              >
                How can we help?
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close help"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: colors.text.muted,
                  display: "flex",
                  padding: "6px",
                  margin: "-4px -6px 0 0",
                  minWidth: "44px",
                  minHeight: "44px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${brand.ruleSoft}` }}>
              {QUESTIONS.map(({ q, a }) => (
                <details key={q} className="dv-faq" style={{ borderBottom: `1px solid ${brand.ruleSoft}` }}>
                  <summary
                    style={{
                      listStyle: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                      padding: "16px 0",
                      minHeight: "44px",
                      boxSizing: "border-box",
                      font: `600 15px/1.4 ${type.body}`,
                      color: colors.text.primary,
                    }}
                  >
                    {q}
                    <ChevronDown className="dv-faq-chevron" size={18} strokeWidth={1.8} color={colors.text.muted} style={{ flexShrink: 0 }} />
                  </summary>
                  <p style={{ margin: "0 0 18px", font: `400 15px/1.6 ${type.body}`, color: colors.text.secondary }}>
                    {a}
                  </p>
                </details>
              ))}
            </div>

            <div
              style={{
                background: brand.wash,
                borderRadius: `${radii.lg}px`,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ font: `700 17px/1.3 ${type.display}`, color: colors.text.primary }}>
                  Still stuck? Talk to us
                </span>
              </div>
              <ContactRow icon={Mail} label="Email" value={SUPPORT.email} href={`mailto:${SUPPORT.email}`} />
              <ContactRow icon={Phone} label="Call" value={SUPPORT.phone} href={telHref(SUPPORT.phone)} />
              <ContactRow icon={MessageCircle} label="WhatsApp" value={SUPPORT.phone} href={whatsappHref} />
              <ContactRow icon={Clock} label="Hours" value={SUPPORT.hours} />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * A "Need help?" trigger that owns its panel, so any screen can offer help
 * without wiring up state or a provider.
 */
export const HelpLink: React.FC<{
  /** header: icon and label. icon: icon only, for phone headers. footer: a text link. */
  variant?: "header" | "icon" | "footer";
  label?: string;
}> = ({ variant = "header", label = "Need help?" }) => {
  const [open, setOpen] = useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const header = variant === "header";
  const iconOnly = variant === "icon";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={iconOnly ? label : undefined}
        style={{
          background: "transparent",
          border: "none",
          padding: header ? "8px 0" : 0,
          minHeight: header || iconOnly ? "44px" : undefined,
          minWidth: iconOnly ? "44px" : undefined,
          justifyContent: iconOnly ? "center" : undefined,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          font: header ? `500 14px/1 ${type.body}` : `400 14px/1.55 ${type.body}`,
          color: colors.text.secondary,
          textAlign: "left",
        }}
      >
        {(header || iconOnly) && <HelpCircle size={iconOnly ? 20 : 17} strokeWidth={1.6} />}
        {!iconOnly && label}
      </button>
      <HelpPanel open={open} onClose={close} />
    </>
  );
};

export default HelpPanel;
