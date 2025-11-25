"use client";
import { defaultErrorMessage } from "@/config/labels/error";
import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { Box } from "@mui/material";
import { H5 } from "./Typography";
import { isEmpty } from "lodash";

interface ErrorProps {
  message?: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <SentimentVeryDissatisfied
        sx={{
          fontSize: 60,
          color: "grey.400",
          mb: 2,
        }}
      />
      <H5 color="red">{isEmpty(message) ? defaultErrorMessage : message}</H5>
    </Box>
  );
};

export default Error;
