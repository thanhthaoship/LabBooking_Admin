"use client";

import { FlexRowCenter } from "@/components/flex-box";
import { Card, CardProps, styled } from "@mui/material";
import { PropsWithChildren } from "react";

const Wrapper = styled(({ children, ...rest }: CardProps) => (
  <Card {...rest}>{children}</Card>
))(({ theme }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },

  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));

export default function AuthenLayout({ children }: PropsWithChildren) {
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <Wrapper elevation={3}>{children}</Wrapper>
    </FlexRowCenter>
  );
}
