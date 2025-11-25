"use client";

import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { H2 } from "@/components/Typography";
import BazaarImage from "@components/BazaarImage";
import SEO from "@components/SEO";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error404 = () => {
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
      <H2 color={"red"}>Trang bạn tìm kiếm không tồn tại.</H2>

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
};

export default Error404;
