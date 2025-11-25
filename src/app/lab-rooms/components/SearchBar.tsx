'use client';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar({ value, onChange, placeholder = 'Tìm phòng lab' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ minWidth: { xs: 180, md: 280 }, bgcolor: 'background.paper' }}
    />
  );
}
