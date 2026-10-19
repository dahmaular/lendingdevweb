import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { brand, colors, radii, shadows, type } from "../../theme";
import { PrimaryButton } from "./Buttons";

export interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onAction?: () => void;
  actionText?: string;
  tone?: "info" | "success" | "error";
}

const glyphs = {
  info: { Icon: Info, color: colors.primary.main, bg: brand.wash },
  success: { Icon: CheckCircle2, color: colors.status.success, bg: colors.status.successLight },
  error: { Icon: AlertCircle, color: colors.status.error, bg: "#F8E9E6" },
};

/**
 * One modal. apply.tsx and StatementReview.tsx each carried an identical copy
 * of this under the name ModernModal; the props are unchanged so both call
 * sites only had to swap their import.
 */
const Modal: React.FC<ModalProps> = ({
  open,
  title,
  message,
  onClose,
  onAction,
  actionText = "Ok, got it",
  tone = "info",
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const { Icon, color, bg } = glyphs[tone];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(11, 38, 33, 0.42)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || "Notice"}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              background: colors.background.card,
              border: `1px solid ${colors.border.light}`,
              borderRadius: `${radii.lg}px`,
              boxShadow: shadows.xl,
              padding: "30px 30px 26px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              textAlign: "left",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: colors.text.muted,
                display: "flex",
                padding: "6px",
              }}
            >
              <X size={18} strokeWidth={1.8} />
            </button>

            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: `${radii.lg - 2}px`,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={26} strokeWidth={1.8} color={color} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {title && (
                <h2
                  style={{
                    margin: 0,
                    font: `700 22px/1.2 ${type.display}`,
                    letterSpacing: "-0.02em",
                    color: colors.text.primary,
                  }}
                >
                  {title}
                </h2>
              )}
              <p
                style={{
                  margin: 0,
                  font: `400 15px/1.55 ${type.body}`,
                  color: colors.text.secondary,
                }}
              >
                {message}
              </p>
            </div>

            <div style={{ marginTop: "4px", borderTop: `1px solid ${brand.ruleSoft}`, paddingTop: "18px" }}>
              <PrimaryButton onClick={onAction || onClose}>{actionText}</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
