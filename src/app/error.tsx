"use client";

import Link from "next/link";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import SEO from "@components/SEO";
import BazaarImage from "@components/BazaarImage";
import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { H2 } from "@/components/Typography";

export default function ErrorPage() {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <FlexRowCenter px={2} minHeight="100vh" flexDirection="column">
      <SEO title="Không tìm thấy trang" description={"Không tìm thấy trang"} />
      <BazaarImage
        alt="Không tìm thấy trang"
        src="/assets/images/errors/500.png"
        width={320}
        height={320}
        style={{
          display: "block",
          maxWidth: 320,
          width: "100%",
        }}
      />
      <H2 color={"red"}>
        Đã xảy ra lỗi vui lòng liên hệ quản trị viên để hỗ trợ.
      </H2>

      <FlexBox flexWrap="wrap" mt={2}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={handleGoBack}
        >
          Trở lại
        </Button>

        <Link href="/" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{
              m: 1,
            }}
          >
            Trở về trang chủ
          </Button>
        </Link>
      </FlexBox>
    </FlexRowCenter>
  );
}
