import React from "react";
import { colors, radii, shadows, type } from "../../theme";
import { useIsNarrow } from "./useMediaQuery";

interface SheetProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * The paper the form sits on. Hard offset rather than a blurred drop shadow —
 * a sheet laid on a desk, not a card floating above one.
 */
export const Sheet: React.FC<SheetProps> = ({ children, style }) => {
  const narrow = useIsNarrow();
  return (
    <section
      style={{
        flexGrow: 1,
        minWidth: 0,
        background: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: `${radii.lg}px`,
        boxShadow: narrow ? "3px 3px 0 #0B2621" : shadows.xl,
        padding: narrow ? "24px 20px" : "34px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "26px",
        textAlign: "left",
        ...style,
      }}
    >
      {children}
    </section>
  );
};

interface SheetTitleProps {
  title: string;
  subtitle?: React.ReactNode;
}

export const SheetTitle: React.FC<SheetTitleProps> = ({ title, subtitle }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <h1
      style={{
        margin: 0,
        font: `700 clamp(26px, 3.4vw, 36px)/1.12 ${type.display}`,
        letterSpacing: "-0.025em",
        color: colors.text.primary,
        textWrap: "pretty",
      }}
    >
      {title}
    </h1>
    {subtitle && (
      <p
        style={{
          margin: 0,
          font: `400 16px/1.55 ${type.body}`,
          color: colors.text.secondary,
          maxWidth: "62ch",
          textWrap: "pretty",
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default Sheet;
