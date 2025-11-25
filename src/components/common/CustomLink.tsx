"use client";
import { Typography } from "@mui/material";
import Link from "next/link";

interface CustomLinkProps {
  label?: string;
  target?: string;
  href: string;
}

export default function CustomLink(props: CustomLinkProps) {
  const { label, href, target } = props;
  return (
    <Link href={href} target={target} rel="noopener noreferrer">
      <Typography
        color="primary"
        sx={{
          display: "block",
          wordBreak: "break-all",
          overflowWrap: "break-word",
          maxWidth: "100%",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {label || href}
      </Typography>
    </Link>
  );
}
