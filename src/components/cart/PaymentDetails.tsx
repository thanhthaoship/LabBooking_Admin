import { DiscountModel } from "@/config/models/discount";
import { CartItem } from "@/contexts/AppContext";
import { currency } from "@/lib";
import { InfoOutlined } from "@mui/icons-material";
import { Button, Card, Divider, Stack } from "@mui/material";
import { FlexBox } from "../flex-box";
import Order from "../icons/duotone/Order";
import { H5, Span } from "../Typography";

interface IProps {
  isSubmitting: boolean;
  selectedProducts: CartItem[];
  pointsDiscount?: number;
  discount?: DiscountModel;
}

interface ProductWithDiscount {
  product: CartItem;
  isApplicable: boolean;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

const PaymentDetails = ({
  isSubmitting,
  selectedProducts,
  pointsDiscount = 0,
  discount,
}: IProps) => {
  const calculateProductDiscounts = (
    products: CartItem[],
    discount?: DiscountModel
  ): ProductWithDiscount[] => {
    return products.map((product) => {
      // Check if this product is eligible for discount
      const isApplicable =
        discount?.productIds?.some((id: string) => id === product.id) ?? false;

      // Calculate prices
      const originalPrice = product.price * product.qty;
      const discountAmount = isApplicable
        ? originalPrice * ((discount?.discountValue || 0) / 100)
        : 0;
      const finalPrice = originalPrice - discountAmount;

      return {
        product,
        isApplicable,
        originalPrice,
        discountAmount,
        finalPrice,
      };
    });
  };

  const calulateTotal = (products: ProductWithDiscount[]) => {
    const subtotalAmount = products.reduce(
      (sum, product) => sum + product.finalPrice,
      0
    );

    const originalTotalAmount = products.reduce(
      (sum, product) => sum + product.originalPrice,
      0
    );

    const isUseDiscount =
      pointsDiscount > 0 || products.find((x) => x.isApplicable) !== undefined;

    const finalTotalAmount = Math.max(0, subtotalAmount - pointsDiscount);
    return {
      subtotalAmount,
      originalTotalAmount,
      finalTotalAmount,
      isUseDiscount,
    };
  };

  const productsWithDiscount = calculateProductDiscounts(
    selectedProducts,
    discount
  );

  const {
    subtotalAmount,
    originalTotalAmount,
    finalTotalAmount,
    isUseDiscount,
  } = calulateTotal(productsWithDiscount);

  const disabled = selectedProducts.length === 0 || isSubmitting;

  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        position: { xs: "static", md: "sticky" },
        bottom: 0,
      }}
    >
      <Stack
        spacing={2}
        direction="column"
        sx={{
          borderColor: "grey.300",
          minWidth: { xs: "100%", md: 400 },
        }}
      >
        <FlexBox alignItems="center">
          <InfoOutlined sx={{ color: "primary.main", mr: 1 }} />
          <H5>Thông tin thanh toán</H5>
        </FlexBox>

        {/* Product List */}
        {productsWithDiscount.length > 0 && (
          <Stack spacing={1}>
            {productsWithDiscount.map((item) => {
              return (
                <FlexBox
                  key={item.product.id}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Span>
                    {item.product.name} x {item.product.qty}
                  </Span>

                  <FlexBox gap={2}>
                    {item.isApplicable && (
                      <Span
                        sx={{ textDecoration: "line-through", color: "red" }}
                        fontWeight={500}
                      >
                        {currency(item.originalPrice)}
                      </Span>
                    )}

                    <Span fontWeight={500}>{currency(item.finalPrice)}</Span>
                  </FlexBox>
                </FlexBox>
              );
            })}
            <Divider sx={{ my: 1 }} />
          </Stack>
        )}

        {/* Subtotal */}
        <FlexBox alignItems="center" justifyContent="space-between">
          <Span>Tạm tính:</Span>
          <Span fontWeight={500}>{currency(subtotalAmount)}</Span>
        </FlexBox>

        {/* Points Discount */}
        {pointsDiscount > 0 && (
          <FlexBox alignItems="center" justifyContent="space-between">
            <Span>Giảm giá từ điểm:</Span>
            <Span fontWeight={500} color="red">
              - {currency(pointsDiscount)}
            </Span>
          </FlexBox>
        )}

        {/* Total Amount */}
        <FlexBox alignItems="center" justifyContent="space-between" mb={1}>
          <H5>Tổng thanh toán:</H5>

          <FlexBox gap={2}>
            {isUseDiscount && (
              <H5 sx={{ textDecoration: "line-through", color: "red" }}>
                {currency(originalTotalAmount)}
              </H5>
            )}

            <H5>{currency(finalTotalAmount)}</H5>
          </FlexBox>
        </FlexBox>

        <Button
          type="submit"
          disabled={disabled}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          <Order sx={{ mr: 1 }} />
          Đặt hàng
        </Button>
      </Stack>
    </Card>
  );
};
export default PaymentDetails;
