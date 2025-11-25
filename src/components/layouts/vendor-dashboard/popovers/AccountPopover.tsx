import { H6 } from "@components/Typography"; // styled components
import { Avatar, Box, IconButton, Menu, MenuItem, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { useAuth } from "@contexts/AuthContext";

const Divider = styled(Box)(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleLogOut = async () => {
    setAnchorEl(null);
    await logout();
    router.push("/auth/login");
  };

  return (
    <Box>
      <IconButton
        sx={{
          padding: 0,
        }}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
      >
        <Avatar alt="Remy Sharp" src="/assets/images/avatars/001-man.svg" />
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: "8px",
            overflow: "visible",
            border: "1px solid",
            borderColor: "grey.200",
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "grey.200",
            },
            "&:before": {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: "block",
              position: "absolute",
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
            },
          },
        }}
      >
        <Box px={2} pt={1}>
          <H6>{user?.userName || user?.email || "Tài khoản"}</H6>
        </Box>

        <Divider />
        <MenuItem onClick={handleLogOut}>Đăng xuất</MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountPopover;
