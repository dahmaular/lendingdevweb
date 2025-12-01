import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface ModernModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  type?: "success" | "error" | "warning" | "info" | "default";
  size?: "sm" | "md" | "lg";
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -45%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Overlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1300,
  animation: `${fadeIn} 0.2s ease-out`,
}));

interface ModalContainerProps {
  size?: "sm" | "md" | "lg";
}

const ModalContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "size",
})<ModalContainerProps>(({ theme, size = "md" }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  borderRadius: 24,
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  padding: theme.spacing(4),
  maxHeight: "90vh",
  overflowY: "auto",
  animation: `${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: 1301,

  ...(size === "sm" && {
    width: "90%",
    maxWidth: 360,
  }),

  ...(size === "md" && {
    width: "90%",
    maxWidth: 480,
  }),

  ...(size === "lg" && {
    width: "90%",
    maxWidth: 640,
  }),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  color: "#94A3B8",
  backgroundColor: "#F1F5F9",
  width: 36,
  height: 36,

  "&:hover": {
    backgroundColor: "#E2E8F0",
    color: "#64748B",
  },
}));

interface IconContainerProps {
  type: "success" | "error" | "warning" | "info" | "default";
}

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})<IconContainerProps>(({ type }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",

  ...(type === "success" && {
    background:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)",
    color: "#10B981",
  }),

  ...(type === "error" && {
    background:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)",
    color: "#EF4444",
  }),

  ...(type === "warning" && {
    background:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
    color: "#F59E0B",
  }),

  ...(type === "info" && {
    background:
      "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
    color: "#6366F1",
  }),

  ...(type === "default" && {
    display: "none",
  }),
}));

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />;
    case "error":
      return <ErrorOutlineIcon sx={{ fontSize: 32 }} />;
    case "warning":
      return <WarningAmberIcon sx={{ fontSize: 32 }} />;
    case "info":
      return <InfoOutlinedIcon sx={{ fontSize: 32 }} />;
    default:
      return null;
  }
};

const ModernModal: React.FC<ModernModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  primaryAction,
  secondaryAction,
  type = "default",
  size = "md",
}) => {
  if (!open) return null;

  const typeColors: Record<string, string> = {
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#6366F1",
    default: "#6366F1",
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <ModalContainer size={size}>
        <CloseButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>

        {type !== "default" && (
          <IconContainer type={type}>{getIcon(type)}</IconContainer>
        )}

        {title && (
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "#1E293B",
              mb: 2,
              pr: 4,
            }}
          >
            {title}
          </Typography>
        )}

        <Box
          sx={{
            textAlign: "center",
            color: "#64748B",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            mb: actions || primaryAction || secondaryAction ? 3 : 0,
          }}
        >
          {children}
        </Box>

        {(actions || primaryAction || secondaryAction) && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mt: 2,
            }}
          >
            {actions}
            {secondaryAction && (
              <Button
                variant="outlined"
                onClick={secondaryAction.onClick}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#E2E8F0",
                  color: "#64748B",
                  "&:hover": {
                    borderColor: "#CBD5E1",
                    background: "#F8FAFC",
                  },
                }}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="contained"
                onClick={primaryAction.onClick}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${typeColors[type]} 0%, ${typeColors[type]}dd 100%)`,
                  boxShadow: `0 4px 14px ${typeColors[type]}40`,
                  "&:hover": {
                    boxShadow: `0 6px 20px ${typeColors[type]}50`,
                  },
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </Box>
        )}
      </ModalContainer>
    </>
  );
};

export default ModernModal;
