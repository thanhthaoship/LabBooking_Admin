import { COMMON_ROUTES } from "@/config/routes";
import {
  ArrowRight,
  ArrowRightAltOutlined,
  RemoveRedEye,
} from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { useRouter } from "next/navigation";
import { Span } from "../Typography";

interface IProps extends ButtonProps {
  label?: string;
  categoryId?: string;
}

export default function ViewAllProductsButton({
  label = "Xem tất cả sản phẩm",
  color = "primary",
  variant = "outlined",
  categoryId,
}: IProps) {
  const router = useRouter();
  const handleClick = () => {
    const url = categoryId
      ? `${COMMON_ROUTES.PRODUCTS.INDEX}?categoryId=${categoryId}`
      : COMMON_ROUTES.PRODUCTS.INDEX;

    router.push(url);
  };
  return (
    <Button onClick={handleClick} color={color} variant={variant}>
      <RemoveRedEye sx={{ mr: 1 }} />
      {label}
    </Button>
  );
}
