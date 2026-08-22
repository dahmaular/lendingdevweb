import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { brand, colors, radii, shadows, type } from "../theme";

// The message type the parent (loanApplication.tsx) listens for.
export const MONO_COMPLETE_MESSAGE = "mono-mandate-complete";

/**
 * Landing page used as Mono's `redirect_url`. Mono navigates the mandate
 * webview here once the user finishes (or exits) the authorisation flow.
 *
 * When this runs INSIDE the Mono iframe it is same-origin with the host app,
 * so it notifies the parent window via postMessage. The parent then closes the
 * webview and continues the flow. If it is ever opened as a top-level window
 * (e.g. a full-page redirect), it falls back to navigating on its own.
 */
const MonoComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Forward whatever Mono appended to the redirect URL (status, reference…).
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    );

    const inIframe = window.parent && window.parent !== window;

    if (inIframe) {
      // Same-origin parent → target its exact origin, not "*".
      window.parent.postMessage(
        { type: MONO_COMPLETE_MESSAGE, ...params },
        window.location.origin,
      );
    } else {
      // Opened directly as a top-level page: continue the flow ourselves.
      const t = setTimeout(() => navigate("/confirmation"), 1200);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.background.main,
        padding: "24px",
        fontFamily: type.body,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: "520px",
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: `${radii.lg + 2}px`,
          boxShadow: shadows.xl,
          padding: "44px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "76px",
            height: "76px",
            borderRadius: `${radii.lg + 6}px`,
            background: brand.gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={36} strokeWidth={2.6} color={colors.primary.main} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h1
            style={{
              margin: 0,
              font: `700 clamp(24px, 4vw, 32px)/1.15 ${type.display}`,
              letterSpacing: "-0.025em",
              color: colors.text.primary,
            }}
          >
            Authorization complete
          </h1>
          <p
            style={{
              margin: 0,
              font: `400 16px/1.55 ${type.body}`,
              color: colors.text.secondary,
            }}
          >
            Finalising your application. We&rsquo;ll take you back to your file in a moment —
            there&rsquo;s nothing you need to do here.
          </p>
        </div>

        {/* Indeterminate: this page has no progress to report, it just waits
            for the parent window to pick the message up. */}
        <div
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            background: colors.border.light,
            overflow: "hidden",
          }}
        >
          <div className="dv-indeterminate" style={{ background: brand.gold }} />
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
            Mandate authorised with your bank
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default MonoComplete;
