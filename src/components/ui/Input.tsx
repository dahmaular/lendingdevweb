import React from 'react';
import { Box, Typography, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors, shadows } from '../../theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
}

const InputWrapper = styled(Box)<{ hasError?: boolean; isFocused?: boolean }>(
  ({ hasError, isFocused }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    backgroundColor: colors.neutral[50],
    border: `2px solid ${
      hasError ? colors.error : isFocused ? colors.primary[500] : colors.neutral[200]
    }`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.neutral[100],
      borderColor: hasError ? colors.error : colors.primary[300],
    },
    ...(isFocused && {
      backgroundColor: '#FFFFFF',
      boxShadow: `0 0 0 4px ${hasError ? 'rgba(255, 71, 87, 0.1)' : colors.primary[100]}`,
    }),
  })
);

const StyledInput = styled(InputBase)({
  flex: 1,
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: colors.neutral[800],
  '& input': {
    padding: 0,
    '&::placeholder': {
      color: colors.neutral[400],
      opacity: 1,
    },
  },
});

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  error,
  helpText,
  required,
  disabled,
  maxLength,
  name,
  id,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography
          component="label"
          sx={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: colors.neutral[700],
            mb: 1,
          }}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: colors.error, ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}
      <InputWrapper hasError={!!error} isFocused={isFocused}>
        {icon && (
          <Box sx={{ color: isFocused ? colors.primary[500] : colors.neutral[400], display: 'flex' }}>
            {icon}
          </Box>
        )}
        <StyledInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          type={type}
          disabled={disabled}
          inputProps={{ maxLength }}
          name={name}
          id={id}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </InputWrapper>
      {(error || helpText) && (
        <Typography
          sx={{
            fontSize: '0.75rem',
            mt: 0.5,
            color: error ? colors.error : colors.neutral[500],
          }}
        >
          {error || helpText}
        </Typography>
      )}
    </Box>
  );
};

export default Input;
