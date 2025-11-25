import { Card, Checkbox } from "@mui/material";
import { FlexBox } from "../flex-box";
import { H5 } from "../Typography";

interface IProps {
  selectAll: boolean;
  setSelectAll: (selectAll: boolean) => void;
}

const CartHeader = ({ selectAll, setSelectAll }: IProps) => {
  return (
    <Card sx={{ p: 2 }}>
      <FlexBox alignItems="center">
        <Checkbox
          checked={selectAll}
          onChange={(e) => setSelectAll(e.target.checked)}
        />
        <H5 sx={{ flex: 2 }}>Tất cả sản phẩm</H5>
        <H5
          sx={{
            flex: 1,
            textAlign: "center",
            display: { xs: "none", md: "block" },
          }}
        >
          Đơn Giá
        </H5>
        <H5
          sx={{
            flex: 1,
            textAlign: "center",
            display: { xs: "none", md: "block" },
          }}
        >
          Số Lượng
        </H5>
        <H5
          sx={{
            flex: 1,
            textAlign: "center",
            display: { xs: "none", md: "block" },
          }}
        >
          Số Tiền
        </H5>
        <H5
          sx={{
            flex: 1,
            textAlign: "center",
            display: { xs: "none", md: "block" },
          }}
        >
          Thao Tác
        </H5>
      </FlexBox>
    </Card>
  );
};

export default CartHeader;
