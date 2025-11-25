import { Box, Drawer, styled } from "@mui/material"; // ==========================================================
import { PropsWithChildren } from "react";

// ==========================================================
const Wrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "inherit",
  position: "fixed",
  overflow: "hidden",
  boxShadow: theme.shadows[1],
  zIndex: theme.zIndex.drawer + 3,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.grey[900],
}));

interface LayoutDrawerProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
}

const LayoutDrawer = (props: LayoutDrawerProps) => {
  const { children, open, onClose, drawerWidth = 280 } = props;
  return (
    <Drawer
      open={open}
      anchor="left"
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: drawerWidth,
          },
        },
      }}
    >
      <Wrapper>{children}</Wrapper>
    </Drawer>
  );
};

export default LayoutDrawer;
