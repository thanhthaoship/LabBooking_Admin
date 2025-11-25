"use client";

import { FlexRowCenter } from "@/components/flex-box";
import LazyImage from "@/components/LazyImage";
import { COMMON_ROUTES } from "@/config/routes";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { VerificationProvider } from "@/contexts/VerificationContext";
import { getThumbnailUrl } from "@/utils/gg-drive";
import { Card, CardProps, styled } from "@mui/material";
import Link from "next/link";
import { PropsWithChildren } from "react";

const Wrapper = styled(({ children, ...rest }: CardProps) => (
  <Card {...rest}>{children}</Card>
))(({ theme }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },

  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));

export default function AuthenLayout({ children }: PropsWithChildren) {
  const { value } = useSettingsContext();
  const logoSrc = getThumbnailUrl(value?.logoUrl);

  return (
    <VerificationProvider>
      <FlexRowCenter flexDirection="column" minHeight="100vh">
        <Wrapper elevation={3}>
          {value?.logoUrl && (
            <Link href={COMMON_ROUTES.HOME}>
              <FlexRowCenter>
                <LazyImage width={150} height={100} alt="logo" src={logoSrc} />
              </FlexRowCenter>
            </Link>
          )}

          {children}
        </Wrapper>
      </FlexRowCenter>
    </VerificationProvider>
  );
}
