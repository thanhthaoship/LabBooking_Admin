export type GuidString = string;

export type SortDirection = "Ascending" | "Descending";
export type SortBy = "LabName" | "Location" | "CreatedDate";

export interface EquipmentResponse {
  id: GuidString;
  equipmentName: string;
  description?: string | null;
  isAvailable: boolean;
  labRoomId: GuidString;
  status: EquipmentStatus;
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

export interface SlotResponse {
  id: GuidString;
  startTime: string;
  endTime: string;
  slotIndex: number;
  label: string;
}

export interface CreateSlotCommand {
  startTime: string;
  endTime: string;
  slotIndex: 1 | 2 | 3 | 4;
  label: string;
}

export interface UpdateSlotCommand {
  startTime: string;
  endTime: string;
  slotIndex: 1 | 2 | 3 | 4;
  label: string;
}

export interface SupportsResponse {
  id: GuidString;
  title: string;
  content: string;
  answer?: string | null;
  createdById: GuidString;
}

export interface GetAllSupportsQuery {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: "Title" | "CreatedDate";
  sortDirection: SortDirection;
}

export interface CreateSupportCommand {
  title: string;
  content: string;
}

export interface UpdateSupportCommand {
  title: string;
  content: string;
  answer?: string | null;
}

export interface NotificationsResponse {
  id: GuidString;
  title: string;
  message: string;
  dataPayload?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface GetAllNotificationsQuery {
  searchPhrase?: string;
  isRead?: boolean;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: "CreatedAt" | "Title";
  sortDirection: SortDirection;
}

export interface IncidentsResponse {
  id: GuidString;
  labRoomId: GuidString;
  reportedById: GuidString;
  type: string;
  description: string;
  isResolved: boolean;
  createdAt: string;
}

export interface GetAllIncidentsQuery {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: "Description";
  sortDirection: SortDirection;
}

export interface UsagePolicyResponse {
  id: GuidString;
  title: string | null;
  description?: string | null;
  isActive: boolean;
  forAllLabRooms: boolean;
  labRoomId?: GuidString | null;
  effectiveFrom?: string | null;
  expirationDate?: string | null;
  createdDate: string;
  lastUpdatedDate?: string | null;
}

export interface GetAllUsagePoliciesQuery {
  searchPhrase?: string;
  isActive?: boolean;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: "CreatedDate" | "Title";
  sortDirection: SortDirection;
}

export interface CreateUsagePolicyCommand {
  title: string;
  description?: string | null;
  forAllLabRooms: boolean;
  labRoomId?: GuidString | null;
  effectiveFrom?: string | null;
  expirationDate?: string | null;
}

export interface UpdateUsagePolicyCommand {
  title: string;
  description?: string | null;
  forAllLabRooms: boolean;
  labRoomId?: GuidString | null;
  effectiveFrom?: string | null;
  expirationDate?: string | null;
  isActive: boolean;
}

export type EquipmentStatus = "Maintain" | "Available" | "Broken" | "Other";

export interface GetAllEquipmentsQuery {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: 5 | 10 | 15 | 30;
  sortBy?: "EquipmentName" | "Status" | "IsAvailable" | "LabRoomId";
  sortDirection: SortDirection;
}

export interface CreateEquipmentCommand {
  equipmentName: string;
  description?: string | null;
  labRoomId: GuidString;
}

export interface UpdateEquipmentCommand {
  equipmentName: string;
  description?: string | null;
  isAvailable: boolean;
  labRoomId: GuidString;
  status: EquipmentStatus;
}
