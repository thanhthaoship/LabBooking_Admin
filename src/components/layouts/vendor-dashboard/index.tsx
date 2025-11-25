"use client";

import { Box, BoxProps, styled } from "@mui/material";
import { Fragment, PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

interface BoxWrapperProps extends BoxProps {
  compact: number;
}

const BodyWrapper = styled(Box)<BoxWrapperProps>(({ theme, compact }) => ({
  transition: "margin-left 0.3s",
  marginLeft: compact === 2 ? "0px" : compact ? "86px" : "280px",
  [theme.breakpoints.down("lg")]: {
    marginLeft: 0,
  },
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  transition: "all 0.3s",
  [theme.breakpoints.up("lg")]: {
    maxWidth: 1400,
    margin: "auto",
  },
}));

const VendorDashboardLayout = ({ children }: PropsWithChildren) => {
  const [sidebarCompact, setSidebarCompact] = useState(0);
  const [showMobileSideBar, setShowMobileSideBar] = useState(0);
  const pathname = usePathname();
  const hideChrome = pathname.startsWith("/auth");

  const handleCompactToggle = () =>
    setSidebarCompact((state) => (state ? 0 : 1));

  const handleMobileDrawerToggle = () =>
    setShowMobileSideBar((state) => (state ? 0 : 1));

  return (
    <Fragment>
      {!hideChrome && (
        <DashboardSidebar
          sidebarCompact={sidebarCompact}
          showMobileSideBar={showMobileSideBar}
          setShowMobileSideBar={handleMobileDrawerToggle}
        />
      )}

      <BodyWrapper compact={hideChrome ? 2 : sidebarCompact ? 1 : 0}>
        {!hideChrome && (
          <DashboardNavbar
            handleDrawerToggle={handleMobileDrawerToggle}
            setSidebarCompact={handleCompactToggle}
          />
        )}
        <InnerWrapper>{children}</InnerWrapper>
      </BodyWrapper>
    </Fragment>
  );
};

export default VendorDashboardLayout;
