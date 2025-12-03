import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check } from 'lucide-react';
import { colors } from '../../theme';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

const StepWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const StepCircle = styled(Box)<{ status: 'completed' | 'current' | 'upcoming' }>(
  ({ status }) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    ...(status === 'completed' && {
      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
      color: '#FFFFFF',
      boxShadow: `0 4px 12px ${colors.primary[200]}`,
    }),
    ...(status === 'current' && {
      background: '#FFFFFF',
      border: `3px solid ${colors.primary[500]}`,
      color: colors.primary[500],
      boxShadow: `0 0 0 4px ${colors.primary[100]}`,
    }),
    ...(status === 'upcoming' && {
      background: colors.neutral[100],
      border: `2px solid ${colors.neutral[300]}`,
      color: colors.neutral[400],
    }),
  })
);

const StepLine = styled(Box)<{ completed: boolean }>(({ completed }) => ({
  flex: 1,
  height: '3px',
  marginLeft: '8px',
  marginRight: '8px',
  borderRadius: '4px',
  background: completed
    ? `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`
    : colors.neutral[200],
  transition: 'background 0.3s ease',
}));

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  const getStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep - 1) return 'completed';
    if (index === currentStep - 1) return 'current';
    return 'upcoming';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <StepWrapper>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <StepCircle status={getStatus(index)}>
                {getStatus(index) === 'completed' ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </StepCircle>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: '0.75rem',
                  fontWeight: getStatus(index) === 'current' ? 600 : 400,
                  color:
                    getStatus(index) === 'upcoming'
                      ? colors.neutral[400]
                      : colors.neutral[700],
                  textAlign: 'center',
                  maxWidth: '80px',
                }}
              >
                {step}
              </Typography>
            </Box>
            {index < steps.length - 1 && (
              <StepLine completed={index < currentStep - 1} />
            )}
          </React.Fragment>
        ))}
      </StepWrapper>
    </Box>
  );
};

export default ProgressSteps;
