import { Box } from "@mui/material";
import { FlexBox } from "../flex-box";
import LazyImage from "../LazyImage";

const EmptyCart = () => {
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="calc(100vh - 74px)"
    >
      <LazyImage
        width={90}
        height={100}
        alt="banner"
        src="/assets/images/logos/shopping-bag.svg"
      />
      <Box
        component="p"
        mt={2}
        color="grey.600"
        textAlign="center"
        maxWidth="200px"
      >
        Giỏ hàng của bạn đang trống. Tiếp tục mua sắm
      </Box>
    </FlexBox>
  );
};

export default EmptyCart;
