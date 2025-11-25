export type AlignProps = "left" | "center" | "right" | "justify" | "inherit";

export type SortDirection = "asc" | "desc";

export interface TableHeadingItem {
  id: string;
  label: string;
  align: "left" | "center" | "right";
  sortable?: boolean;
}
