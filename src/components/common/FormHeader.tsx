"use client";

import { ArrowBack } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { H3 } from "../Typography";

interface FormHeaderProps {
  title: string;
}

export default function FormHeader({ title }: FormHeaderProps) {
  const router = useRouter();

  return (
    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
      <IconButton onClick={() => router.back()}>
        <ArrowBack />
      </IconButton>
      <H3>{title}</H3>
    </Stack>
  );
}
