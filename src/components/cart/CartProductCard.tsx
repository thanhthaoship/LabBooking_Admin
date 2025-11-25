"use client";

import { currency } from "@/lib";
import { defaultImageSrc } from "@/utils/constants";
import LazyImage from "@components/LazyImage";
import { FlexBox } from "@components/flex-box";
import { CartItem, useAppContext } from "@contexts/AppContext";
import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Checkbox, Typography } from "@mui/material";

interface IProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (item: CartItem, isSelected: boolean) => void;
}

const CartProductCard = ({ item, isSelected, onSelect }: IProps) => {
  const { id, name, qty, price, imgUrl } = item;
  const { dispatch } = useAppContext();

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        id: id,
        name: name,
        price: price,
        imgUrl: imgUrl,
        qty: amount,
        slug: id,
      },
    });
  };

  return (
    <Box
      sx={{
        borderBottom: "1px solid #f5f5f5",
        p: { xs: 1, md: 2 },
      }}
    >
      <FlexBox
        sx={{
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 0 },
          alignItems: { md: "center" },
        }}
      >
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(item, e.target.checked)}
          sx={{ mr: 2 }}
        />

        {/* Product Info */}
        <FlexBox sx={{ flex: 2 }} alignItems="center">
          <Box sx={{ width: 80, height: 80, mr: 2 }}>
            <LazyImage
              src={imgUrl || defaultImageSrc}
              width={80}
              height={80}
              alt={name}
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Typography>{name}</Typography>
        </FlexBox>

        {/* Unit Price */}
        <Typography sx={{ flex: 1, textAlign: "center" }}>
          {currency(price)}
        </Typography>

        {/* Quantity */}
        <FlexBox sx={{ flex: 1 }} justifyContent="center" alignItems="center">
          <Button
            color="primary"
            sx={{ p: "5px" }}
            variant="outlined"
            disabled={qty === 1}
            onClick={handleCartAmountChange(qty - 1)}
          >
            <Remove fontSize="small" />
          </Button>
          <Typography sx={{ mx: 2 }}>{qty}</Typography>
          <Button
            color="primary"
            sx={{ p: "5px" }}
            variant="outlined"
            onClick={handleCartAmountChange(qty + 1)}
          >
            <Add fontSize="small" />
          </Button>
        </FlexBox>

        {/* Total Price */}
        <Typography
          sx={{ flex: 1, textAlign: "center", color: "primary.main" }}
        >
          {currency(price * qty)}
        </Typography>

        {/* Actions */}
        <FlexBox sx={{ flex: 1 }} justifyContent="center">
          <Button color="error" onClick={handleCartAmountChange(0)}>
            Xóa
          </Button>
        </FlexBox>
      </FlexBox>
    </Box>
  );
};

export default CartProductCard;
