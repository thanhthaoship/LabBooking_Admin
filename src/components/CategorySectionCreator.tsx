"use client";
import { Box, Container } from "@mui/material";
import CategorySectionHeader from "./CategorySectionHeader"; // ==============================================================
import { PropsWithChildren } from "react";

interface CategorySectionHeaderProps extends PropsWithChildren {
  title?: string;
  subTitle?: string;
}
// ==============================================================
const CategorySectionCreator = (props: CategorySectionHeaderProps) => {
  const { title, children, subTitle, ...others } = props;
  return (
    <Box mb={7.5} {...others}>
      <Container
        sx={{
          pb: "1rem",
        }}
      >
        {title && <CategorySectionHeader title={title} subTitle={subTitle} />}

        {children}
      </Container>
    </Box>
  );
};

export default CategorySectionCreator;
