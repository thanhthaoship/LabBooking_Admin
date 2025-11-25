import { alpha, styled, SxProps, Theme } from "@mui/material";
import SimpleBar, { Props as SimpleBarProps } from "simplebar-react";
import { ReactNode } from "react";

const StyledScrollBar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&.simplebar-visible:before": {
      opacity: 1,
    },
    "&:before": {
      backgroundColor: alpha(theme.palette.grey[400], 0.6),
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 9,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },

  "& .simplebar-placeholder": {
    display: "none",
  },
})); // =============================================================

// =============================================================
interface ScrollbarProps extends Omit<SimpleBarProps, "ref"> {
  children: ReactNode;
  sx?: SxProps<Theme>;
  autoHide?: boolean;
}

const Scrollbar = ({ children, sx, ...props }: ScrollbarProps) => {
  return (
    <StyledScrollBar sx={sx} {...props}>
      {children}
    </StyledScrollBar>
  );
};

export default Scrollbar;
