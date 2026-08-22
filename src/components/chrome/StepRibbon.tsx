import React from "react";
import { Check } from "lucide-react";
import { brand, colors, radii, type } from "../../theme";
import { useIsNarrow } from "./useMediaQuery";

/**
 * The five steps of the application, named. This list used to be copy-pasted
 * into five screens, each with its own icon set and its own idea of the
 * labels; it lives here now.
 */
export const STEPS = [
  { name: "Get started", sub: "Name, email, phone" },
  { name: "Statement review", sub: "Bank account & BVN" },
  { name: "Personal details", sub: "Address & ID" },
  { name: "Loan application", sub: "Amount & tenor" },
  { name: "Confirmation", sub: "Review & submit" },
] as const;

interface StepRibbonProps {
  /** 1-based, matching the ProgressSteps call sites this replaces. */
  currentStep: number;
}

const StepRibbon: React.FC<StepRibbonProps> = ({ currentStep }) => {
  const narrow = useIsNarrow();
  const active = Math.min(Math.max(currentStep, 1), STEPS.length);
  const fill = (active / STEPS.length) * 100;

  const rule = (
    <div
      style={{
        position: "relative",
        height: "4px",
        borderRadius: "2px",
        background: colors.border.light,
        marginTop: narrow ? "12px" : "18px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${fill}%`,
          height: "4px",
          borderRadius: "2px",
          background: brand.gold,
          transition: "width 320ms ease",
        }}
      />
    </div>
  );

  // On a phone there is no room for five labelled steps, so the ribbon says
  // where you are in words and lets the rule carry the rest.
  if (narrow) {
    return (
      <nav aria-label="Progress" style={{ padding: "18px 20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              font: `600 15px/1.2 ${type.display}`,
              color: colors.text.primary,
              letterSpacing: "-0.01em",
            }}
          >
            {STEPS[active - 1].name}
          </span>
          <span
            style={{
              font: `500 13px/1 ${type.body}`,
              color: colors.text.secondary,
            }}
          >
            Step {active} of {STEPS.length}
          </span>
        </div>
        {rule}
      </nav>
    );
  }

  return (
    <nav aria-label="Progress" style={{ padding: "22px 48px 0" }}>
      <ol
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {STEPS.map((step, i) => {
          const n = i + 1;
          const done = n < active;
          const current = n === active;

          const badgeBase: React.CSSProperties = {
            width: "32px",
            height: "32px",
            borderRadius: `${radii.sm + 2}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            font: `700 14px/1 ${type.display}`,
          };

          return (
            <li
              key={step.name}
              aria-current={current ? "step" : undefined}
              style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1 }}
            >
              <div
                style={
                  done
                    ? { ...badgeBase, background: colors.primary.main, color: colors.background.main }
                    : current
                    ? { ...badgeBase, background: brand.gold, color: colors.primary.main }
                    : {
                        ...badgeBase,
                        border: `1.5px solid ${colors.border.light}`,
                        color: "#A79C86",
                        fontWeight: 600,
                      }
                }
              >
                {done ? <Check size={16} strokeWidth={2.6} /> : n}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    font: `600 14px/1.2 ${type.display}`,
                    letterSpacing: "-0.01em",
                    color: done || current ? colors.text.primary : "#A79C86",
                  }}
                >
                  {step.name}
                </span>
                <span
                  style={{
                    font: `400 12px/1.2 ${type.body}`,
                    color: done || current ? "#8B7F68" : "#B9AE99",
                  }}
                >
                  {step.sub}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {rule}
    </nav>
  );
};

export default StepRibbon;
