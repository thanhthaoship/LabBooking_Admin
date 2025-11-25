"use client";
import { Button } from "@mui/material";

interface ChooseMediaZoneProps {
  onClick?: () => void;
  title?: string;
  imageSize?: string;
}

const ChooseMediaButton = ({
  onClick,
  title = "Chọn ảnh",
}: ChooseMediaZoneProps) => {
  return (
    <Button onClick={onClick} type="button" variant="outlined" color="info">
      {title}
    </Button>
  );
};

export default ChooseMediaButton;
