import React from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface ModernInputProps extends Omit<TextFieldProps, "variant"> {
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconPosition?: "start" | "end";
  success?: boolean;
  rounded?: boolean;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !["success", "rounded"].includes(prop as string),
})<{ success?: boolean; rounded?: boolean }>(({ success, rounded }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: rounded ? 100 : 16,
    backgroundColor: "#FFFFFF",
    fontSize: "0.9375rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "2px solid transparent",

    "&:hover": {
      backgroundColor: "#FAFBFC",
      "& fieldset": {
        borderColor: "#CBD5E1",
      },
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: success
        ? "0 0 0 4px rgba(0, 168, 89, 0.12)"
        : "0 0 0 4px rgba(0, 168, 89, 0.1)",
      "& fieldset": {
        borderColor: success ? "#00A859" : "#00A859",
        borderWidth: "2px",
      },
    },

    "& fieldset": {
      borderColor: "#E2E8F0",
      borderWidth: "2px",
      transition: "all 0.3s ease",
    },

    "& input": {
      padding: "18px 20px",
      fontWeight: 500,
      "&::placeholder": {
        color: "#94A3B8",
        opacity: 1,
        fontWeight: 400,
      },
    },

    "& .MuiInputAdornment-root": {
      marginRight: 4,
      "& svg": {
        color: "#94A3B8",
        fontSize: 22,
        transition: "color 0.3s ease",
      },
    },

    "&.Mui-focused .MuiInputAdornment-root svg": {
      color: "#00A859",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontSize: "0.9375rem",
    fontWeight: 500,
    transform: "translate(20px, 18px) scale(1)",

    "&.Mui-focused": {
      color: "#00A859",
      transform: "translate(14px, -9px) scale(0.85)",
    },

    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.85)",
    },
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 8,
    marginTop: 8,
    fontSize: "0.8125rem",
    fontWeight: 500,

    "&.Mui-error": {
      color: "#EF4444",
    },
  },
}));

const ModernInput: React.FC<ModernInputProps> = ({
  icon,
  startIcon,
  endIcon,
  iconPosition = "start",
  success = false,
  rounded = false,
  InputProps,
  ...props
}) => {
  const effectiveStartIcon =
    startIcon || (iconPosition === "start" ? icon : undefined);
  const effectiveEndIcon =
    endIcon || (iconPosition === "end" ? icon : undefined);

  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      success={success}
      rounded={rounded}
      InputProps={{
        ...InputProps,
        ...(effectiveStartIcon && {
          startAdornment: (
            <InputAdornment position="start">
              {effectiveStartIcon}
            </InputAdornment>
          ),
        }),
        ...(effectiveEndIcon && {
          endAdornment: (
            <InputAdornment position="end">{effectiveEndIcon}</InputAdornment>
          ),
        }),
      }}
      {...props}
    />
  );
};

export default ModernInput;
export { ModernInput };
