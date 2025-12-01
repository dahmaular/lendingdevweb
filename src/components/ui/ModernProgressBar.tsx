import React from "react";
import { Box, Typography, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

interface ModernProgressBarProps {
  value?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: "default" | "gradient" | "success" | "steps";
  steps?: number;
  currentStep?: number;
  stepLabels?: string[];
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const ProgressContainer = styled(Box)({
  width: "100%",
});

const ProgressTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: "sm" | "md" | "lg" }>(({ size }) => ({
  width: "100%",
  height: size === "sm" ? 6 : size === "lg" ? 12 : 8,
  backgroundColor: "#E2E8F0",
  borderRadius: 100,
  overflow: "hidden",
  position: "relative",
}));

const ProgressFill = styled(Box, {
  shouldForwardProp: (prop) => !["variant", "animate"].includes(prop as string),
})<{ variant: string; animate?: boolean }>(({ variant, animate }) => ({
  height: "100%",
  borderRadius: 100,
  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",

  ...(variant === "default" && {
    background: "linear-gradient(90deg, #00A859 0%, #00C96A 100%)",
  }),

  ...(variant === "gradient" && {
    background: "linear-gradient(90deg, #00A859 0%, #00C96A 50%, #2DD47E 100%)",
  }),

  ...(variant === "success" && {
    background: "#00A859",
  }),

  ...(animate && {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      animation: `${shimmer} 2s infinite`,
    },
  }),
}));

const StepIndicator = styled(Box, {
  shouldForwardProp: (prop) =>
    !["active", "completed"].includes(prop as string),
})<{ active?: boolean; completed?: boolean }>(({ active, completed }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.875rem",
  fontWeight: 600,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  zIndex: 2,

  ...(completed && {
    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0, 168, 89, 0.3)",
  }),

  ...(active &&
    !completed && {
      background: "#fff",
      color: "#00A859",
      border: "3px solid #00A859",
      boxShadow: "0 0 0 4px rgba(0, 168, 89, 0.1)",
      animation: `${pulse} 2s infinite`,
    }),

  ...(!active &&
    !completed && {
      background: "#F1F5F9",
      color: "#94A3B8",
      border: "2px solid #E2E8F0",
    }),
}));

const ModernProgressBar: React.FC<ModernProgressBarProps> = ({
  value = 0,
  label,
  showPercentage = false,
  variant = "gradient",
  steps,
  currentStep = 0,
  stepLabels = [],
  size = "md",
  animate = true,
}) => {
  if (steps) {
    return (
      <ProgressContainer>
        {label && (
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#0F172A",
              mb: 3,
            }}
          >
            {label}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Connection line */}
          <Box
            sx={{
              position: "absolute",
              top: "18px",
              left: "18px",
              right: "18px",
              height: "3px",
              background: "#E2E8F0",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "18px",
              left: "18px",
              width: `calc(${((currentStep - 1) / (steps - 1)) * 100}% - 18px)`,
              height: "3px",
              background: "linear-gradient(90deg, #00A859 0%, #00C96A 100%)",
              zIndex: 1,
              transition: "width 0.5s ease",
            }}
          />

          {Array.from({ length: steps }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <StepIndicator
                completed={index < currentStep}
                active={index === currentStep}
              >
                {index < currentStep ? "✓" : index + 1}
              </StepIndicator>
              {stepLabels[index] && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: index <= currentStep ? 600 : 400,
                    color: index <= currentStep ? "#0F172A" : "#94A3B8",
                    textAlign: "center",
                    maxWidth: "80px",
                  }}
                >
                  {stepLabels[index]}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </ProgressContainer>
    );
  }

  return (
    <ProgressContainer>
      {(label || showPercentage) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          {label && (
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0F172A",
              }}
            >
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#00A859",
              }}
            >
              {Math.round(value)}%
            </Typography>
          )}
        </Box>
      )}
      <ProgressTrack size={size}>
        <ProgressFill
          variant={variant}
          animate={animate}
          sx={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </ProgressTrack>
    </ProgressContainer>
  );
};

export default ModernProgressBar;
export { ModernProgressBar };
