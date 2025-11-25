"use client";

import { Container } from "@mui/material";
import Navigations from "./Navigations";
import UserLayout from "@/components/layouts/UserLayout";
import Grid from "@mui/material/Grid2";

/**
 *  Used in:
 *  1. wish-list page
 *  2. address and address-details page
 *  3. orders and order-details page
 *  4. payment-methods and payment-method-details page
 *  5. profile and edit profile page
 *  6. support-tickets page
 */
// ======================================================

// ======================================================
const CustomerDashboardLayout = ({ children }) => (
  <UserLayout>
    <Container
      sx={{
        my: "2rem",
      }}
    >
      <Grid container spacing={3}>
        <Grid
          size={{ xs: 12, md: 12, lg: 3 }}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
          }}
        >
          <Navigations />
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>{children}</Grid>
      </Grid>
    </Container>
  </UserLayout>
);

export default CustomerDashboardLayout;
