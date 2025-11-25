import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import Toggle from "@components/icons/Toggle";
import { Box, styled, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import AccountPopover from "./popovers/AccountPopover";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
}));
const StyledToolBar = styled(Toolbar)(() => ({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
}));
const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: theme.palette.grey[100],
}));


// ===================================================================
const DashboardNavbar = ({
  handleDrawerToggle,
  setSidebarCompact = () => {},
}) => {
  const downLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <DashboardNavbarRoot position="sticky">
      <Container maxWidth="xl">
        <StyledToolBar disableGutters>
          <ToggleWrapper
            onClick={downLg ? handleDrawerToggle : setSidebarCompact}
          >
            <Toggle />
          </ToggleWrapper>

          <Box flexGrow={1} />

          <FlexBox alignItems="center" gap={2}>
            {/* <StyledInputBase
              placeholder="Search anything..."
              startAdornment={
                <Search
                  sx={{
                    color: "grey.500",
                    mr: 1,
                  }}
                />
              }
            /> */}
            {/* <NotificationsPopover /> */}
            <AccountPopover />
          </FlexBox>
        </StyledToolBar>
      </Container>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
