import React from "react";
import { Dialog, DialogContent, Typography, Box, keyframes } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import { ModernButton } from "./ui";

const scaleIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  onGoHome: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  onGoHome,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "visible",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: "center", overflow: "visible" }}>
        {/* Floating success icon */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)",
            animation: `${scaleIn} 0.5s ease-out`,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 45, color: "white" }} />
        </Box>

        {/* Pulsing ring effect */}
        <Box
          sx={{
            position: "absolute",
            top: -40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "3px solid rgba(16, 185, 129, 0.3)",
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />

        <Box sx={{ pt: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 2,
              animation: `${fadeInUp} 0.5s ease-out 0.2s both`,
            }}
          >
            Application Submitted!
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              mb: 2,
              fontSize: "1rem",
              lineHeight: 1.6,
              animation: `${fadeInUp} 0.5s ease-out 0.3s both`,
            }}
          >
            Thank you for your loan application. We have received your request
            and will review it within 24-48 hours.
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              mb: 4,
              fontSize: "0.875rem",
              animation: `${fadeInUp} 0.5s ease-out 0.4s both`,
            }}
          >
            A confirmation email has been sent to your registered email address
            with your application reference number.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              animation: `${fadeInUp} 0.5s ease-out 0.5s both`,
            }}
          >
            <ModernButton
              variant="outline"
              startIcon={<CloseIcon />}
              onClick={onClose}
              sx={{
                minWidth: 130,
                background: "transparent",
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Close
            </ModernButton>
            <ModernButton
              variant="gradient"
              startIcon={<HomeIcon />}
              onClick={onGoHome}
              sx={{
                minWidth: 130,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Back to Home
            </ModernButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
