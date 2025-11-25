import duotone from "@components/icons/duotone";
import { FC } from "react";

export interface NavigationGroup {
  key: string;
  label?: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  name: string;
  pathSegment: string;
  icon: FC;
  iconText?: string;
  path: string;
  children?: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    key: "8f7b5a3e-9d12-4c63-b821-5a71e4f89c1d",
    label: "Admin",
    items: [
      {
        name: "Trang chủ",
        icon: duotone.Dashboard,
        pathSegment: "dashboard",
        path: "/",
      },
      {
        name: "Quản lý phòng Lab",
        icon: duotone.TableList,
        pathSegment: "lab-rooms",
        path: "/lab-rooms",
      },
      {
        name: "Cấu hình Slot",
        icon: duotone.Calender,
        pathSegment: "slots",
        path: "/slots",
      },
      {
        name: "Hỗ trợ",
        icon: duotone.Chat,
        pathSegment: "supports",
        path: "/supports",
      },
    ],
  },
];
