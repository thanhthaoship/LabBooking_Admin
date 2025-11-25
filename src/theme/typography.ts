import { TypographyTheme } from "./types";

export const fontSize: number = 14;
export const fontFamily: string = [
  "Open Sans",
  "Roboto",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Fira Sans",
  "Droid Sans",
  "Helvetica Neue",
  "sans-serif",
].join(",");
export const typography: TypographyTheme = {
  fontSize,
  fontFamily,
  htmlFontSize: 16,
  body1: {
    fontSize,
  },
  body2: {
    fontSize,
  },
};
