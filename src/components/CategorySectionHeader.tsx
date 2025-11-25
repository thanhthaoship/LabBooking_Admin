"use client";
import { Box } from "@mui/material";
import { H2, Paragraph } from "./Typography";

interface CategorySectionHeaderProps {
  title: string;
  subTitle?: string;
}

const CategorySectionHeader = ({
  title,
  subTitle,
}: CategorySectionHeaderProps) => {
  return (
    <Box>
      <H2 mb={1} textAlign={"center"}>
        {title}
      </H2>
      <Paragraph textAlign="center" mb={3}>
        {subTitle}
      </Paragraph>
    </Box>
  );
};

export default CategorySectionHeader;
