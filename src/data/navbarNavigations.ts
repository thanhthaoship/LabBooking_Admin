import { COMMON_ROUTES } from "@/config/routes";

export interface INavbarItem {
  title: string;
  url: string;
}

const navbarList: INavbarItem[] = [
  {
    title: "Trang chủ",
    url: COMMON_ROUTES.HOME,
  },
];

export default navbarList;
