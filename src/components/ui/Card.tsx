import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { colors, shadows } from '../../theme';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const paddingValues = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '32px',
};

const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  padding = 'md',
  children,
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: '16px',
      padding: paddingValues[padding],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          backgroundColor: '#FFFFFF',
          boxShadow: shadows.lg,
        };
      case 'outlined':
        return {
          ...base,
          backgroundColor: '#FFFFFF',
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: 'none',
        };
      case 'gradient':
        return {
          ...base,
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
          color: '#FFFFFF',
          boxShadow: shadows.lg,
        };
      case 'glass':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: shadows.md,
        };
      default:
        return {
          ...base,
          backgroundColor: '#FFFFFF',
          boxShadow: shadows.card,
          border: `1px solid ${colors.neutral[200]}`,
        };
    }
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: shadows.xl } : undefined}
      style={{
        ...getStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
