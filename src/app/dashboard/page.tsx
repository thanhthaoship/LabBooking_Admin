"use client";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

const AdminDashboard = () => {
  return (
    <Box py={4}>
      <Grid container spacing={3}>
        {/* WELCOME BANNER */}
        <Grid size={{ xs: 12 }}>
          <WelcomeBanner />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
