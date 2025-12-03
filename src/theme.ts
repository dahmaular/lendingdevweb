import { createTheme } from '@mui/material/styles';

export const colors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#1E88E5',
    600: '#1976D2',
    700: '#1565C0',
    800: '#0D47A1',
    900: '#0A2647',
  },
  secondary: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1',
    400: '#26C6DA',
    500: '#00ACC1',
    600: '#00838F',
    700: '#006064',
    800: '#004D40',
    900: '#002F2F',
  },
  accent: {
    orange: '#FF6B35',
    green: '#00C853',
    purple: '#7C4DFF',
  },
  neutral: {
    50: '#FAFBFC',
    100: '#F6F8FA',
    200: '#E8ECF0',
    300: '#D1D9E0',
    400: '#A3B1BF',
    500: '#6B7C93',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#0D1117',
  },
  success: '#00C853',
  warning: '#FFB020',
  error: '#FF4757',
  info: '#00ACC1',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(30, 136, 229, 0.3)',
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
    },
    error: { main: colors.error },
    warning: { main: colors.warning },
    success: { main: colors.success },
    info: { main: colors.info },
    background: {
      default: colors.neutral[100],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[500],
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

export default theme;
