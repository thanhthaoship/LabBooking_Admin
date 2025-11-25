"use client";
import { Card, CardProps, styled } from "@mui/material"; // ===============================================
import { ReactNode } from "react";

// ===============================================

export interface IBazaarCard extends CardProps {
  hoverEffect?: boolean;
  children: ReactNode;
}
const BazaarCard = styled(
  ({ hoverEffect = false, children, ...rest }: IBazaarCard) => (
    <Card {...rest}>{children}</Card>
  )
)(({ theme, hoverEffect }) => ({
  overflow: "unset",
  borderRadius: "8px",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    ...(hoverEffect && {
      boxShadow: theme.shadows[3],
    }),
  },
}));

export default BazaarCard;
