import { PropsWithChildren } from "react";
import appIcons from "../icons";

export interface NavbarRootProps {
  isfixed?: boolean;
  sidebarstyle?: "style1" | "style2";
}

export interface BorderBoxProps extends PropsWithChildren {
  linestyle?: "solid" | "dash";
}

export interface ColorBorderProps {
  grey?: number;
}

export interface CategoryItem {
  title: string;
  icon: keyof typeof appIcons;
  child?: Array<{ title: string }>;
}

export interface NavItem {
  category: string;
  categoryItem: CategoryItem[];
}

export interface SideNavbarProps {
  isFixed?: boolean;
  navList: NavItem[];
  lineStyle?: "solid" | "dash";
  sidebarStyle?: "style1" | "style2";
  sidebarHeight?: string | number;
  handleSelect?: (title: string) => void;
}
