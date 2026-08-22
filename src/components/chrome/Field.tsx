import React, { useId, useRef, useState } from "react";
import { AlertCircle, ChevronDown, LucideIcon } from "lucide-react";
import { colors, controls, radii, type } from "../../theme";

const labelRow = (
  id: string,
  label: string,
  why?: string,
  onWhy?: () => void
): React.ReactElement => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px",
    }}
  >
    <label htmlFor={id} style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>
      {label}
    </label>
    {why &&
      (onWhy ? (
        <button
          type="button"
          onClick={onWhy}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            font: `500 12px/1 ${type.body}`,
            color: colors.secondary.main,
            textDecoration: "underline",
          }}
        >
          {why}
        </button>
      ) : (
        <span style={{ font: `500 12px/1 ${type.body}`, color: colors.secondary.main }}>{why}</span>
      ))}
  </div>
);

const controlsGlow = "0 0 0 4px rgba(230, 190, 88, 0.35)";
const errorGlow = "0 0 0 4px rgba(179, 64, 47, 0.14)";

const shellStyle = (focused: boolean, error?: string, disabled?: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  height: `${controls.fieldHeight}px`,
  padding: "0 18px",
  background: disabled ? colors.background.main : "#FFFFFF",
  border: error
    ? `2px solid ${colors.status.error}`
    : focused
    ? `2px solid ${colors.primary.main}`
    : `1px solid ${colors.border.light}`,
  borderRadius: `${radii.md}px`,
  boxShadow: focused && !error ? controlsGlow : error ? errorGlow : "none",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
  cursor: disabled ? "not-allowed" : undefined,
});


const helper = (hint?: React.ReactNode, error?: string): React.ReactNode => {
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "7px",
          font: `400 13px/1.45 ${type.body}`,
          color: colors.status.error,
        }}
      >
        <AlertCircle size={15} strokeWidth={1.9} style={{ flexShrink: 0, marginTop: "1px" }} />
        <span>{error}</span>
      </div>
    );
  }
  if (hint) {
    return (
      <div style={{ font: `400 13px/1.45 ${type.body}`, color: colors.text.secondary }}>{hint}</div>
    );
  }
  return null;
};

export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  /** Short "Why we ask" affordance for the fields people hesitate over. */
  why?: string;
  onWhy?: () => void;
  hint?: React.ReactNode;
  error?: string;
  trailing?: React.ReactNode;
  inputType?: React.HTMLInputTypeAttribute;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  maxLength?: number;
  disabled?: boolean;
  autoComplete?: string;
  /** Escape hatch for native attributes the wrapper does not model — a date
   *  input's max, a numeric input's step. */
  inputAttrs?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  why,
  onWhy,
  hint,
  error,
  trailing,
  inputType = "text",
  inputMode,
  maxLength,
  disabled,
  autoComplete,
  inputAttrs,
}) => {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "9px", flexGrow: 1, minWidth: 0 }}>
      {labelRow(id, label, why, onWhy)}
      <div style={shellStyle(focused, error, disabled)}>
        {Icon && (
          <span
            style={{
              display: "flex",
              color: focused ? colors.primary.main : colors.text.muted,
              marginRight: "12px",
            }}
          >
            <Icon size={19} strokeWidth={1.6} />
          </span>
        )}
        <input
          {...inputAttrs}
          id={id}
          type={inputType}
          inputMode={inputMode}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flexGrow: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            font: `400 16px/1 ${type.body}`,
            color: colors.text.primary,
            fontVariantNumeric: inputMode === "numeric" ? "tabular-nums" : undefined,
          }}
        />
        {trailing}
      </div>
      {helper(hint, error)}
    </div>
  );
};

export interface SelectFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  error?: string;
  why?: string;
  disabled?: boolean;
  onClick: () => void;
  open?: boolean;
}

/**
 * A button styled as a field. The screens open their own pickers — a searchable
 * bank list, an ID-type list — so this only owns the trigger.
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder = "Select an option",
  icon: Icon,
  hint,
  error,
  why,
  disabled,
  onClick,
  open,
}) => {
  const id = useId();
  const chosen = !!value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "9px", flexGrow: 1, minWidth: 0 }}>
      {labelRow(id, label, why)}
      <button
        id={id}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={!!open}
        style={{
          ...shellStyle(!!open, error, disabled),
          width: "100%",
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {Icon && (
          <span
            style={{
              display: "flex",
              color: open ? colors.primary.main : colors.text.muted,
              marginRight: "12px",
            }}
          >
            <Icon size={19} strokeWidth={1.6} />
          </span>
        )}
        <span
          style={{
            flexGrow: 1,
            minWidth: 0,
            font: `400 16px/1 ${type.body}`,
            color: chosen ? colors.text.primary : colors.text.muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {chosen ? value : placeholder}
        </span>
        <ChevronDown
          size={19}
          strokeWidth={1.8}
          color={colors.text.muted}
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 160ms ease",
          }}
        />
      </button>
      {helper(hint, error)}
    </div>
  );
};

export interface OtpInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hint?: React.ReactNode;
  error?: string;
  action?: { label: string; onClick: () => void; disabled?: boolean };
}

/**
 * Six boxes over one real input, so paste, autofill and the OS SMS suggestion
 * all still work — they break when each box is its own input.
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  label,
  value,
  onChange,
  length = 6,
  hint,
  error,
  action,
}) => {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const digits = value.padEnd(length, " ").slice(0, length).split("");
  const cursor = Math.min(value.length, length - 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <label htmlFor={id} style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>
          {label}
        </label>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: action.disabled ? "not-allowed" : "pointer",
              font: `500 13px/1 ${type.body}`,
              color: action.disabled ? colors.text.muted : colors.secondary.main,
              textDecoration: action.disabled ? "none" : "underline",
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <input
          id={id}
          ref={ref}
          value={value}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "text",
            font: "inherit",
          }}
        />
        <div style={{ display: "flex", gap: "12px", pointerEvents: "none" }}>
          {digits.map((d, i) => {
            const filled = d.trim() !== "";
            const isCursor = focused && i === cursor;
            return (
              <div
                key={i}
                style={{
                  flexGrow: 1,
                  maxWidth: "64px",
                  height: "64px",
                  borderRadius: `${radii.md}px`,
                  background: "#FFFFFF",
                  border: error
                    ? `2px solid ${colors.status.error}`
                    : filled || isCursor
                    ? `2px solid ${colors.primary.main}`
                    : `1px solid ${colors.border.light}`,
                  boxShadow: isCursor ? controlsGlow : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: `700 24px/1 ${type.display}`,
                  color: filled ? colors.text.primary : "#C6BBA5",
                  fontVariantNumeric: "tabular-nums",
                  transition: "border-color 120ms ease, box-shadow 120ms ease",
                }}
              >
                {filled ? d : "•"}
              </div>
            );
          })}
        </div>
      </div>

      {helper(hint, error)}
    </div>
  );
};

/** Two fields side by side that stack on a phone. */
export const FieldRow: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 24,
}) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: `${gap}px` }}>{children}</div>
);
