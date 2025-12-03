import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors, shadows } from '../../theme';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

const StyledButton = styled(MuiButton)<{ customVariant: string }>(({ customVariant }) => ({
  borderRadius: '10px',
  padding: '12px 24px',
  fontSize: '0.9375rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  ...(customVariant === 'primary' && {
    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
    color: '#FFFFFF',
    boxShadow: shadows.md,
    '&:hover': {
      background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      background: colors.neutral[300],
      color: colors.neutral[500],
      boxShadow: 'none',
    },
  }),

  ...(customVariant === 'secondary' && {
    background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
    color: '#FFFFFF',
    boxShadow: shadows.md,
    '&:hover': {
      background: `linear-gradient(135deg, ${colors.secondary[600]} 0%, ${colors.secondary[700]} 100%)`,
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
  }),

  ...(customVariant === 'outline' && {
    background: 'transparent',
    color: colors.primary[500],
    border: `2px solid ${colors.primary[500]}`,
    '&:hover': {
      background: colors.primary[50],
      borderColor: colors.primary[600],
    },
  }),

  ...(customVariant === 'ghost' && {
    background: 'transparent',
    color: colors.neutral[700],
    '&:hover': {
      background: colors.neutral[100],
    },
  }),

  ...(customVariant === 'danger' && {
    background: colors.error,
    color: '#FFFFFF',
    '&:hover': {
      background: '#E53E3E',
      boxShadow: shadows.lg,
    },
  }),
}));

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      customVariant={variant}
      disabled={disabled || loading}
      startIcon={!loading && iconPosition === 'start' ? icon : undefined}
      endIcon={!loading && iconPosition === 'end' ? icon : undefined}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: children ? 1 : 0 }} />
      ) : null}
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

export default Button;
