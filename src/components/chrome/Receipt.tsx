import React, { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { colors, radii, type } from "../../theme";
import { useIsCompact } from "./useMediaQuery";

export interface ReceiptRow {
  label: string;
  /** Undefined renders as "Not yet" — the point is to show what is still open. */
  value?: React.ReactNode;
}

interface ReceiptProps {
  title?: string;
  rows: ReceiptRow[];
  total?: { label: string; value: React.ReactNode };
  footer?: React.ReactNode;
}

const Row: React.FC<ReceiptRow> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      padding: "12px 0",
      borderBottom: `1px dashed ${colors.border.light}`,
    }}
  >
    <span
      style={{
        font: `500 12px/1 ${type.body}`,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: colors.text.muted,
      }}
    >
      {label}
    </span>
    <span
      style={
        value
          ? { font: `600 16px/1.3 ${type.display}`, color: colors.text.primary }
          : { font: `400 15px/1.3 ${type.body}`, color: "#B9AE99" }
      }
    >
      {value ?? "Not yet"}
    </span>
  </div>
);

/**
 * The running record of what the application already knows. It is what makes
 * the flow feel accountable rather than like a wall of forms, so on a narrow
 * screen it collapses to a one-line summary above the sheet instead of being
 * pushed to the bottom of the page where nobody would see it.
 */
const Receipt: React.FC<ReceiptProps> = ({ title = "Your application", rows, total, footer }) => {
  const compact = useIsCompact();
  const [open, setOpen] = useState(false);

  const body = (
    <>
      {rows.map((r) => (
        <Row key={r.label} {...r} />
      ))}

      {total && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: `2px solid ${colors.primary.main}`,
          }}
        >
          <span style={{ font: `600 13px/1 ${type.body}`, color: colors.text.primary }}>
            {total.label}
          </span>
          <span
            style={{
              font: `700 24px/1 ${type.display}`,
              letterSpacing: "-0.02em",
              color: colors.text.primary,
            }}
          >
            {total.value}
          </span>
        </div>
      )}

      {footer && (
        <div
          style={{
            marginTop: "auto",
            paddingTop: "18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Lock size={16} strokeWidth={1.7} color={colors.secondary.main} style={{ flexShrink: 0 }} />
          <span style={{ font: `400 12px/1.5 ${type.body}`, color: colors.text.secondary }}>
            {footer}
          </span>
        </div>
      )}
    </>
  );

  if (compact) {
    const filled = rows.filter((r) => r.value);
    const summary = filled.length
      ? `${filled.length} of ${rows.length} on file`
      : "Nothing on file yet";

    return (
      <aside
        style={{
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`,
          borderRadius: `${radii.md}px`,
          textAlign: "left",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "14px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            font: `600 14px/1 ${type.display}`,
            color: colors.text.primary,
          }}
        >
          <span>{title}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              font: `400 13px/1 ${type.body}`,
              color: colors.text.secondary,
            }}
          >
            {summary}
            <ChevronDown
              size={17}
              strokeWidth={1.8}
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}
            />
          </span>
        </button>

        {open && (
          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column" }}>{body}</div>
        )}
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "296px",
        flexShrink: 0,
        alignSelf: "stretch",
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderTop: `3px solid ${colors.primary.main}`,
        borderRadius: `4px 4px ${radii.lg}px ${radii.lg}px`,
        padding: "24px 24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        textAlign: "left",
      }}
    >
      <div
        style={{
          font: `700 15px/1 ${type.display}`,
          letterSpacing: "-0.01em",
          color: colors.text.primary,
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      {body}
    </aside>
  );
};

export default Receipt;
