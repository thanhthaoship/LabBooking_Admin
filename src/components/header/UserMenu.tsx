"use client";
import { API_ENDPOINTS } from "@/config/routes/endpoints";
import { COMMON_ROUTES, USER_ROUTES } from "@/config/routes";
import { PROTECTED_ROUTES } from "@/config/routes/routes.protected";
import { IResponse } from "@/config/types";
import { swrNextFetcher } from "@/utils/swr-fetcher";
import {
  AccountCircle,
  AccountCircleOutlined,
  History,
  HistoryOutlined,
  LogoutOutlined,
  PersonOutline,
  SafetyCheck,
} from "@mui/icons-material";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const UserMenu = () => {
  const { data } = useSWR<IResponse>(API_ENDPOINTS.AUTH.INDEX, swrNextFetcher);
  const isLoggedIn = data?.success || false;

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push(COMMON_ROUTES.AUTH.LOGIN);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    router.push(COMMON_ROUTES.AUTH.LOG_OUT);
  };

  return (
    <>
      <Box
        component={IconButton}
        p={1.25}
        bgcolor="grey.200"
        onClick={handleProfileClick}
      >
        {isLoggedIn ? (
          <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
            <PersonOutline />
          </Avatar>
        ) : (
          <PersonOutline />
        )}
      </Box>

      <Menu
        sx={{ top: 20, zIndex: 99 }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            router.push(USER_ROUTES.PROFILE.INDEX);
          }}
        >
          <AccountCircle sx={{ mr: 1 }} />
          Thông tin cá nhân
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            router.push(USER_ROUTES.ORDERS.INDEX);
          }}
        >
          <History sx={{ mr: 1 }} />
          Lịch sử đơn hàng
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            router.push(PROTECTED_ROUTES.WARRANTY.INDEX);
          }}
        >
          <SafetyCheck sx={{ mr: 1 }} />
          Bảo hành sản phẩm
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutOutlined sx={{ mr: 1 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
