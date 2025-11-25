import Scrollbar from "@/components/Scrollbar";
import { Box, useMediaQuery } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import LayoutDrawer from "../LayoutDrawer";
import {
  ListIconWrapper,
  ListLabel,
  NavItemButton,
  NavWrapper,
  SidebarWrapper,
  StyledText,
} from "./LayoutStyledComponents";
import { NavigationGroup, navigationGroups } from "./NavigationList";
interface DashboardSidebarProps {
  sidebarCompact: number;
  showMobileSideBar: number;
  setShowMobileSideBar: () => void;
}

// -----------------------------------------------------------------------------
const DashboardSidebar = (props: DashboardSidebarProps) => {
  const { sidebarCompact, showMobileSideBar, setShowMobileSideBar } = props;
  const router = useRouter();
  const pathname = usePathname();
  const downLg = useMediaQuery((theme) => theme.breakpoints.down("lg")); // side hover when side bar is compacted
  const compact = downLg ? 0 : sidebarCompact;

  const activeRoute = (pathSegment: string) =>
    pathname.includes(pathSegment) ? 1 : 0; // handle navigate to another route and close sidebar drawer in mobile device

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileSideBar();
  };

  const renderLevels = (data: NavigationGroup[]) => {
    return data.map((group, index) => {
      return (
        <Box key={group.key}>
          {group.label && (
            <ListLabel key={index} compact={compact}>
              {group.label}
            </ListLabel>
          )}

          {group.items.map((item, index) => {
            return (
              <Box
                key={`sidenav-${index}`}
                sx={{
                  "& :hover": {
                    backgroundColor: "#ffede1",
                  },
                }}
              >
                <NavItemButton
                  key={item.name}
                  className="navItem"
                  active={activeRoute(item.pathSegment)}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListIconWrapper>
                    <item.icon />
                  </ListIconWrapper>

                  <StyledText compact={compact}>{item.name}</StyledText>
                </NavItemButton>
              </Box>
            );
          })}
        </Box>
      );
    });
  };

  const content = <NavWrapper>{renderLevels(navigationGroups)}</NavWrapper>;

  if (downLg) {
    return (
      <Scrollbar>
        <LayoutDrawer
          open={showMobileSideBar ? true : false}
          onClose={setShowMobileSideBar}
        >
          {content}
        </LayoutDrawer>
      </Scrollbar>
    );
  }

  return <SidebarWrapper compact={compact ? 1 : 0}>{content}</SidebarWrapper>;
};

export default DashboardSidebar;
