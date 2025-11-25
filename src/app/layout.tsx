import NProgressHandler from "@/components/NProgressHandler";
import RootStyleRegistry from "@/lib/emotion-registry";
import SnackbarProvider from "@components/SnackbarProvider";
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
            <SnackbarProvider>{children}</SnackbarProvider>
          </MuiTheme>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
