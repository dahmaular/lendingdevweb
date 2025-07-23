import React from "react";
import { Dialog, DialogContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
          borderRadius: 3,
          p: 2,
          textAlign: "center",
        },
      }}
    >
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 80, mb: 2, color: "#4caf50" }}
          />

          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Application Submitted Successfully!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
            Thank you for your loan application. We have received your request
            and will review it within 24-48 hours.
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, color: "#888" }}>
            A confirmation email has been sent to your registered email address
            with your application reference number.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="outlined" onClick={onClose} sx={{ minWidth: 120 }}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onGoHome}
              sx={{ minWidth: 120 }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
