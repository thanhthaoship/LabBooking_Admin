"use client";
import NextImage, { ImageProps } from "next/image";
import { styled, bgcolor, compose, spacing, borderRadius } from "@mui/system";

export interface LazyImageProps extends ImageProps {
  borderRadius?: string;
}

const LazyImage = styled(({ borderRadius, ...rest }: LazyImageProps) => (
  <NextImage
    {...rest}
    style={{
      maxWidth: "100%",
      maxHeight: "300px",
      objectFit: "contain",
    }}
  />
))(compose(spacing, borderRadius, bgcolor));
export default LazyImage;
