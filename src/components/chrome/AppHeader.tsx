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
  /** Horizontal inset, in px. Must match the page's own, or the logo will not
   *  line up with the content beneath it. */
  inset?: number;
  /** Cap and centre the header row, for pages laid out as a fixed container
   *  rather than full bleed. Omit to keep the row full width. */
  maxWidth?: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  action,
  showHelp = true,
  inset = 48,
  maxWidth,
}) => {
  const narrow = useIsNarrow();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "center",
        height: narrow ? "64px" : "78px",
        flexShrink: 0,
        background: colors.background.main,
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth ? `${maxWidth}px` : undefined,
          margin: "0 auto",
          padding: narrow ? "0 20px" : `0 ${inset}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          boxSizing: "border-box",
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
      </div>
    </header>
  );
};

export default AppHeader;
