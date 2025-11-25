import { ADMIN_ROUTES } from "@/config/routes";
import duotone from "@components/icons/duotone";
import { DiscountRounded, Feedback } from "@mui/icons-material";
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
        path: ADMIN_ROUTES.DASHBOARD,
      },

      {
        name: "Danh mục",
        icon: duotone.DataTable,
        pathSegment: "categories",
        path: ADMIN_ROUTES.CATEGORY.INDEX,
      },
      {
        name: "Sản phẩm",
        icon: duotone.Products,
        pathSegment: "products",
        path: ADMIN_ROUTES.PRODUCT.INDEX,
      },
      {
        name: "Thương hiệu",
        icon: duotone.Seller,
        pathSegment: "brands",
        path: ADMIN_ROUTES.BRAND.INDEX,
      },
      {
        name: "Mã giảm giá",
        icon: DiscountRounded,
        pathSegment: "discounts",
        path: ADMIN_ROUTES.DISCOUNT.INDEX,
      },
      {
        name: "Đơn hàng",
        icon: duotone.Order,
        pathSegment: "orders",
        path: ADMIN_ROUTES.ORDER.INDEX,
      },

      {
        name: "Tài khoản",
        icon: duotone.Customers,
        pathSegment: "accounts",
        path: ADMIN_ROUTES.ACCOUNT.INDEX,
      },
      {
        name: "Tin tức",
        icon: duotone.Chat,
        pathSegment: "blogs",
        path: ADMIN_ROUTES.BLOG.INDEX,
      },
      {
        name: "Đánh giá",
        icon: Feedback,
        pathSegment: "feedbacks",
        path: ADMIN_ROUTES.FEEDBACK.INDEX,
      },

      // {
      //   name: "Báo cáo",
      //   icon: duotone.ProjectChart,
      //   pathSegment: "reports",
      //   path: "#",
      // },
      {
        name: "Media",
        icon: duotone.ElementHub,
        pathSegment: "media",
        path: ADMIN_ROUTES.MEDIA.INDEX,
      },
    ],
  },
  {
    key: "2d4e6f8a-1b3c-5d7e-9f2a-8b4c6d2e0a1f",
    label: "Cài đặt",
    items: [
      {
        name: "Cài đặt trang web",
        icon: duotone.AccountSetting,
        pathSegment: "settings",
        path: ADMIN_ROUTES.SETTINGS,
      },
      {
        name: "Vòng quay may mắn",
        icon: duotone.Chat,
        pathSegment: "lucky-wheel",
        path: ADMIN_ROUTES.LUCKY_WHEEL.INDEX,
      },
      // {
      //   name: "Câu hỏi thường gặp",
      //   icon: duotone.Chat,
      //   pathSegment: "qa",
      //   path: "/vendor/support-tickets",
      // },
      // {
      //   name: "Đăng xuất",
      //   icon: duotone.Session,
      //   pathSegment: "log-out",
      //   path: COMMON_ROUTES.AUTH.LOG_OUT,
      // },
    ],
  },
];
