import { checkValidDiscount } from "@/actions/order.action";
import { DiscountModel } from "@/config/models/discount";
import { CartItem } from "@/contexts/AppContext";
import { LocalOfferOutlined, SendOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  InputBase,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FlexBox } from "../flex-box";
import { H5, H6 } from "../Typography";

interface IProps {
  onApplyDiscount: (discount?: DiscountModel) => void;
  onChangeDiscount: (discountCode: string) => void;
  selectedProducts: CartItem[];
  discount?: string;
}

const EnterDiscount = ({
  onApplyDiscount,
  selectedProducts,
  discount,
  onChangeDiscount,
}: IProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [discountStatus, setDiscountStatus] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!discount) setDiscountStatus(null);
  }, [discount]);

  const handleCheckDiscount = async () => {
    if (!discount?.trim()) return;

    setIsChecking(true);
    setDiscountStatus(null);

    const productIds = selectedProducts.map((product) => product.id);
    const response = await checkValidDiscount({
      discountCode: discount,
      productIds,
    });
    const isValid = response.success;

    setDiscountStatus({
      valid: isValid,
      message: isValid
        ? "Mã giảm giá đã được áp dụng - giảm " +
          response.content?.discountValue +
          "%"
        : "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
    });

    if (isValid && onApplyDiscount && response.content) {
      onApplyDiscount({
        discountId: response.content.discountId,
        discountValue: response.content.discountValue,
        code: response.content.code,
        productIds: response.content.productIds,
      });
    } else {
      onApplyDiscount(undefined);
    }

    setIsChecking(false);
  };

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <FlexBox alignItems="center" mb={2}>
        <LocalOfferOutlined sx={{ color: "primary.main", mr: 1 }} />
        <H5>Mã giảm giá</H5>
      </FlexBox>

      <FlexBox gap={1} alignItems="center">
        <Box
          sx={{
            flex: 1,
            height: 44,
            display: "flex",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: "grey.300",
            overflow: "hidden",
          }}
        >
          <InputBase
            placeholder="Nhập mã giảm giá"
            value={discount}
            onChange={(e) => onChangeDiscount(e.target.value)}
            sx={{
              height: "100%",
              flex: 1,
              padding: "0 1rem",
              "::placeholder": { color: "grey.500" },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCheckDiscount();
              }
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckDiscount}
          disabled={isChecking || !discount?.trim()}
          sx={{ height: 44, minWidth: 120 }}
        >
          {isChecking ? (
            <FlexBox gap={1} alignItems={"center"}>
              <CircularProgress sx={{ p: 1 }} /> <H6>Đang kiểm tra...</H6>
            </FlexBox>
          ) : (
            <FlexBox gap={1}>
              <SendOutlined /> <H6>Áp dụng</H6>
            </FlexBox>
          )}
        </Button>
      </FlexBox>

      {discountStatus && (
        <Typography
          variant="body2"
          color={discountStatus.valid ? "success.main" : "error.main"}
          mt={1}
        >
          {discountStatus.message}
        </Typography>
      )}
    </Card>
  );
};

export default EnterDiscount;
