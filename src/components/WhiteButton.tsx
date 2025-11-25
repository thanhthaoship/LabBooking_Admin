"use client";
import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";

interface WhiteButtonProps extends ButtonProps, PropsWithChildren {}

const WhiteButton = ({ children, ...props }: WhiteButtonProps) => {
  return (
    <Button
      color="primary"
      variant="contained"
      sx={{
        color: "dark.main",
        backgroundColor: "white",
        ":hover": {
          backgroundColor: "dark.main",
          color: "#fff",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default WhiteButton;
