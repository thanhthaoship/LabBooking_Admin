import type { ThemeOptions } from "@mui/material/styles";

const themesOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#F47A1F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFCD4E",
      contrastText: "#1A1A1A",
    },
    success: {
      main: "#33D067",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#E94560",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#4E97FD",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F9EBD9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2B3445",
      secondary: "#7D879C",
    },
    divider: "rgba(0,0,0,0.12)",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#F47A1F",
          color: "#FFFFFF",
          boxShadow: "none",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fdccad",
          color: "#2B3445",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "rgba(244,122,31,0.12)",
            color: "#F47A1F",
          },
          "&:hover": {
            backgroundColor: "rgba(244,122,31,0.08)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
};

const themeOptions = () => themesOptions;
export default themeOptions;
