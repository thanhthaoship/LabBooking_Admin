"use client";
import { Box, BoxProps } from "@mui/material";

const FlexBox = ({ children, ...props }: BoxProps) => (
  <Box display="flex" {...props}>
    {children}
  </Box>
);

export default FlexBox;
