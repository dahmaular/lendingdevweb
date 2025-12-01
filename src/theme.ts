import { createTheme } from "@mui/material/styles";

// Credit Direct inspired color palette - Modern, Vibrant, Professional
export const colors = {
  primary: {
    main: "#00A859",
    light: "#2DD47E",
    dark: "#008A47",
    gradient: "linear-gradient(135deg, #00A859 0%, #00C96A 50%, #2DD47E 100%)",
    gradientHover: "linear-gradient(135deg, #008A47 0%, #00A859 50%, #00C96A 100%)",
  },
  secondary: {
    main: "#6366F1",
    light: "#818CF8",
    dark: "#4F46E5",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  },
  accent: {
    purple: "#8B5CF6",
    pink: "#EC4899",
    orange: "#F97316",
    cyan: "#06B6D4",
    yellow: "#FBBF24",
    teal: "#14B8A6",
  },
  background: {
    default: "#FAFBFC",
    paper: "#FFFFFF",
    dark: "#0A1628",
    darkSecondary: "#111C32",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A2744 40%, #0F1D32 100%)",
    gradientLight: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)",
    hero: "linear-gradient(180deg, #0A1628 0%, #132238 100%)",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    muted: "#94A3B8",
    white: "#FFFFFF",
    dark: "#1E293B",
  },
  border: {
    light: "#E2E8F0",
    default: "#CBD5E1",
    focus: "#00A859",
  },
  status: {
    success: "#00A859",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  glass: {
    white: "rgba(255, 255, 255, 0.85)",
    whiteLight: "rgba(255, 255, 255, 0.95)",
    dark: "rgba(10, 22, 40, 0.85)",
    green: "rgba(0, 168, 89, 0.08)",
    blur: "20px",
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.2)",
  "3xl": "0 35px 60px -15px rgb(0 0 0 / 0.25)",
  card: "0 4px 20px rgba(0, 0, 0, 0.08)",
  cardHover: "0 20px 40px rgba(0, 0, 0, 0.12)",
  button: "0 4px 14px rgba(0, 168, 89, 0.35)",
  buttonHover: "0 8px 25px rgba(0, 168, 89, 0.45)",
  glow: "0 0 50px rgba(0, 168, 89, 0.25)",
  glowPurple: "0 0 50px rgba(99, 102, 241, 0.25)",
  input: "0 2px 8px rgba(0, 0, 0, 0.04)",
  inputFocus: "0 0 0 4px rgba(0, 168, 89, 0.12)",
  floating: "0 32px 64px -12px rgba(0, 0, 0, 0.14)",
};

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
  pill: "100px",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: "#fff",
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: "#fff",
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    error: { main: colors.status.error },
    warning: { main: colors.status.warning },
    success: { main: colors.status.success },
    info: { main: colors.status.info },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" },
    h2: { fontSize: "2.75rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" },
    h3: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" },
    h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 },
    h6: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
    button: { fontSize: "0.9375rem", fontWeight: 600, textTransform: "none" as const },
  },
  shape: { borderRadius: 16 },
  shadows: [
    "none",
    shadows.sm, shadows.sm, shadows.md, shadows.md,
    shadows.lg, shadows.lg, shadows.lg,
    shadows.xl, shadows.xl, shadows.xl, shadows.xl,
    shadows["2xl"], shadows["2xl"], shadows["2xl"], shadows["2xl"],
    shadows["3xl"], shadows["3xl"], shadows["3xl"], shadows["3xl"],
    shadows["3xl"], shadows["3xl"], shadows["3xl"], shadows["3xl"], shadows["3xl"],
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.pill,
          padding: "12px 28px",
          fontSize: "0.9375rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
