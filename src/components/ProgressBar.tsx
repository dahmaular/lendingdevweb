import React from "react";
import { Box, Theme } from "@mui/material";

interface ProgressBarProps {
  currentStep: number;
}

const getStepColor = (theme: Theme, completed: boolean, active: boolean) => {
  if (completed) return theme.palette.success.main;
  if (active) return theme.palette.primary.main;
  return "#fff";
};

const getStepBorderColor = (
  theme: Theme,
  completed: boolean,
  active: boolean
) => {
  if (completed) return theme.palette.success.main;
  if (active) return theme.palette.primary.main;
  return theme.palette.grey[300];
};

const getTextColor = (theme: Theme, completed: boolean, active: boolean) => {
  if (completed || active) return "#fff";
  return theme.palette.text.secondary;
};

const steps = [
  "Credit Score",
  "Account Review",
  "Personal Details",
  "Loan Application",
  "Loan Confirmation",
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          mb: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            background: (theme) => theme.palette.grey[300],
            height: "2px",
            width: "100%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 0,
          },
        }}
      >
        {steps.map((_, i) => (
          <Box
            key={`step-${i + 1}`}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: (theme) =>
                getStepColor(theme, currentStep > i + 1, currentStep === i + 1),
              border: (theme) =>
                `2px solid ${getStepBorderColor(
                  theme,
                  currentStep > i + 1,
                  currentStep === i + 1
                )}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: (theme) =>
                getTextColor(theme, currentStep > i + 1, currentStep === i + 1),
              zIndex: 1,
            }}
          >
            {i + 1}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          "& > *": {
            maxWidth: "calc(25% - 8px)", // Adjust width for 4 items
            textAlign: "center",
            fontSize: "0.875rem",
          },
        }}
      >
        {steps.map((step, i) => (
          <Box
            key={`label-${i + 1}`}
            sx={{
              fontSize: "0.875rem",
              color: (theme) =>
                getStepBorderColor(
                  theme,
                  currentStep > i + 1,
                  currentStep === i + 1
                ),
              fontWeight: (theme) => (currentStep === i + 1 ? 600 : 400),
              textAlign: "center",
              flex: 1,
            }}
          >
            {step}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProgressBar;
