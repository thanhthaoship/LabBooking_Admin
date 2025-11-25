"use client";

import { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export interface CarouselProps {
  children: ReactNode | ReactNode[];
  spacing?: string;
  infinite?: boolean;
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrow?: boolean;
  visibleSlides?: number;
  sx?: SxProps<Theme>;
}
