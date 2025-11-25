"use client";

import { H5 } from "@/components/Typography";
import { OrderModel, orderOptions } from "@/config/models/order";
import { ADMIN_ROUTES } from "@/config/routes";
import { currency } from "@/lib";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import NotFound from "../NotFound";
import { StatusWrapper } from "../StyledComponents";
import { FlexBetween } from "../flex-box";
import { RemoveRedEye } from "@mui/icons-material";

interface IProps {
  orders: OrderModel[];
}

const RecentPurchase = ({ orders }: IProps) => {
  const router = useRouter();

  return (
    <Card>
      <CardContent>
        <FlexBetween mb={2}>
          <H5 mb={0}>Đơn hàng gần đây</H5>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => router.push(ADMIN_ROUTES.ORDER.INDEX)}
          >
            Xem tất cả
          </Button>
        </FlexBetween>

        {orders.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "grey.200" }}>
                <TableRow>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const statusLabel = orderOptions.find(
                    (item) => item.value === order.status
                  )?.label;

                  return (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.userInfo?.fullname}</TableCell>
                      <TableCell>{order.userInfo?.phoneNumber}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{currency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <StatusWrapper status={order.status}>
                          {statusLabel}
                        </StatusWrapper>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            router.push(
                              `${ADMIN_ROUTES.ORDER.DETAILS(order.orderId)}`
                            )
                          }
                        >
                          <RemoveRedEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <NotFound />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPurchase;
