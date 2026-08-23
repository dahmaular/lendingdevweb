import React from "react";
import { HelpCircle } from "lucide-react";
import Logo from "../../assets/devpay-logo.png";
import { brand, colors, controls, type } from "../../theme";
import { useIsNarrow } from "./useMediaQuery";

interface AppHeaderProps {
  /** Right-hand action. Omit for screens with nowhere to go, like the Mono return. */
  action?: { label: string; onClick: () => void };
  /** Hidden on the narrowest screens, where the action matters more. */
  showHelp?: boolean;
  /** Override the ground, so a page on a different background has no seam. */
  background?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  action,
  showHelp = true,
  background = colors.background.main,
}) => {
  const narrow = useIsNarrow();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        height: narrow ? "64px" : "78px",
        flexShrink: 0,
        padding: narrow ? "0 20px" : "0 48px",
        background,
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <img
        src={Logo}
        alt="devpay"
        style={{ width: narrow ? "96px" : "118px", height: "auto", display: "block" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: narrow ? "16px" : "26px" }}>
        {showHelp && !narrow && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              font: `500 14px/1 ${type.body}`,
              color: colors.text.secondary,
            }}
          >
            <HelpCircle size={17} strokeWidth={1.6} />
            Need help?
          </span>
        )}

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            style={{
              background: "transparent",
              border: "none",
              // padded to clear the 44px touch target; the gold rule stays on
              // the text, so the extra height is invisible
              padding: "12px 0",
              minHeight: `${controls.minTapTarget}px`,
              cursor: "pointer",
              font: `600 14px/1 ${type.body}`,
              color: colors.primary.main,
              borderBottom: `2px solid ${brand.gold}`,
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
