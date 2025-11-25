import { components } from "./components";
import { blue, themeColors } from "./themeColors";
import { typography } from "./typography";

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const themesOptions = {
  typography,
  breakpoints,
  components: { ...components },
  palette: {
    primary: { ...blue, light: blue[100] },
    ...themeColors,
  },
};

const themeOptions = () => themesOptions;

export default themeOptions;
