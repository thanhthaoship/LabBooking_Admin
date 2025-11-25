"use client";
import { FlexBox } from "@/components/flex-box";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { getThumbnailUrl } from "@/utils/gg-drive";
import { H5, Paragraph, Span } from "@components/Typography";
import Facebook from "@components/icons/Facebook";
import Instagram from "@components/icons/Instagram"; // styled component
import Twitter from "@components/icons/Twitter";
import Youtube from "@components/icons/Youtube";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import { Box, Container, IconButton, Stack, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import LazyImage from "../LazyImage";

const StyledLink = styled("div")(({ theme }) => ({
  display: "block",
  borderRadius: 4,
  cursor: "pointer",
  position: "relative",
  padding: "0.3rem 0rem",
  color: theme.palette.grey[500],
  "&:hover": {
    color: theme.palette.grey[100],
  },
}));

const Footer = () => {
  const { value } = useSettingsContext();
  const logoSrc = getThumbnailUrl(value?.logoUrl);

  const iconList = [
    {
      icon: Facebook,
      url: value.facebook || "#",
    },
    {
      icon: Twitter,
      url: value.twitter || "#",
    },
    {
      icon: Youtube,
      url: value.youtube || "#",
    },
    {
      icon: Instagram,
      url: value.instagram || "#",
    },
  ];

  return (
    <footer>
      <Box bgcolor="#222935">
        <Container
          sx={{
            p: "1rem",
            color: "white",
          }}
        >
          <Box py={10} overflow="hidden">
            <Grid container spacing={3}>
              <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
                <Link href={"/"}>
                  <LazyImage
                    alt="footer-logo"
                    width={200}
                    height={150}
                    src={logoSrc}
                  />
                </Link>

                <Paragraph mb={2.5} color="grey.500">
                  {value?.siteDescription}
                </Paragraph>
              </Grid>

              <Grid size={{ lg: 2, md: 6, sm: 6, xs: 12 }}>
                <H5 mb={1.5}>Về chúng tôi</H5>

                <div>
                  {aboutLinks.map((item, ind) => (
                    <Link href="#" key={ind} passHref>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid size={{ lg: 3, md: 6, sm: 6, xs: 12 }}>
                <H5 mb={1.5}>Hỗ trợ khách hàng</H5>

                <div>
                  {customerCareLinks.map((item, ind) => (
                    <Link href="/" key={ind} passHref>
                      <StyledLink>{item}</StyledLink>
                    </Link>
                  ))}
                </div>
              </Grid>

              <Grid size={{ lg: 3, md: 6, sm: 6, xs: 12 }}>
                <H5 mb={1.5}>Liên hệ</H5>
                <Stack direction={"row"} py={0.6} gap={1} color="grey.500">
                  <LocationOn />
                  <Span>{value?.address}</Span>
                </Stack>
                <Stack direction={"row"} py={0.6} gap={1} color="grey.500">
                  <Email /> <Span>Email: {value.email}</Span>
                </Stack>
                <Stack direction={"row"} py={0.6} gap={1} color="grey.500">
                  <Phone /> <Span>Số điện thoại: {value?.phone}</Span>
                </Stack>

                <FlexBox className="flex" mx={-0.625} mt={2}>
                  {iconList.map((item, ind) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopenner"
                      key={ind}
                    >
                      <IconButton
                        sx={{
                          margin: 0.5,
                          fontSize: 16,
                          padding: "10px",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <item.icon fontSize="inherit" />
                      </IconButton>
                    </a>
                  ))}
                </FlexBox>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

const aboutLinks = [
  "Tuyển dụng",
  "Tin tức",
  "Sự kiện",
  "Khuyến mãi",
  "Thông tin nha khoa",
];
const customerCareLinks = [
  "Chính sách và Quy định chung",
  "Bảo mật thông tin",
  "Chính sách Đổi – Trả và Hoàn tiền",
  "Chính sách vận chuyển – Giao nhận",
  "Chính sách Bảo hành – Bảo trì",
  "Quy định hình thức thanh toán",
  "Hỏi đáp",
];

export default Footer;
