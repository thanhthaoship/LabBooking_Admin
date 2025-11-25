"use client";

import { PaymentMethod } from "@/config/models/cart";
import { FlexBox } from "@components/flex-box";
import MoneyIcon from "@mui/icons-material/Money";
import PaymentIcon from "@mui/icons-material/Payment";
import { Box, Card, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { H5 } from "../Typography";
interface IProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

const PaymentMethodSelection = ({
  paymentMethod,
  setPaymentMethod = () => {},
}: IProps) => {
  return (
    <Card sx={{ p: 3, mb: 2 }}>
      {/* Payment Method */}
      <Box>
        <FlexBox alignItems="center" mb={2}>
          <PaymentIcon sx={{ color: "primary.main", mr: 1 }} />
          <H5>Phương thức thanh toán</H5>
        </FlexBox>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup defaultValue={"CashOnDelivery"}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    height: 100,
                    border: "1px solid",
                    borderColor:
                      paymentMethod === "CashOnDelivery"
                        ? "primary.main"
                        : "grey.300",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => setPaymentMethod("CashOnDelivery")}
                >
                  <FormControlLabel
                    value={"CashOnDelivery"}
                    control={<Radio />}
                    label={
                      <Box>
                        <FlexBox alignItems="center" gap={1}>
                          <MoneyIcon color="primary" />
                          <Typography fontWeight={600}>
                            Thanh toán khi nhận hàng
                          </Typography>
                        </FlexBox>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    p: 2,
                    height: 100,
                    border: "1px solid",
                    borderColor:
                      paymentMethod === "Transfer"
                        ? "primary.main"
                        : "grey.300",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => setPaymentMethod("Transfer")}
                >
                  <FormControlLabel
                    value={"Transfer"}
                    control={<Radio />}
                    label={
                      <Box>
                        <FlexBox alignItems="center" gap={1}>
                          <PaymentIcon color="primary" />
                          <Typography fontWeight={600}>
                            Chuyển khoản ngân hàng
                          </Typography>
                        </FlexBox>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          Thanh toán qua tài khoản ngân hàng
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
      </Box>
    </Card>
  );
};

export default PaymentMethodSelection;
