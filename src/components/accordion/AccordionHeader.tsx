"use client";

import { BoxProps, styled } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { FlexBox } from "@/components/flex-box";

interface AccordionHeaderProps extends BoxProps {
  open?: boolean;
  showIcon?: boolean;
  px?: string;
  py?: string;
}

const StyledFlexBox = styled(
  ({ children, open, ...rest }: AccordionHeaderProps) => (
    <FlexBox {...rest}>{children}</FlexBox>
  )
)(({ open, theme }) => ({
  alignItems: "center",
  justifyContent: "space-between",
  ".caretIcon": {
    transition: "transform 250ms ease-in-out",
    ...(theme.direction === "rtl"
      ? {
          transform: open ? "rotate(90deg)" : "rotate(180deg)",
        }
      : {
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }),
  },
}));

const AccordionHeader = ({
  sx,
  open,
  children,
  showIcon = true,
  px = "1rem",
  py = "0.5rem",
  ...others
}: AccordionHeaderProps) => {
  return (
    <StyledFlexBox open={open} sx={{ px, py, ...sx }} {...others}>
      {children}
      {showIcon && <ChevronRight className="caretIcon" fontSize="small" />}
    </StyledFlexBox>
  );
};

export default AccordionHeader;
