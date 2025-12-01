import React from "react";
import { Box, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.85); opacity: 0.7; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

interface ModernSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "ring" | "dots" | "pulse" | "gradient";
  color?: "primary" | "white" | "dark";
}

const sizes = {
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

const colors = {
  primary: "#00A859",
  white: "#FFFFFF",
  dark: "#0F172A",
};

const RingSpinner = styled(Box, {
  shouldForwardProp: (prop) => !["size", "color"].includes(prop as string),
})<{ size: number; spinnerColor: string }>(({ size, spinnerColor }) => ({
  width: size,
  height: size,
  border: `${size / 10}px solid ${spinnerColor}20`,
  borderTopColor: spinnerColor,
  borderRadius: "50%",
  animation: `${spin} 0.8s linear infinite`,
}));

const GradientSpinner = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  background: `conic-gradient(from 0deg, transparent, #00A859, transparent)`,
  position: "relative",
  animation: `${spin} 1s linear infinite`,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: size / 8,
    background: "#fff",
    borderRadius: "50%",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: size / 5,
    height: size / 5,
    background: "#00A859",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0, 168, 89, 0.4)",
  },
}));

const PulseSpinner = styled(Box, {
  shouldForwardProp: (prop) => !["size", "color"].includes(prop as string),
})<{ size: number; spinnerColor: string }>(({ size, spinnerColor }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${spinnerColor} 0%, ${spinnerColor}80 100%)`,
  animation: `${pulse} 1.2s ease-in-out infinite`,
  boxShadow: `0 0 ${size / 2}px ${spinnerColor}40`,
}));

const DotsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: number }>(({ size }) => ({
  display: "flex",
  gap: size / 4,
  alignItems: "center",
  justifyContent: "center",
}));

const Dot = styled(Box, {
  shouldForwardProp: (prop) => !["size", "delay", "color"].includes(prop as string),
})<{ size: number; delay: number; dotColor: string }>(({ size, delay, dotColor }) => ({
  width: size / 3,
  height: size / 3,
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${dotColor} 0%, ${dotColor}CC 100%)`,
  animation: `${bounce} 1.4s ease-in-out ${delay}s infinite both`,
  boxShadow: `0 2px 8px ${dotColor}40`,
}));

const ModernSpinner: React.FC<ModernSpinnerProps> = ({
  size = "md",
  variant = "gradient",
  color = "primary",
}) => {
  const pixelSize = sizes[size];
  const spinnerColor = colors[color];

  if (variant === "dots") {
    return (
      <DotsContainer size={pixelSize}>
        {[0, 0.16, 0.32].map((delay, i) => (
          <Dot key={i} size={pixelSize} delay={delay} dotColor={spinnerColor} />
        ))}
      </DotsContainer>
    );
  }

  if (variant === "pulse") {
    return <PulseSpinner size={pixelSize} spinnerColor={spinnerColor} />;
  }

  if (variant === "gradient") {
    return <GradientSpinner size={pixelSize} />;
  }

  return <RingSpinner size={pixelSize} spinnerColor={spinnerColor} />;
};

// DotsSpinner component for loading states
const DotsSpinner: React.FC<{ color?: "primary" | "white" | "dark" }> = ({
  color = "primary",
}) => {
  return <ModernSpinner size="sm" variant="dots" color={color} />;
};

export default ModernSpinner;
export { ModernSpinner, DotsSpinner };
