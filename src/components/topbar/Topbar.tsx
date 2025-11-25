"use client";
import { FlexBox } from "@/components/flex-box";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { Span } from "@components/Typography";
import { CallOutlined, MailOutline } from "@mui/icons-material";
import { Box, Container, styled } from "@mui/material";
import { layoutConstant, zaloOALink } from "@utils/constants"; // styled component

const TopbarWrapper = styled(Box)(({ theme }) => ({
  fontSize: 12,
  height: layoutConstant.topbarHeight,
  background: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  "& .topbarLeft": {
    "& .logo": {
      display: "none",
    },
    "& .title": {
      marginLeft: "10px",
    },
    "@media only screen and (max-width: 900px)": {
      "& .logo": {
        display: "block",
      },

      "& .email": {
        display: "none",
      },
    },
  },
  "& .topbarRight": {
    "& .link": {
      paddingRight: 30,
      color: theme.palette.secondary.contrastText,
    },
  },
  "& .menuItem": {
    minWidth: 100,
  },
  "& .marginRight": {
    marginRight: "1.25rem",
  },
  "& .handler": {
    height: layoutConstant.topbarHeight,
  },
  "& .smallRoundedImage": {
    height: 15,
    width: 25,
    borderRadius: 2,
  },
  "& .menuTitle": {
    fontSize: 12,
    marginLeft: "0.5rem",
    fontWeight: 600,
  },
})); // ===========================================

// ===========================================
const Topbar = () => {
  const { value } = useSettingsContext();
  const handleHelpClick = () => window.open(zaloOALink, "_blank");

  return (
    <TopbarWrapper>
      <Container
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FlexBox className="topbarLeft" alignItems="center">
          <FlexBox alignItems="center">
            <CallOutlined fontSize="small" />
            <Span className="title">{value?.phone}</Span>
          </FlexBox>

          <FlexBox className="email" alignItems="center" ml={2.5}>
            <MailOutline fontSize="small" />
            <Span className="title">{value?.email}</Span>
          </FlexBox>
        </FlexBox>

        <FlexBox className="topbarRight" alignItems="center">
          <Span sx={{ cursor: "pointer" }} onClick={handleHelpClick}>
            Cần trợ giúp?
          </Span>
        </FlexBox>
      </Container>
    </TopbarWrapper>
  );
};

export default Topbar;
