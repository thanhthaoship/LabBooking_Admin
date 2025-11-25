import { ShippingAddressModel } from "@/config/models/shipping-address";
import { USER_ROUTES } from "@/config/routes";
import { Add, LocationOnOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { FlexBox } from "../flex-box";
import { H5 } from "../Typography";
interface IProps {
  selectedAddressId: string;
  setSelectedAddressId: (addressId: string) => void;
  addresses: ShippingAddressModel[];
}

const AddressSelection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
}: IProps) => {
  const router = useRouter();

  const handleAddressClick = () =>
    router.push(USER_ROUTES.SHIPPING_ADDRESS.CREATE);

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <FlexBox alignItems="center" mb={2}>
        <LocationOnOutlined sx={{ color: "primary.main", mr: 1 }} />
        <H5>Chọn địa chỉ giao hàng</H5>
      </FlexBox>

      {addresses.length > 0 ? (
        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid size={{ xs: 12, md: 6 }} key={address.shippingAddressId}>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid",
                  borderColor:
                    selectedAddressId === address.shippingAddressId
                      ? "primary.main"
                      : "grey.300",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => setSelectedAddressId(address.shippingAddressId)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={<Radio />}
                    checked={selectedAddressId === address.shippingAddressId}
                    value={address.shippingAddressId}
                    name="address-radio"
                    label={
                      <Box ml={2}>
                        <Typography fontWeight={600}>
                          {address.receiverName}
                        </Typography>
                        <Typography color="text.secondary" mb={1}>
                          {address.receiverPhoneNumber}
                        </Typography>
                        <Typography>{address.fullAddress}</Typography>
                      </Box>
                    }
                  />
                  {address.defaultAddress && (
                    <Typography color="primary" variant="caption">
                      (Mặc định)
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Bạn chưa có địa chỉ nào
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddressClick}
          >
            <Add sx={{ mr: 1 }} /> Thêm địa chỉ mới
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default AddressSelection;
