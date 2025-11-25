"use client";
import BazaarCard from "@components/BazaarCard";
import { Box, Skeleton, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBazaarCard = styled(BazaarCard)(({ theme }) => ({
  gap: "1rem",
  height: "100%",
  display: "flex",
  padding: "1.5rem",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
  },
}));

interface BazzardCardSkeletonProps {
  itemCount?: number;
}

const BazzardCardSkeleton = ({ itemCount = 4 }: BazzardCardSkeletonProps) => {
  return (
    <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
      {Array(itemCount)
        .fill(0)
        .map((_, index) => (
          <StyledBazaarCard key={index} sx={{ width: "100%" }}>
            <Skeleton
              variant="rectangular"
              width={64}
              height={64}
              sx={{ borderRadius: "50%", mb: 3 }}
            />
            <Box>
              <Skeleton width={100} height={24} />
              <Skeleton width={60} height={16} />
            </Box>
          </StyledBazaarCard>
        ))}
    </Stack>
  );
};

export default BazzardCardSkeleton;
