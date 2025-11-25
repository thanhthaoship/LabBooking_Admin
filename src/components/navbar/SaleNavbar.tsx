import { FlexRowCenter } from "@/components/flex-box";
import { CategoryModel } from "@/config/models/category";
import Scrollbar from "@components/Scrollbar";
import { Box, Container, styled } from "@mui/material";
import Image from "next/image";
import { H5 } from "../Typography";

interface TitleProps {
  selected: number;
}

interface SaleNavbarProps {
  categories: CategoryModel[];
  selected: string;
  onChangeCategory: (slug: string) => () => void;
}

const StyledScrollbar = styled(Scrollbar)(() => ({
  "& .simplebar-content": {
    height: "5rem",
    display: "flex",
    backgroundColor: "white",
    justifyContent: "center",
  },
}));

const Title = styled(H5)<TitleProps>(({ selected, theme }) => ({
  fontSize: "12px",
  textAlign: "center",
  fontWeight: selected ? "600" : "400",
  color: selected ? theme.palette.primary.main : "inherit",
}));

const SaleNavbar = ({
  categories,
  selected,
  onChangeCategory,
}: SaleNavbarProps) => {
  return (
    <Box bgcolor="background.paper">
      <Container>
        <StyledScrollbar autoHide={false}>
          {categories.map((item: CategoryModel) => {
            const selectedItem = item.categoryId === selected ? 1 : 0;
            return (
              <FlexRowCenter
                key={item.categoryId}
                onClick={onChangeCategory(item.categoryId)}
                sx={{
                  cursor: "pointer",
                  minWidth: "100px",
                  flexDirection: "column",
                  background: selectedItem ? "primary.light" : "transparent",
                }}
              >
                <Image
                  src={item.media?.fileUrl ?? ""}
                  alt={item.name}
                  width={32}
                  height={32}
                />
                <Title selected={selectedItem}>{item.name}</Title>
              </FlexRowCenter>
            );
          })}
        </StyledScrollbar>
      </Container>
    </Box>
  );
};

export default SaleNavbar;
