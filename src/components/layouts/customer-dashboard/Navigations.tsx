"use client";

import { USER_ROUTES } from "@/config/routes";
import { PROTECTED_ROUTES } from "@/config/routes/routes.protected";
import { FlexBox } from "@components/flex-box";
import NavLink from "@components/nav-link/NavLink";
import {
  CardTravel,
  History,
  KeyOutlined,
  LocationOn,
  Person,
  SafetyCheck,
} from "@mui/icons-material";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { Card, styled, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Fragment, ReactNode } from "react";

interface NavItem {
  href: string;
  title: string;
  icon: React.ElementType;
  count?: number;
}

interface NavGroup {
  title: string;
  list: NavItem[];
}

interface StyledNavLinkProps {
  children: ReactNode;
  isCurrentPath: boolean;
  href: string;
}

const MainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: "1.5rem",
  [theme.breakpoints.down("md")]: {
    boxShadow: "none",
    overflowY: "auto",
    height: "calc(100vh - 64px)",
  },
}));

const StyledNavLink = styled(
  ({ children, isCurrentPath, ...rest }: StyledNavLinkProps) => (
    <NavLink {...rest}>{children}</NavLink>
  )
)(({ theme, isCurrentPath }) => ({
  display: "flex",
  alignItems: "center",
  borderLeft: "4px solid",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  marginBottom: "1.25rem",
  justifyContent: "space-between",
  borderColor: isCurrentPath ? theme.palette.primary.main : "transparent",
  "& .nav-icon": {
    color: isCurrentPath ? theme.palette.primary.main : theme.palette.grey[600],
  },
  "&:hover": {
    borderColor: theme.palette.primary.main,
    "& .nav-icon": {
      color: theme.palette.primary.main,
    },
  },
}));

const Navigations = () => {
  const pathname = usePathname();
  return (
    <MainContainer>
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="grey.600" fontSize="12px">
            {item.title}
          </Typography>

          {item.list.map((item) => (
            <StyledNavLink
              href={item.href}
              key={item.title}
              isCurrentPath={pathname.includes(item.href)}
            >
              <FlexBox alignItems="center" gap={1}>
                <item.icon
                  color="inherit"
                  fontSize="small"
                  className="nav-icon"
                />
                <span>{item.title}</span>
              </FlexBox>
            </StyledNavLink>
          ))}
        </Fragment>
      ))}
    </MainContainer>
  );
};

const linkList: NavGroup[] = [
  {
    title: "Trang chủ",
    list: [
      {
        href: PROTECTED_ROUTES.CART.INDEX,
        title: "Giỏ hàng",
        icon: CardTravel,
      },
      {
        href: USER_ROUTES.ORDERS.INDEX,
        title: "Lịch sử đơn hàng",
        icon: History,
      },
      {
        href: PROTECTED_ROUTES.WARRANTY.INDEX,
        title: "Bảo hành sản phẩm",
        icon: SafetyCheck,
      },
    ],
  },
  {
    title: "Cài đặt tài khoản",
    list: [
      {
        href: USER_ROUTES.PROFILE.INDEX,
        title: "Thông tin tài khoản",
        icon: Person,
      },
      {
        href: USER_ROUTES.SHIPPING_ADDRESS.INDEX,
        title: "Cài đặt địa chỉ",
        icon: LocationOn,
      },
      {
        href: USER_ROUTES.CHANGE_PASSWORD,
        title: "Đổi mật khẩu",
        icon: KeyOutlined,
      },
    ],
  },
];
export default Navigations;
