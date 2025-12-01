import React from "react";
import { Box, keyframes } from "@mui/material";

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(50px, -30px) rotate(5deg); }
  50% { transform: translate(20px, 40px) rotate(-5deg); }
  75% { transform: translate(-30px, 20px) rotate(3deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-40px, 50px) rotate(-8deg); }
  66% { transform: translate(60px, -20px) rotate(8deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

interface AnimatedBackgroundProps {
  variant?: "dark" | "light" | "gradient";
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = "dark",
  children,
}) => {
  const isDark = variant === "dark";
  const isGradient = variant === "gradient";

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg, #0A1628 0%, #111C32 40%, #0F1D32 100%)"
          : isGradient
          ? "linear-gradient(135deg, #00A859 0%, #00C96A 50%, #6366F1 100%)"
          : "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #FAFBFC 100%)",
        backgroundSize: isGradient ? "200% 200%" : "100% 100%",
        animation: isGradient ? `${gradientShift} 15s ease infinite` : "none",
      }}
    >
      {/* Floating Orb 1 - Green */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(0, 168, 89, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 168, 89, 0.2) 0%, transparent 70%)",
          top: { xs: "-100px", md: "-150px" },
          left: { xs: "-100px", md: "-100px" },
          animation: `${float1} 20s ease-in-out infinite`,
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      {/* Floating Orb 2 - Purple */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "250px", md: "400px" },
          height: { xs: "250px", md: "400px" },
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          top: "30%",
          right: { xs: "-100px", md: "-100px" },
          animation: `${float2} 25s ease-in-out infinite`,
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />

      {/* Floating Orb 3 - Cyan */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "200px", md: "350px" },
          height: { xs: "200px", md: "350px" },
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
          bottom: { xs: "-50px", md: "10%" },
          left: "30%",
          animation: `${float3} 18s ease-in-out infinite`,
          pointerEvents: "none",
          filter: "blur(45px)",
        }}
      />

      {/* Floating Orb 4 - Pink accent */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "150px", md: "250px" },
          height: { xs: "150px", md: "250px" },
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          bottom: "20%",
          right: "20%",
          animation: `${pulse} 8s ease-in-out infinite`,
          pointerEvents: "none",
          filter: "blur(35px)",
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDark
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Decorative shapes */}
      <Box
        sx={{
          position: "absolute",
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          border: isDark
            ? "2px solid rgba(0, 168, 89, 0.2)"
            : "2px solid rgba(0, 168, 89, 0.3)",
          top: "15%",
          right: "15%",
          transform: "rotate(45deg)",
          animation: `${float1} 15s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: isDark
            ? "2px solid rgba(99, 102, 241, 0.2)"
            : "2px solid rgba(99, 102, 241, 0.3)",
          bottom: "25%",
          left: "10%",
          animation: `${float2} 12s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "16px",
          background: isDark
            ? "rgba(0, 168, 89, 0.05)"
            : "rgba(0, 168, 89, 0.08)",
          border: isDark
            ? "1px solid rgba(0, 168, 89, 0.1)"
            : "1px solid rgba(0, 168, 89, 0.15)",
          top: "60%",
          left: "5%",
          transform: "rotate(-15deg)",
          animation: `${float3} 20s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export default AnimatedBackground;
export { AnimatedBackground };
