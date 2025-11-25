import { SettingsProvider } from "@/contexts/SettingsContext";
import RootStyleRegistry from "@/lib/emotion-registry";
import SnackbarProvider from "@components/SnackbarProvider";
import { AppProvider } from "@contexts/AppContext";
import MuiTheme from "@theme/MuiTheme";
import { Open_Sans } from "next/font/google";
import NProgressHandler from "@/components/NProgressHandler";

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
          <AppProvider>
            <MuiTheme>
              <SettingsProvider>
                <NProgressHandler />
                <SnackbarProvider>{children}</SnackbarProvider>
              </SettingsProvider>
            </MuiTheme>
          </AppProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
