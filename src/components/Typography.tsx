"use client";

import { Box, styled, TypographyProps } from "@mui/material";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export interface CustomTypographyProps
  extends TypographyProps,
    PropsWithChildren {
  className?: string;
  ellipsis?: boolean | number;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

const StyledBox = styled(Box, {
  shouldForwardProp: (props) => props !== "textTransformStyle",
})(({ textTransform, ellipsis }: CustomTypographyProps) => ({
  textTransform: textTransform || "none",
  whiteSpace: ellipsis ? "nowrap" : "normal",
  overflow: ellipsis ? "hidden" : "",
  textOverflow: ellipsis ? "ellipsis" : "",
})); // ============================================

// ============================================
export const H1 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h1"
      mb={0}
      mt={0}
      fontSize="30px"
      fontWeight="700"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H2 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h2"
      mb={0}
      mt={0}
      fontSize="25px"
      fontWeight="700"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H3 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component="h3"
      fontSize="20px"
      fontWeight="700"
      lineHeight="1.5"
      ellipsis={ellipsis ? 1 : undefined}
      textTransform={textTransform}
      className={clsx({
        [className || ""]: true,
      })}
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H4 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component="h4"
      fontSize="17px"
      fontWeight="600"
      lineHeight="1.5"
      ellipsis={ellipsis ? 1 : undefined}
      textTransform={textTransform}
      className={clsx({
        [className || ""]: true,
      })}
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H5 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h5"
      mb={0}
      mt={0}
      fontSize="16px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const H6 = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="h6"
      mb={0}
      mt={0}
      fontSize="14px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Paragraph = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="p"
      mb={0}
      mt={0}
      fontSize="14px"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Small = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="small"
      fontSize="12px"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Span = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="span"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};
export const Tiny = ({
  children,
  className,
  ellipsis,
  textTransform,
  ...props
}: CustomTypographyProps) => {
  return (
    <StyledBox
      textTransform={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || ""]: true,
      })}
      component="small"
      fontSize="10px"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};

interface HoverTitleProps {
  fontSize?: number;
}

export const HoverTitle = styled(H4)<HoverTitleProps>(
  ({ theme, fontSize = 14 }) => ({
    fontSize,
    marginBottom: 4,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "color 0.3s",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  })
);
