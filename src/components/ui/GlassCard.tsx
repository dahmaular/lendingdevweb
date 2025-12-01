import React from "react";
import { Box, BoxProps } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

interface GlassCardProps extends BoxProps {
  variant?: "light" | "dark" | "gradient" | "elevated" | "outline" | "premium";
  blur?: number;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  children: React.ReactNode;
}

const StyledGlassCard = styled(Box, {
  shouldForwardProp: (prop) =>
    !["variant", "blur", "hover", "glow", "animate"].includes(prop as string),
})<GlassCardProps>(
  ({ variant = "light", blur = 20, hover = true, glow = false, animate = false }) => ({
    borderRadius: 24,
    padding: "32px",
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: "1px solid",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",

    ...(animate && {
      animation: `${float} 6s ease-in-out infinite`,
    }),

    ...(variant === "light" && {
      background: "rgba(255, 255, 255, 0.95)",
      borderColor: "rgba(0, 0, 0, 0.06)",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
      ...(glow && {
        boxShadow:
          "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 60px rgba(0, 168, 89, 0.08)",
      }),
    }),

    ...(variant === "dark" && {
      background: "rgba(10, 22, 40, 0.9)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      color: "#fff",
    }),

    ...(variant === "gradient" && {
      background:
        "linear-gradient(135deg, rgba(0, 168, 89, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)",
      borderColor: "rgba(0, 168, 89, 0.15)",
      boxShadow:
        "0 8px 32px rgba(0, 168, 89, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    }),

    ...(variant === "elevated" && {
      background: "#FFFFFF",
      borderColor: "transparent",
      boxShadow:
        "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)",
    }),

    ...(variant === "outline" && {
      background: "rgba(255, 255, 255, 0.6)",
      borderColor: "#E2E8F0",
      borderWidth: 2,
      boxShadow: "none",
    }),

    ...(variant === "premium" && {
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 251, 252, 0.95) 100%)",
      borderColor: "rgba(0, 168, 89, 0.2)",
      boxShadow:
        "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 168, 89, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00A859 0%, #00C96A 50%, #2DD47E 100%)",
        borderRadius: "24px 24px 0 0",
      },
    }),

    ...(hover && {
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow:
          variant === "dark"
            ? "0 20px 50px rgba(0, 0, 0, 0.5)"
            : variant === "premium"
            ? "0 30px 80px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 168, 89, 0.15)"
            : "0 20px 50px rgba(0, 0, 0, 0.1)",
      },
    }),
  })
);

const GlassCard: React.FC<GlassCardProps> = ({
  variant = "light",
  blur = 20,
  hover = true,
  glow = false,
  animate = false,
  children,
  ...props
}) => {
  return (
    <StyledGlassCard
      variant={variant}
      blur={blur}
      hover={hover}
      glow={glow}
      animate={animate}
      {...props}
    >
      {children}
    </StyledGlassCard>
  );
};

export default GlassCard;
export { GlassCard };
