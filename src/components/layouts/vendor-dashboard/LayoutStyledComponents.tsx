import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { alpha, Box, ButtonBase, styled } from "@mui/material";

import { Paragraph, Span } from "@components/Typography"; // ===============================================================
interface ICompactProps {
  compact?: number;
  collapsed?: number;
  sidebarcompact?: number;
  active?: number;
}

// ===============================================================
const SidebarWrapper = styled(Box)<ICompactProps>(({ theme, compact }) => ({
  height: "100vh",
  position: "fixed",
  width: compact ? 86 : 280,
  transition: "all .2s ease",
  zIndex: theme.zIndex.drawer,
  color: theme.palette.text.primary,
  backgroundColor: "#fdccad",
}));
const NavWrapper = styled(Box)<ICompactProps>(() => ({
  height: "100%",
  paddingLeft: 16,
  paddingRight: 16,
}));
const NavItemButton = styled(ButtonBase)<ICompactProps>(
  ({ theme, active }) => ({
    height: 44,
    width: "100%",
    borderRadius: 8,
    marginBottom: 4,
    padding: "0 12px 0 16px",
    justifyContent: "flex-start",
    transition: "all 0.15s ease",

    ...(active && {
      color: theme.palette.primary.main,
      backgroundColor: "#ffede1",
      "& .MuiSvgIcon-root .secondary": {
        color: theme.palette.primary.main,
        opacity: 1,
      },
    }),
  })
);
const ListLabel = styled(Paragraph)<ICompactProps>(({ compact }) => ({
  fontWeight: 600,
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  transition: "all 0.15s ease",
  ...(compact && {
    opacity: 0,
    width: 0,
  }),
}));
const ListIconWrapper = styled(Box)(({ theme }) => ({
  width: 22,
  height: 22,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  marginRight: "0.8rem",
  justifyContent: "center",
  "& svg": {
    width: "100%",
    height: "100%",
    color: theme.palette.text.disabled,
  },
}));
const ExternalLink = styled("a")(() => ({
  overflow: "hidden",
  whiteSpace: "pre",
  marginBottom: "8px",
  textDecoration: "none",
  cursor: "pointer",
}));
const StyledText = styled(Span)<ICompactProps>(({ compact }) => ({
  whiteSpace: "nowrap",
  transition: "all 0.15s ease",
  ...(compact && {
    opacity: 0,
    width: 0,
  }),
}));
const BulletIcon = styled("div")<ICompactProps>(({ theme, active }) => ({
  width: 3,
  height: 3,
  marginLeft: "10px",
  overflow: "hidden",
  borderRadius: "50%",
  marginRight: "1.3rem",
  background: active ? theme.palette.info.main : theme.palette.common.white,
  boxShadow: active
    ? `0px 0px 0px 4px ${alpha(theme.palette.info[500], 0.2)}`
    : "none",
}));
const BadgeValue = styled(Box)<ICompactProps>(({ compact }) => ({
  padding: "1px 8px",
  overflow: "hidden",
  borderRadius: "300px",
  display: compact ? "none" : "unset",
}));
const ChevronLeftIcon = styled(ChevronLeft)<ICompactProps>(
  ({ compact, sidebarcompact, theme }) => ({
    color: theme.palette.primary.main,
    cursor: "pointer",
    padding: 8,
    height: 40,
    width: 40,
    borderRadius: "50%",
    transition: "all 0.3s",
    display: compact ? "none" : "block",
    transform: sidebarcompact ? "rotate(180deg)" : "rotate(0deg)",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.08),
      color: theme.palette.primary.dark,
    },
  })
);
const ChevronRightIcon = styled(ChevronRight)<ICompactProps>(
  ({ compact, theme }) => ({
    color: theme.palette.primary.main,
    cursor: "pointer",
    padding: 8,
    height: 40,
    width: 40,
    borderRadius: "50%",
    transition: "all 0.3s",
    display: compact ? "none" : "block",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.08),
      color: theme.palette.primary.dark,
    },
  })
);
export {
  BadgeValue,
  BulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLink,
  ListIconWrapper,
  ListLabel,
  NavItemButton,
  NavWrapper,
  SidebarWrapper,
  StyledText,
};
