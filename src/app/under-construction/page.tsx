"use client";

import BazaarImage from "@/components/BazaarImage";
import { FlexBox } from "@/components/flex-box";
import { H2 } from "@/components/Typography";
import { COMMON_ROUTES } from "@/config/routes";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function UnderConstructionPage() {
  const router = useRouter();

  const goBack = () => router.back();
  const goToHome = () => router.push(COMMON_ROUTES.HOME);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: 2,
        bgcolor: "background.paper",
      }}
    >
      <BazaarImage
        src="/assets/images/errors/0.png"
        width={320}
        height={320}
        style={{
          display: "block",
          maxWidth: 320,
          width: "100%",
          marginBottom: "20px",
        }}
        alt="Under Construction"
      />

      <H2 mb={3}>
        Trang đang trong quá trình phát triển vui lòng quay lại sau.
      </H2>
      <FlexBox flexWrap="wrap" gap={2}>
        <Button variant="outlined" color="primary" onClick={goBack}>
          Trở lại
        </Button>

        <Button variant="contained" color="primary" onClick={goToHome}>
          Trở về trang chủ
        </Button>
      </FlexBox>
    </Box>
  );
}
