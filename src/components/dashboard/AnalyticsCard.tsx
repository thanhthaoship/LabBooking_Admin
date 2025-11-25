"use client";

import { Box, Card, SvgIconProps } from "@mui/material";
import { H3, H6 } from "@/components/Typography";

interface AnalyticsCardProps {
  title: string;
  amount: string;
  Icon: React.ComponentType<SvgIconProps>;
  color: string;
}

const AnalyticsCard = ({ title, amount, Icon, color }: AnalyticsCardProps) => {
  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <H6 color="text.secondary">{title}</H6>
          <H3>{amount}</H3>
        </Box>
        <Box sx={{ color, borderRadius: "50%", backgroundColor: `${color}15`, p: 1 }}>
          <Icon />
        </Box>
      </Box>
    </Card>
  );
};

export default AnalyticsCard;