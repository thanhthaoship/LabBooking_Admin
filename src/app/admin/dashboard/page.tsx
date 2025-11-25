"use client";

import Analytics from "@/components/dashboard/Analytics";
import RecentPurchase from "@/components/dashboard/RecentPurchase";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import { API_ENDPOINTS } from "@/config/api.endpoint";
import { DashboardModel } from "@/config/models/dashboard";
import { IResponseWithData } from "@/config/types";
import { swrFetcher } from "@/utils/swr-fetcher";
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import useSWR from "swr";

const AdminDashboard = () => {
  const { data } = useSWR<IResponseWithData<DashboardModel>>(
    API_ENDPOINTS.DASHBOARD.INDEX,
    swrFetcher
  );

  const defaultData: DashboardModel = {
    totalCustomer: 0,
    totalOrder: 0,
    totalProcessingOrder: 0,
    totalRevenue: 0,
    recentOrders: [],
  };

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        {/* WELCOME BANNER */}
        <Grid size={{ xs: 12 }}>
          <WelcomeBanner />
        </Grid>

        {/* ANALYTICS CARDS */}
        <Grid size={{ xs: 12 }}>
          <Analytics data={data?.content || defaultData} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack spacing={3}>
            {/* RECENT PURCHASE */}
            <RecentPurchase orders={data?.content?.recentOrders || []} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
