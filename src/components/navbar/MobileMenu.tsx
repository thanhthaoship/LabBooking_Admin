import { COMMON_ROUTES } from "@/config/routes";
import NavLink from "@components/nav-link/NavLink";
import Scrollbar from "@components/Scrollbar";
import navbarList, { INavbarItem } from "@data/navbarNavigations";
import { Clear, Menu } from "@mui/icons-material";
import { Box, Drawer, IconButton } from "@mui/material";
import Link from "next/link";
import { Fragment, useState } from "react";
import BazaarImage from "../BazaarImage";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { defaultLogoSrc } from "@/utils/constants";

const MobileMenu = () => {
  const { value } = useSettingsContext();

  const [openDrawer, setOpenDrawer] = useState(false);

  const renderLevels = (data: INavbarItem[]) => {
    return data.map((item, index) => (
      <Box key={index} py={1}>
        <NavLink href={item.url}>{item.title}</NavLink>
      </Box>
    ));
  };

  return (
    <Fragment>
      <IconButton
        onClick={() => setOpenDrawer(true)}
        sx={{
          flexShrink: 0,
          border: (theme) => `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Menu />
      </IconButton>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          zIndex: 15001,
        }}
      >
        <Box
          sx={{
            width: 280,
            height: "100%",
            position: "relative",
          }}
        >
          <Scrollbar
            autoHide={false}
            sx={{
              height: "100vh",
            }}
          >
            <Box
              maxWidth={500}
              margin="auto"
              position="relative"
              height="100%"
              px={5}
              py={8}
            >
              <IconButton
                onClick={() => setOpenDrawer(false)}
                sx={{
                  position: "absolute",
                  right: 30,
                  top: 15,
                }}
              >
                <Clear fontSize="small" />
              </IconButton>

              <Link href={COMMON_ROUTES.HOME}>
                <BazaarImage
                  height={100}
                  width={500}
                  src={value?.logoUrl || defaultLogoSrc}
                  alt="logo"
                />
              </Link>

              <Box mt={2}>{renderLevels(navbarList)}</Box>
            </Box>
          </Scrollbar>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default MobileMenu;
