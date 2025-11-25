import VendorDashboardLayout from "@/components/layouts/vendor-dashboard";
import NProgressHandler from "@/components/NProgressHandler";
import RootStyleRegistry from "@/lib/emotion-registry";
import SnackbarProvider from "@components/SnackbarProvider";
import { Box } from "@mui/material";
import MuiTheme from "@theme/MuiTheme";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["vietnamese"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={openSans.className}>
      <body>
        <RootStyleRegistry>
          <MuiTheme>
            <NProgressHandler />
            <SnackbarProvider>
              <Box
                sx={{
                  "& .MuiTextField-root": {
                    borderRadius: 1,
                  },
                }}
              >
                <VendorDashboardLayout>{children}</VendorDashboardLayout>
              </Box>
            </SnackbarProvider>
          </MuiTheme>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
