import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Lock, Shield, Sparkles, LucideIcon } from "lucide-react";
import { brand, colors, radii, shadows, type } from "../theme";
import { AppHeader, PrimaryButton } from "../components/chrome";
import { useIsNarrow } from "../components/chrome/useMediaQuery";

/**
 * The application flow moved to /apply and this took over /, so the marketing
 * copy that used to sit in the old split-panel hero has somewhere to live.
 * Wording is exactly what that panel carried — nothing here is invented.
 */
const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Sparkles, title: "Quick Approval", description: "Get approved in minutes" },
  { icon: Shield, title: "Secure Process", description: "Bank-level encryption" },
  { icon: Clock, title: "Fast Disbursement", description: "Funds in 24 hours" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const narrow = useIsNarrow();
  const apply = () => navigate("/apply");

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
          padding: narrow ? "48px 20px 64px" : "80px 48px 96px",
          display: "flex",
          flexDirection: "column",
          gap: narrow ? "56px" : "88px",
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: "flex", flexDirection: "column", gap: "26px", maxWidth: "760px" }}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              color: colors.text.secondary,
            }}
          >
            <Lock size={16} strokeWidth={1.7} color={colors.secondary.main} />
            <span style={{ font: `400 13px/1.4 ${type.body}` }}>
              Checking your eligibility does not affect your credit score.
            </span>
          </div>
        </motion.section>

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
              style={{
                background: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                borderRadius: `${radii.lg}px`,
                boxShadow: narrow ? "3px 3px 0 #0B2621" : shadows.xl,
                padding: "28px 26px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
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
                <h2
                  style={{
                    margin: 0,
                    font: `700 19px/1.2 ${type.display}`,
                    letterSpacing: "-0.015em",
                    color: colors.text.primary,
                  }}
                >
                  {title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    font: `400 15px/1.5 ${type.body}`,
                    color: colors.text.secondary,
                  }}
                >
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
