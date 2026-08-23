import React from "react";
import { LucideIcon } from "lucide-react";
import { brand, colors, radii, type } from "../../theme";

interface CalloutProps {
  icon?: LucideIcon;
  title?: React.ReactNode;
  children: React.ReactNode;
  tone?: "neutral" | "success" | "error";
}

const tones = {
  neutral: { bg: brand.wash, border: colors.border.light, glyph: colors.secondary.main },
  success: { bg: colors.status.successLight, border: "#C6DACC", glyph: colors.status.success },
  error: { bg: "#F8E9E6", border: "#E4C4BD", glyph: colors.status.error },
};

/**
 * Used for the reassurances this flow leans on — why a BVN is safe to give,
 * what the repayment actually works out to, what happens after submitting.
 */
const Callout: React.FC<CalloutProps> = ({ icon: Icon, title, children, tone = "neutral" }) => {
  const t = tones[tone];
  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        padding: "18px 20px",
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: `${radii.lg - 2}px`,
        textAlign: "left",
      }}
    >
      {Icon && (
        <Icon size={19} strokeWidth={1.7} color={t.glyph} style={{ flexShrink: 0, marginTop: "1px" }} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
        {title && (
          <div style={{ font: `600 14px/1.3 ${type.body}`, color: colors.text.primary }}>{title}</div>
        )}
        <div style={{ font: `400 13px/1.55 ${type.body}`, color: colors.text.secondary }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Callout;
