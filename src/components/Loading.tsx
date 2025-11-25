"use client";
import { CircularProgress, Stack } from "@mui/material";

const Loading = () => {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight={200}>
      <CircularProgress />
    </Stack>
  );
};

export default Loading;
