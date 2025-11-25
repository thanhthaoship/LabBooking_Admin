"use client";

import { H3, Paragraph } from "@/components/Typography";
import { Box, Card, useTheme } from "@mui/material";

const WelcomeBanner = () => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, background: theme.palette.primary.main }}>
      <Box maxWidth={400}>
        <H3 color="white" mb={1}>
          Xin chào, Admin!
        </H3>
        <Paragraph color="white">
          Đây là trang tổng quan quản trị của bạn. Bạn có thể xem các thống kê
          và quản lý hệ thống từ đây.
        </Paragraph>
      </Box>
    </Card>
  );
};

export default WelcomeBanner;
