"use client";
import { Box, BoxProps } from "@mui/material";

interface IProps extends BoxProps {}

const FlexRowCenter = ({ children, ...props }: IProps) => (
  <Box display="flex" justifyContent="center" alignItems="center" {...props}>
    {children}
  </Box>
);

export default FlexRowCenter;
