import React from "react";
import Logo from "../../assets/devpay-logo.png";
import { brand, colors, controls, type } from "../../theme";
import { useIsNarrow } from "./useMediaQuery";
import { HelpLink } from "./HelpPanel";

interface AppHeaderProps {
  /** Right-hand action. Omit for screens with nowhere to go, like the Mono return. */
  action?: { label: string; onClick: () => void };
  /** Opens the help panel. Shrinks to an icon on phones rather than hiding. */
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
      {/* A plain anchor rather than a router Link: the header stays free of the
          router, and every screen it sits on already navigates by full load. */}
      <a href="/" aria-label="devpay home" style={{ display: "block", lineHeight: 0 }}>
        <img
          src={Logo}
          alt="devpay"
          style={{ width: narrow ? "96px" : "118px", height: "auto", display: "block" }}
        />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: narrow ? "16px" : "26px" }}>
        {showHelp && <HelpLink variant={narrow ? "icon" : "header"} />}

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
