import React from 'react';
import { Box, Typography, IconButton, Backdrop, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { colors, shadows } from '../../theme';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const ModalOverlay = styled(Backdrop)({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
});

const ModalContainer = styled(Box)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '420px',
  width: '90%',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: shadows.xl,
  outline: 'none',
  zIndex: 1400,
});

const IconWrapper = styled(Box)<{ modalType: string }>(({ modalType }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  ...(modalType === 'success' && {
    background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.success}10 100%)`,
    color: colors.success,
  }),
  ...(modalType === 'error' && {
    background: `linear-gradient(135deg, ${colors.error}20 0%, ${colors.error}10 100%)`,
    color: colors.error,
  }),
  ...(modalType === 'warning' && {
    background: `linear-gradient(135deg, ${colors.warning}20 0%, ${colors.warning}10 100%)`,
    color: colors.warning,
  }),
  ...(modalType === 'info' && {
    background: `linear-gradient(135deg, ${colors.info}20 0%, ${colors.info}10 100%)`,
    color: colors.info,
  }),
}));

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  message,
  type = 'info',
  primaryAction,
  secondaryAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={32} />;
      case 'error':
        return <AlertCircle size={32} />;
      case 'warning':
        return <AlertTriangle size={32} />;
      default:
        return <Info size={32} />;
    }
  };

  if (!open) return null;

  return (
    <>
      <ModalOverlay open={open} onClick={onClose} />
      <Fade in={open}>
        <ModalContainer>
          <Box sx={{ position: 'relative', p: 3 }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: colors.neutral[400],
                '&:hover': { color: colors.neutral[600] },
              }}
            >
              <X size={20} />
            </IconButton>
            
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <IconWrapper modalType={type}>{getIcon()}</IconWrapper>
              
              {title && (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: colors.neutral[800],
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
              )}
              
              <Typography
                sx={{
                  color: colors.neutral[600],
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                {message}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {secondaryAction && (
                  <Button
                    variant="outline"
                    onClick={secondaryAction.onClick}
                    sx={{ minWidth: '120px' }}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
                {primaryAction && (
                  <Button
                    variant="primary"
                    onClick={primaryAction.onClick}
                    sx={{ minWidth: '120px' }}
                  >
                    {primaryAction.label}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </ModalContainer>
      </Fade>
    </>
  );
};

export default Modal;
