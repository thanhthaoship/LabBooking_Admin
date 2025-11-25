import { TableHeadingItem } from "./types";

export type AccountTableIds =
  | "index"
  | "fullname"
  | "phoneNumber"
  | "email"
  | "joinedDate"
  | "role"
  | "isActive"
  | "action";

export interface AccountTableHeadingItem extends TableHeadingItem {
  id: AccountTableIds;
}

// Then update your tableHeading declaration to use this type
export const accountTableHeading: AccountTableHeadingItem[] = [
  {
    id: "index",
    label: "#",
    align: "left",
  },
  {
    id: "fullname",
    label: "Họ và tên",
    align: "left",
    sortable: true,
  },
  {
    id: "phoneNumber",
    label: "Số điện thoại",
    align: "left",
    sortable: true,
  },
  { id: "email", label: "Email", align: "left", sortable: true },
  {
    id: "role",
    label: "Vai trò",
    align: "left",
    sortable: true,
  },
  {
    id: "joinedDate",
    label: "Ngày tham gia",
    align: "left",
    sortable: true,
  },
  {
    id: "isActive",
    label: "Trạng thái",
    align: "center",
    sortable: true,
  },
  { id: "action", sortable: false, label: "Thao tác", align: "center" },
];
