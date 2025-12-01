import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

interface ModernButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient"
    | "dark"
    | "success";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  glow?: boolean;
  pill?: boolean;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !["loading", "icon", "iconPosition", "glow", "pill", "variant"].includes(
      prop as string
    ),
})<ModernButtonProps>(({ variant = "primary", glow = false, pill = true }) => ({
  borderRadius: pill ? 100 : 16,
  padding: "14px 32px",
  fontSize: "0.9375rem",
  fontWeight: 600,
  textTransform: "none",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  letterSpacing: "0.01em",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transform: "translateX(-100%)",
  },

  "&:hover::after": {
    animation: `${shimmer} 0.6s ease`,
  },

  ...(variant === "primary" && {
    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
    color: "#fff",
    border: "none",
    boxShadow: glow
      ? "0 8px 30px rgba(0, 168, 89, 0.4), 0 0 60px rgba(0, 168, 89, 0.2)"
      : "0 4px 16px rgba(0, 168, 89, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #008A47 0%, #00A859 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(0, 168, 89, 0.45)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 4px 16px rgba(0, 168, 89, 0.3)",
    },
    "&:disabled": {
      background: "#CBD5E1",
      boxShadow: "none",
      color: "#94A3B8",
    },
  }),

  ...(variant === "secondary" && {
    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(99, 102, 241, 0.4)",
    },
  }),

  ...(variant === "outline" && {
    background: "transparent",
    color: "#00A859",
    border: "2px solid #00A859",
    boxShadow: "none",
    "&:hover": {
      background: "rgba(0, 168, 89, 0.08)",
      borderColor: "#008A47",
      transform: "translateY(-2px)",
    },
  }),

  ...(variant === "ghost" && {
    background: "transparent",
    color: "#475569",
    border: "none",
    boxShadow: "none",
    padding: "12px 20px",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.04)",
      color: "#0F172A",
    },
  }),

  ...(variant === "gradient" && {
    background: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 16px rgba(236, 72, 153, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #DB2777 0%, #EA580C 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(236, 72, 153, 0.4)",
    },
  }),

  ...(variant === "dark" && {
    background: "linear-gradient(135deg, #0A1628 0%, #1E293B 100%)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
    },
  }),

  ...(variant === "success" && {
    background: "#00A859",
    color: "#fff",
    border: "none",
    boxShadow: "0 4px 16px rgba(0, 168, 89, 0.3)",
    "&:hover": {
      background: "#008A47",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(0, 168, 89, 0.4)",
    },
  }),
}));

const ModernButton: React.FC<ModernButtonProps> = ({
  variant = "primary",
  loading = false,
  icon,
  iconPosition = "start",
  glow = false,
  pill = true,
  children,
  disabled,
  startIcon,
  endIcon,
  ...props
}) => {
  const effectiveStartIcon = loading
    ? null
    : startIcon || (iconPosition === "start" ? icon : null);
  const effectiveEndIcon = loading
    ? null
    : endIcon || (iconPosition === "end" ? icon : null);

  return (
    <StyledButton
      variant={variant as never}
      glow={glow}
      pill={pill}
      disabled={disabled || loading}
      startIcon={effectiveStartIcon}
      endIcon={effectiveEndIcon}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={20}
            sx={{
              color:
                variant === "outline" || variant === "ghost"
                  ? "#00A859"
                  : "inherit",
              marginRight: 1,
            }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default ModernButton;
export { ModernButton };
