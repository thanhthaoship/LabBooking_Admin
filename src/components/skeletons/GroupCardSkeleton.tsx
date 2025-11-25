import { Box, Card, Skeleton, styled, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";

const StyledCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
});

const Skeletons = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md")); // side hover when side bar is compacted

  return (
    <Box>
      {isMobile || isMobile === undefined ? (
        <StyledCard sx={{ padding: "5px" }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height={60}
            sx={{ borderRadius: 1 }}
          />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton animation="wave" height={24} width="70%" />
            <Skeleton
              animation="wave"
              height={20}
              width="40%"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </StyledCard>
      ) : (
        <StyledCard>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height={200}
            sx={{ borderRadius: 1 }}
          />
          <Box sx={{ pt: 2 }}>
            <Skeleton animation="wave" height={24} width="70%" />
            <Skeleton animation="wave" height={20} width="40%" sx={{ mt: 1 }} />
            <Skeleton animation="wave" height={32} width="30%" sx={{ mt: 1 }} />
          </Box>
        </StyledCard>
      )}
    </Box>
  );
};

const GroupCardSkeleton = () => (
  <Grid container spacing={1}>
    {[1, 2, 3, 4].map((item) => (
      <Grid key={item} size={{ xs: 3 }}>
        <Skeletons />
      </Grid>
    ))}
  </Grid>
);

export default GroupCardSkeleton;
