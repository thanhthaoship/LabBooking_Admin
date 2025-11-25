"use client";

import { Box, BoxProps } from "@mui/material";
import { compose, display, spacing, styled } from "@mui/system";
import Image, { ImageProps } from "next/image";

interface BazaarImageProps extends ImageProps {
  wrapperProps?: BoxProps;
}

const StyledImage = styled(Image)(() => ({
  display: "block",
  objectFit: "contain",
  maxWidth: "100%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },

  ...compose(spacing, display),
}));

const BazaarImage = ({ wrapperProps, ...imageProps }: BazaarImageProps) => {
  return (
    <Box overflow="hidden" {...wrapperProps}>
      <StyledImage {...imageProps} />
    </Box>
  );
};

export default BazaarImage;
