export type GuidString = string;

export type SortDirection = "Ascending" | "Descending";
export type SortBy = "LabName" | "Location" | "CreatedDate";

export interface EquipmentResponse {
  id: GuidString;
  equipmentName: string;
  description?: string | null;
  isAvailable: boolean;
  labRoomId: GuidString;
  status: string;
}

export interface LabRoomResponse {
  id: GuidString;
  labName: string;
  location?: string | null;
  maximumLimit?: number | null;
  mainManagerId?: GuidString | null;
  createdById?: GuidString | null;
  createdDate: string;
  isActive: boolean;
  equipments?: EquipmentResponse[] | null;
}

export interface PagedResult<T> {
  items: T[];
  totalPages: number;
  totalItemsCount: number;
  itemsFrom: number;
  itemsTo: number;
}

export interface GetAllLabRoomsQuery {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: SortBy;
  sortDirection: SortDirection;
}

export interface CreateLabRoomCommand {
  labName: string;
  location?: string | null;
  maximumLimit?: number | null;
  mainManagerId?: GuidString | null;
}

export interface UpdateLabRoomCommand {
  labName: string;
  location?: string | null;
  maximumLimit?: number | null;
  mainManagerId?: GuidString | null;
  isActive: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
