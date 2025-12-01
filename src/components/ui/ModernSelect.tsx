import React from "react";
import {
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Option {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
}

export interface ModernSelectProps
  extends Omit<SelectProps<string>, "onChange"> {
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  startIcon?: React.ReactNode;
  icon?: React.ReactNode;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

    "&:hover": {
      backgroundColor: "#F1F5F9",
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.15)",
    },

    "& fieldset": {
      borderColor: "#E2E8F0",
      borderWidth: "1.5px",
    },

    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
      borderWidth: "2px",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#64748B",
    fontWeight: 500,

    "&.Mui-focused": {
      color: "#6366F1",
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "12px 16px",
  borderRadius: 8,
  margin: "2px 8px",
  fontSize: "0.9375rem",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#F1F5F9",
  },

  "&.Mui-selected": {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    color: "#6366F1",
    fontWeight: 500,

    "&:hover": {
      backgroundColor: "rgba(99, 102, 241, 0.15)",
    },
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  margin: "8px 16px",
  width: "calc(100% - 32px)",

  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: "#F8FAFC",

    "& fieldset": {
      borderColor: "#E2E8F0",
    },

    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
    },
  },
}));

const ModernSelect: React.FC<ModernSelectProps> = ({
  options,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  onChange,
  label,
  value,
  startIcon,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const getOptionLabel = (opt: Option) => opt.label || opt.name || "";

  const filteredOptions =
    searchable && searchQuery
      ? options.filter((opt) =>
          getOptionLabel(opt).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  return (
    <StyledFormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange?.(e.target.value as string)}
        IconComponent={KeyboardArrowDownIcon}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              maxHeight: 400,
              mt: 1,
            },
          },
        }}
        sx={{
          "& .MuiSelect-select": {
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
          "& .MuiSelect-icon": {
            color: "#94A3B8",
            right: 12,
          },
        }}
        startAdornment={
          startIcon ? (
            <InputAdornment position="start" sx={{ ml: 1 }}>
              {startIcon}
            </InputAdornment>
          ) : undefined
        }
        {...props}
      >
        {searchable && (
          <ListSubheader sx={{ p: 0, lineHeight: "normal" }}>
            <SearchField
              size="small"
              autoFocus
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </ListSubheader>
        )}

        {filteredOptions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "#94A3B8" }}>
            No options found
          </Box>
        ) : (
          filteredOptions.map((option) => (
            <StyledMenuItem
              key={option.value || option.id}
              value={option.value || option.id}
            >
              {option.label || option.name}
            </StyledMenuItem>
          ))
        )}
      </Select>
    </StyledFormControl>
  );
};

export default ModernSelect;
