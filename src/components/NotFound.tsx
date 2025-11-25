"use client";
import { SentimentDissatisfied } from "@mui/icons-material";
import { Box } from "@mui/material";
import { H6, Span } from "./Typography";

interface NotFoundProps {
  title?: string;
  searchTerm?: string;
}

const NotFound = ({
  title = "Không tìm thấy dữ liệu",
  searchTerm,
}: NotFoundProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        backgroundColor: "background.paper",
      }}
    >
      <SentimentDissatisfied
        sx={{
          fontSize: 60,
          color: "grey.400",
          mb: 2,
        }}
      />
      <H6 color="grey.600">{title}</H6>
      {searchTerm && (
        <Span color="grey.500">
          {`Không tìm thấy dữ liệu phù hợp với từ khóa "${searchTerm}"`}
        </Span>
      )}
    </Box>
  );
};

export default NotFound;
