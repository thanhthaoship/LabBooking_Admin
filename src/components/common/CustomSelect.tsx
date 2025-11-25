"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  styled,
} from "@mui/material";
import { ICustomSelectProps, SelectValue } from "./type";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  "& .MuiFormLabel-root": {
    zIndex: 1,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const StyledSelect = styled(Select)<SelectProps<SelectValue>>(({ theme }) => ({
  height: 44,
  cursor: "pointer",
  fontSize: 14,
  width: "100%",
  fontWeight: 500,
  borderRadius: "8px",
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.background.paper,

  "& .MuiSelect-select": {
    padding: "0 1rem",
  },
}));

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  minWidth = 120,
}: ICustomSelectProps) {
  return (
    <StyledFormControl sx={{ minWidth, maxWidth: "200px" }}>
      <InputLabel>{label}</InputLabel>
      <StyledSelect
        size="small"
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </StyledFormControl>
  );
}
