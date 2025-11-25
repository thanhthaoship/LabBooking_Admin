import CategoryMenu from "@/components/categories/CategoryMenu";
import BazaarCard from "@components/BazaarCard";
import Category from "@components/icons/Category";
import { Paragraph } from "@components/Typography";
import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Container, styled } from "@mui/material";
import navbarList, { INavbarItem } from "@data/navbarNavigations"; // NavList props interface
import { Theme } from "@mui/material";
import { useRouter } from "next/navigation";

interface IProps {
  border?: number;
  theme?: Theme;
  hoverEffect?: boolean;
  elevation?: number;
}

interface NavbarProps {
  navListOpen?: boolean;
  hideCategories?: boolean;
  elevation?: number;
  border?: number;
}

const NavBarWrapper = styled(BazaarCard)<IProps>(({ theme, border }) => ({
  height: "60px",
  display: "block",
  borderRadius: "0px",
  position: "relative",
  ...(border && {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  }),
  [theme.breakpoints.down(1150)]: {
    display: "none",
  },
}));

const InnerContainer = styled(Container)(() => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const CategoryMenuButton = styled(Button)(({ theme }) => ({
  width: "278px",
  height: "40px",
  backgroundColor: theme.palette.grey[100],
}));

const FlexBox = styled(Box)`
  display: flex;
  cursor: pointer;
  font-weight: 600;
  & :hover {
    color: blue;
    & ::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px; /* Thickness of the underline */
      background-color: #000; /* Color of the underline */
      transition: width 0.3s ease; /* Smooth transition for the underline effect */
    }
  }
`;

// ==========================================================

const Navbar = ({
  navListOpen = false,
  hideCategories = false,
  elevation = 2,
  border,
}: NavbarProps) => {
  const router = useRouter();

  const renderNestedNav = (list: INavbarItem[] = []) => {
    return list.map((nav) => {
      return (
        <FlexBox onClick={() => router.push(nav.url)} key={nav.title}>
          {nav.title}
        </FlexBox>
      );
    });
  };

  return (
    <NavBarWrapper hoverEffect={false} elevation={elevation} border={border}>
      {!hideCategories ? (
        <InnerContainer>
          {/* Category megamenu */}
          <CategoryMenu open={navListOpen}>
            <CategoryMenuButton variant="text">
              <Category fontSize="small" />
              <Paragraph
                fontWeight="600"
                textAlign="left"
                flex="1 1 0"
                ml={1.25}
                color="grey.600"
              >
                Danh mục sản phẩm
              </Paragraph>

              <ChevronRight className="dropdown-icon" fontSize="small" />
            </CategoryMenuButton>
          </CategoryMenu>

          {/* Horizontal menu */}
          <FlexBox gap={4}>{renderNestedNav(navbarList)}</FlexBox>
        </InnerContainer>
      ) : (
        <InnerContainer
          sx={{
            justifyContent: "center",
          }}
        >
          <FlexBox gap={4}>{renderNestedNav(navbarList)}</FlexBox>
        </InnerContainer>
      )}
    </NavBarWrapper>
  );
}; //  set default props data

export default Navbar;
