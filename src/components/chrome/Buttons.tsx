import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { brand, colors, controls, radii, type } from "../../theme";

interface BaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  /** Icon sits after the label on the primary action, before it on secondary. */
  iconPosition?: "start" | "end";
  fullWidth?: boolean;
  submit?: boolean;
  style?: React.CSSProperties;
}

const content = (
  children: React.ReactNode,
  Icon: LucideIcon | undefined,
  position: "start" | "end",
  loading: boolean | undefined,
  iconColor: string
) => {
  const glyph = loading ? (
    <Loader2 size={19} strokeWidth={2} color={iconColor} className="dv-spin" />
  ) : Icon ? (
    <Icon size={19} strokeWidth={2} color={iconColor} />
  ) : null;

  return (
    <>
      {position === "start" && glyph}
      <span>{children}</span>
      {position === "end" && glyph}
    </>
  );
};

/**
 * The one gold thing on the screen is the bar under this button — the action is
 * ink, so a page never has two things competing to be pressed.
 */
export const PrimaryButton: React.FC<BaseProps> = ({
  children,
  onClick,
  disabled,
  loading,
  icon,
  iconPosition = "end",
  fullWidth = true,
  submit,
  style,
}) => {
  const inert = disabled || loading;
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={inert}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: fullWidth ? undefined : "0 32px",
        height: `${controls.buttonHeight}px`,
        border: "none",
        borderBottom: `${controls.primaryUnderline}px solid ${inert ? "#D8CBA6" : brand.gold}`,
        borderRadius: `${radii.md}px`,
        background: inert ? "#5A6D65" : colors.primary.main,
        color: colors.background.main,
        font: `600 16px/1 ${type.display}`,
        letterSpacing: "-0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        cursor: inert ? "not-allowed" : "pointer",
        transition: "background 140ms ease",
        ...style,
      }}
    >
      {content(children, icon, iconPosition, loading, colors.background.main)}
    </button>
  );
};

export const SecondaryButton: React.FC<BaseProps> = ({
  children,
  onClick,
  disabled,
  loading,
  icon,
  iconPosition = "start",
  fullWidth = false,
  submit,
  style,
}) => {
  const inert = disabled || loading;
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={inert}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: fullWidth ? undefined : "0 28px",
        height: `${controls.buttonHeight}px`,
        border: `1.5px solid ${inert ? colors.border.light : colors.primary.main}`,
        borderRadius: `${radii.md}px`,
        background: "transparent",
        color: inert ? colors.text.muted : colors.primary.main,
        font: `600 16px/1 ${type.display}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: inert ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {content(children, icon, iconPosition, loading, inert ? colors.text.muted : colors.primary.main)}
    </button>
  );
};

/** A quiet text action — "Go back", "Resend code". */
export const TextButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}> = ({ children, onClick, icon: Icon, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      background: "transparent",
      border: "none",
      padding: "8px 0",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      font: `500 14px/1 ${type.body}`,
      color: disabled ? colors.text.muted : colors.text.secondary,
    }}
  >
    {Icon && <Icon size={17} strokeWidth={1.7} />}
    {children}
  </button>
);
