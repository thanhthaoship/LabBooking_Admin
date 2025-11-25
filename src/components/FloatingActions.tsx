"use client";

import { USER_ROUTES } from "@/config/routes";
import { Message, Phone } from "@mui/icons-material";
import { Box, IconButton, Stack, styled, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import CartCheck from "./icons/CartCheck";
import { PROTECTED_ROUTES } from "@/config/routes/routes.protected";

const MainContainer = styled(Box)(({ theme }) => ({
  bottom: 40,
  left: 40,
  zIndex: 1501,
  position: "fixed",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  zIndex: 99,
  padding: 12,
  color: "#fff",
  borderRadius: "50%",
  boxShadow: theme.shadows[12],
  backgroundColor: theme.palette.primary.main,
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

type FloatingActionType = "cart" | "zalo" | "phone";

const FloatingActions = () => {
  const router = useRouter();

  const handleClick = (type: FloatingActionType) => {
    switch (type) {
      case "cart":
        router.push(PROTECTED_ROUTES.CART.INDEX);
        break;
      case "zalo":
        window.open("https://zalo.me/2059859487874331656", "_blank");
        break;
      case "phone":
        window.location.href = "tel:0977661882";
        break;
      default:
        break;
    }
  };

  return (
    <MainContainer>
      <Stack direction={"column"} gap={3}>
        <Tooltip title="Giỏ hàng" placement="left">
          <StyledIconButton onClick={() => handleClick("cart")}>
            <CartCheck />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Liên hệ zalo" placement="left">
          <StyledIconButton onClick={() => handleClick("zalo")}>
            <Message />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Liên hệ sdt" placement="left">
          <StyledIconButton onClick={() => handleClick("phone")}>
            <Phone />
          </StyledIconButton>
        </Tooltip>
      </Stack>
    </MainContainer>
  );
};

export default FloatingActions;
