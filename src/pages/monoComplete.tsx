import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const colors = {
  primary: { main: "#1E88E5", dark: "#1565C0" },
  background: { main: "#F8FAFC" },
  text: { primary: "#1E293B", secondary: "#64748B" },
  status: { success: "#00C853" },
};

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
        background: `linear-gradient(135deg, ${colors.background.main} 0%, #E3F2FD 100%)`,
        padding: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: "center",
          color: colors.text.primary,
        }}
      >
        <CheckCircle2 size={56} color={colors.status.success} />
        <h2 style={{ margin: "16px 0 8px", fontSize: 20, fontWeight: 600 }}>
          Authorization complete
        </h2>
        <p style={{ margin: 0, color: colors.text.secondary, fontSize: 14 }}>
          Finalizing your application…
        </p>
      </motion.div>
    </div>
  );
};

export default MonoComplete;
