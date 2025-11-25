"use client";
import CategoryMenu from "@/components/categories/CategoryMenu";
import { FlexBox } from "@/components/flex-box";
import MobileMenu from "@/components/navbar/MobileMenu";
import { COMMON_ROUTES } from "@/config/routes";
import { useAppContext } from "@/contexts/AppContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import Category from "@components/icons/Category";
import ShoppingBagOutlined from "@components/icons/ShoppingBagOutlined";
import MiniCart from "@components/mini-cart/MiniCart";
import GrocerySearchBox from "@components/search-box/GrocerySearchBox";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Badge, Box, Button, Drawer, styled } from "@mui/material";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { defaultLogoSrc, layoutConstant } from "@utils/constants";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import UserMenu from "./UserMenu";
import NextImage from "next/image";

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "height 250ms ease-in-out",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
})); // ==============================================================
export const SearchWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
})); //
export interface HeaderProps {
  isFixed?: boolean;
  className?: string;
}

// ==============================================================
const Header = ({ isFixed, className }: HeaderProps) => {
  const { value } = useSettingsContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { state } = useAppContext();
  const [sidenavOpen, setSidenavOpen] = useState(false);

  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  return (
    <HeaderWrapper className={clsx(className)}>
      <Container
        sx={{
          gap: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FlexBox mr={2} alignItems="center">
          <Box sx={{ maxWidth: 110, maxHeight: 70 }}>
            <Link href={COMMON_ROUTES.HOME}>
              <NextImage
                height={70}
                width={isMobile ? 90 : 110}
                src={value?.logoUrl || defaultLogoSrc}
                alt="logo"
                style={{
                  objectFit: "contain",
                  width: "100%",
                }}
              />
            </Link>
          </Box>

          {isFixed && !isMobile && (
            <CategoryMenu>
              <FlexBox color="grey.600" alignItems="center" ml={2}>
                <Button color="inherit">
                  <Category fontSize="small" color="inherit" />
                  <KeyboardArrowDown fontSize="small" color="inherit" />
                </Button>
              </FlexBox>
            </CategoryMenu>
          )}
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchWrapper>
            <GrocerySearchBox />
          </SearchWrapper>
        </FlexBox>

        <FlexBox alignItems="center">
          <UserMenu />
          <Badge badgeContent={state.cart.length} color="primary">
            <Box
              ml={2.5}
              p={1.25}
              bgcolor="grey.200"
              component={IconButton}
              onClick={toggleSidenav}
            >
              <ShoppingBagOutlined />
            </Box>
          </Badge>
        </FlexBox>

        <Drawer open={sidenavOpen} anchor="right" onClose={toggleSidenav}>
          <MiniCart />
        </Drawer>

        {isMobile && <MobileMenu />}
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
