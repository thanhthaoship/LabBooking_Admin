"use client";

import BazaarImage from "@/components/BazaarImage";
import { FlexBox } from "@/components/flex-box";
import { H2 } from "@/components/Typography";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const goBack = () => router.back();
  const goToHome = () => router.push("/");

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
      }}
    >
      <BazaarImage
        alt="404"
        src="/assets/images/errors/500.png"
        width={320}
        height={320}
        style={{
          display: "block",
          maxWidth: 320,
          width: "100%",
        }}
      />
      <H2 color={"red"}>Bạn không có quyền truy cập vào trang này.</H2>
      <FlexBox flexWrap="wrap" mt={2}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={goBack}
        >
          Trở lại
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={goToHome}
        >
          Trở về trang chủ
        </Button>
      </FlexBox>
    </Box>
  );
}
