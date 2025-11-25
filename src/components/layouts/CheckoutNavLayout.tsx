import { Container } from "@mui/material";
import UserLayout from "./UserLayout";

// ======================================================
const CheckoutNavLayout = ({ children }) => {
  return (
    <UserLayout>
      <Container
        sx={{
          my: 4,
        }}
      >
        {children}
      </Container>
    </UserLayout>
  );
};

export default CheckoutNavLayout;
