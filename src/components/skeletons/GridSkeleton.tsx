"use client";
import { Box, Skeleton, Stack } from "@mui/material";

interface GridSkeletonProps {
  count?: number;
  width?: number | string;
  height?: number | string;
  spacing?: number;
  columns?: string;
  showTitle?: boolean;
  titleHeight?: number;
  titleWidth?: string | number;
}

export default function GridSkeleton({
  count = 12,
  width = 150,
  height = 150,
  spacing = 2,
  columns = "repeat(auto-fill, minmax(150px, 1fr))",
  showTitle = false,
  titleHeight = 20,
  titleWidth = "70%",
}: GridSkeletonProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: spacing,
        mt: 2,
      }}
    >
      {Array.from(new Array(count)).map((_, index) => (
        <Stack key={index} spacing={1}>
          <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            sx={{ borderRadius: 1 }}
          />
          {showTitle && (
            <Skeleton variant="text" width={titleWidth} height={titleHeight} />
          )}
        </Stack>
      ))}
    </Box>
  );
}
