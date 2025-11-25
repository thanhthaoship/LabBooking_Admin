"use client";

import { Grid } from "@mui/material";
import AnalyticsCard from "./AnalyticsCard";
import {
  ShoppingBag,
  Person,
  LocalShipping,
  AttachMoney,
} from "@mui/icons-material";
import { DashboardModel } from "@/config/models/dashboard";
import { currency } from "@/lib";

interface IProps {
  data: DashboardModel;
}

const Analytics = ({ data }: IProps) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Tổng đơn hàng"
          amount={data.totalOrder.toString()}
          Icon={ShoppingBag}
          color="info.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Khách hàng"
          amount={data.totalCustomer.toString()}
          Icon={Person}
          color="warning.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Đơn chờ xử lý"
          amount={data.totalProcessingOrder.toString()}
          Icon={LocalShipping}
          color="error.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <AnalyticsCard
          title="Doanh thu"
          amount={currency(data.totalRevenue)}
          Icon={AttachMoney}
          color="success.main"
        />
      </Grid>
    </Grid>
  );
};

export default Analytics;
