import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, InputBase, Popper, ClickAwayListener, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronDown, Search, Check } from 'lucide-react';
import { colors, shadows } from '../../theme';

interface Option {
  id: string;
  name: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  searchable?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const SelectWrapper = styled(Box)<{ isOpen?: boolean; hasError?: boolean }>(
  ({ isOpen, hasError }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderRadius: '12px',
    backgroundColor: colors.neutral[50],
    border: `2px solid ${
      hasError ? colors.error : isOpen ? colors.primary[500] : colors.neutral[200]
    }`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.neutral[100],
      borderColor: hasError ? colors.error : colors.primary[300],
    },
    ...(isOpen && {
      backgroundColor: '#FFFFFF',
      boxShadow: `0 0 0 4px ${colors.primary[100]}`,
    }),
  })
);

const OptionsList = styled(Paper)({
  maxHeight: '300px',
  overflowY: 'auto',
  borderRadius: '12px',
  boxShadow: shadows.lg,
  border: `1px solid ${colors.neutral[200]}`,
  marginTop: '8px',
});

const OptionItem = styled(Box)<{ isSelected?: boolean }>(({ isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  cursor: 'pointer',
  backgroundColor: isSelected ? colors.primary[50] : 'transparent',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: isSelected ? colors.primary[100] : colors.neutral[100],
  },
}));

const SearchInput = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderBottom: `1px solid ${colors.neutral[200]}`,
  position: 'sticky',
  top: 0,
  backgroundColor: '#FFFFFF',
  zIndex: 1,
});

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  searchable = false,
  error,
  required,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        {label && (
          <Typography
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
        <SelectWrapper
          ref={anchorRef}
          isOpen={isOpen}
          hasError={!!error}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Typography
            sx={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: selectedOption ? colors.neutral[800] : colors.neutral[400],
            }}
          >
            {selectedOption?.name || placeholder}
          </Typography>
          <ChevronDown
            size={20}
            style={{
              color: colors.neutral[400],
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease',
            }}
          />
        </SelectWrapper>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
        >
          <OptionsList>
            {searchable && (
              <SearchInput>
                <Search size={18} color={colors.neutral[400]} />
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  sx={{ flex: 1, fontSize: '0.875rem' }}
                />
              </SearchInput>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 100).map((option) => (
                <OptionItem
                  key={option.id}
                  isSelected={option.id === value}
                  onClick={() => handleSelect(option.id)}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: option.id === value ? 600 : 400,
                      color: colors.neutral[800],
                    }}
                  >
                    {option.name}
                  </Typography>
                  {option.id === value && (
                    <Check size={18} color={colors.primary[500]} />
                  )}
                </OptionItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ color: colors.neutral[500], fontSize: '0.875rem' }}>
                  No options found
                </Typography>
              </Box>
            )}
          </OptionsList>
        </Popper>
        {error && (
          <Typography sx={{ fontSize: '0.75rem', mt: 0.5, color: colors.error }}>
            {error}
          </Typography>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default Select;
