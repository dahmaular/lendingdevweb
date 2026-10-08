import React from "react";
import { colors } from "../../theme";
import AppHeader from "./AppHeader";
import StepRibbon from "./StepRibbon";
import { useIsCompact, useIsNarrow } from "./useMediaQuery";

interface PageShellProps {
  /** 1-based. Omit on screens that sit outside the five steps. */
  step?: number;
  headerAction?: { label: string; onClick: () => void };
  showHelp?: boolean;
  /** The running receipt. On compact widths it folds up above the sheet. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Header, step ribbon, sheet, receipt — the frame every screen in the flow
 * shares. Each screen used to build its own.
 */
const PageShell: React.FC<PageShellProps> = ({
  step,
  headerAction,
  showHelp,
  aside,
  children,
}) => {
  const compact = useIsCompact();
  const narrow = useIsNarrow();

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
      <AppHeader action={headerAction} showHelp={showHelp} />
      {step !== undefined && <StepRibbon currentStep={step} />}

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: compact ? "column" : "row",
          gap: compact ? "18px" : "34px",
          padding: narrow ? "18px 16px 32px" : compact ? "22px 28px 40px" : "26px 48px 40px",
          minHeight: 0,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {compact && aside}
        {children}
        {!compact && aside}
      </div>
    </div>
  );
};

export default PageShell;
