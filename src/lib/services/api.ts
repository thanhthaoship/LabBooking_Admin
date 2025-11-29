import {
  ApiError,
  CreateLabRoomCommand,
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
  UpdateLabRoomCommand,
  SlotResponse,
  CreateSlotCommand,
  UpdateSlotCommand,
  SupportsResponse,
  GetAllSupportsQuery,
  CreateSupportCommand,
  UpdateSupportCommand,
  NotificationsResponse,
  GetAllNotificationsQuery,
  IncidentsResponse,
  GetAllIncidentsQuery,
  UsagePolicyResponse,
  GetAllUsagePoliciesQuery,
  CreateUsagePolicyCommand,
  UpdateUsagePolicyCommand,
  EquipmentResponse,
  GetAllEquipmentsQuery,
  CreateEquipmentCommand,
  UpdateEquipmentCommand,
  AuthResponse,
  LoginUserCommand,
  RefreshTokenRequest,
  UserProfileResponse,
  CourseResponse,
  GetAllCoursesQuery,
  CreateCourseCommand,
  UpdateCourseCommand,
  SecurityGuardResponse,
  CreateSecurityGuardCommand,
  UpdateSecurityGuardCommand,
  EquipmentMaintainScheduleResponse,
  GetAllEquipmentMaintainSchedulesQuery,
  CreateEquipmentMaintainScheduleCommand,
  UpdateEquipmentMaintainScheduleCommand,
  RoomMaintainScheduleResponse,
  GetAllRoomMaintainSchedulesQuery,
  CreateRoomMaintainScheduleCommand,
  UpdateRoomMaintainScheduleCommand,
  UserResponse,
  GetAllUsersQuery,
} from "../types";

let authToken: string | null = null;

function resolveAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof localStorage !== "undefined") {
    const t = localStorage.getItem("accessToken");
    if (t) {
      authToken = t;
      return t;
    }
  }
  return null;
}

export function setAuthToken(token: string | null): void {
  authToken = token;
}

function normalizeBase(): string {
  const raw = (
    process.env.aspNetApiUrl ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    ""
  ).replace(/\/+$/, "");
  return raw || "";
}

function labRoomsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/LabRooms";
  if (base.endsWith("/api")) return `${base}/LabRooms`;
  return `${base}/api/LabRooms`;
}

function slotsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Slot";
  if (base.endsWith("/api")) return `${base}/Slot`;
  return `${base}/api/Slot`;
}

function supportsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Supports";
  if (base.endsWith("/api")) return `${base}/Supports`;
  return `${base}/api/Supports`;
}

function notificationsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Notifications";
  if (base.endsWith("/api")) return `${base}/Notifications`;
  return `${base}/api/Notifications`;
}

function incidentsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Incidents";
  if (base.endsWith("/api")) return `${base}/Incidents`;
  return `${base}/api/Incidents`;
}

function usagePoliciesRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/UsagePolicies";
  if (base.endsWith("/api")) return `${base}/UsagePolicies`;
  return `${base}/api/UsagePolicies`;
}

function equipmentsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Equipments";
  if (base.endsWith("/api")) return `${base}/Equipments`;
  return `${base}/api/Equipments`;
}

function coursesRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Course";
  if (base.endsWith("/api")) return `${base}/Course`;
  return `${base}/api/Course`;
}

function securityGuardsRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/SecurityGuard";
  if (base.endsWith("/api")) return `${base}/SecurityGuard`;
  return `${base}/api/SecurityGuard`;
}

function equipmentMaintainSchedulesRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/EquipmentMaintainSchedules";
  if (base.endsWith("/api")) return `${base}/EquipmentMaintainSchedules`;
  return `${base}/api/EquipmentMaintainSchedules`;
}

function roomMaintainSchedulesRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/RoomMaintainSchedules";
  if (base.endsWith("/api")) return `${base}/RoomMaintainSchedules`;
  return `${base}/api/RoomMaintainSchedules`;
}

function authRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Auth";
  if (base.endsWith("/api")) return `${base}/Auth`;
  return `${base}/api/Auth`;
}

function usersRoot(): string {
  const base = normalizeBase();
  if (!base) return "/api/Users";
  if (base.endsWith("/api")) return `${base}/Users`;
  return `${base}/api/Users`;
}

function toQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.append(k, String(v));
  });
  return usp.toString();
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const t = resolveAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(init?.headers ?? {}),
  };
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const hasBody = res.status !== 204;
  if (!hasBody) return undefined as unknown as T;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const json = await res.json();
    const hasData = json && typeof json === "object" && Object.prototype.hasOwnProperty.call(json, "data");
    return (hasData ? (json.data as T) : (json as T));
  }
  return (await res.text()) as unknown as T;
}

export async function getLabRooms(
  query: GetAllLabRoomsQuery
): Promise<PagedResult<LabRoomResponse>> {
  const qs = toQueryString({
    SearchPhrase: query.searchPhrase,
    PageNumber: query.pageNumber,
    PageSize: query.pageSize,
    SortBy: query.sortBy,
    SortDirection: query.sortDirection,
  });
  return request<PagedResult<LabRoomResponse>>(`${labRoomsRoot()}?${qs}`);
}

export async function getLabRoom(id: string): Promise<LabRoomResponse> {
  return request<LabRoomResponse>(`${labRoomsRoot()}/${id}`);
}

export async function createLabRoom(
  payload: CreateLabRoomCommand
): Promise<string | null> {
  const t = resolveAuthToken();
  const res = await fetch(labRoomsRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) return null;
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateLabRoom(
  id: string,
  payload: UpdateLabRoomCommand
): Promise<void> {
  await request<void>(`${labRoomsRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLabRoom(id: string): Promise<void> {
  await request<void>(`${labRoomsRoot()}/${id}`, { method: "DELETE" });
}

export async function getSlots(): Promise<SlotResponse[]> {
  return request<SlotResponse[]>(`${slotsRoot()}`);
}

export async function getSlot(id: string): Promise<SlotResponse> {
  return request<SlotResponse>(`${slotsRoot()}/${id}`);
}

export async function createSlot(
  payload: CreateSlotCommand
): Promise<string | null> {
  const res = await fetch(slotsRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resolveAuthToken()
        ? { Authorization: `Bearer ${resolveAuthToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) return null;
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateSlot(
  id: string,
  payload: UpdateSlotCommand
): Promise<void> {
  await request<void>(`${slotsRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSlot(id: string): Promise<void> {
  await request<void>(`${slotsRoot()}/${id}`, { method: "DELETE" });
}

export async function getSupports(
  query: GetAllSupportsQuery
): Promise<PagedResult<SupportsResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<SupportsResponse>>(
    `${supportsRoot()}?${qs.toString()}`
  );
}

export async function getSupport(id: string): Promise<SupportsResponse> {
  return request<SupportsResponse>(`${supportsRoot()}/${id}`);
}

export async function createSupport(
  payload: CreateSupportCommand
): Promise<string | null> {
  const res = await fetch(supportsRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resolveAuthToken()
        ? { Authorization: `Bearer ${resolveAuthToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) return null;
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateSupport(
  id: string,
  payload: UpdateSupportCommand
): Promise<void> {
  await request<void>(`${supportsRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSupport(id: string): Promise<void> {
  await request<void>(`${supportsRoot()}/${id}`, { method: "DELETE" });
}

export async function getNotifications(
  query: GetAllNotificationsQuery
): Promise<PagedResult<NotificationsResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  if (typeof query.isRead === "boolean")
    qs.append("IsRead", String(query.isRead));
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<NotificationsResponse>>(
    `${notificationsRoot()}?${qs.toString()}`
  );
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await request<void>(`${notificationsRoot()}/${id}/read`, { method: "PUT" });
}

export async function sendTestNotificationToSelf(): Promise<string> {
  return request<string>(`${notificationsRoot()}/send-to-me`);
}

export async function getIncidents(
  query: GetAllIncidentsQuery
): Promise<PagedResult<IncidentsResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<IncidentsResponse>>(
    `${incidentsRoot()}?${qs.toString()}`
  );
}

export async function getUsagePolicies(
  query: GetAllUsagePoliciesQuery
): Promise<PagedResult<UsagePolicyResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  if (typeof query.isActive === "boolean")
    qs.append("IsActive", String(query.isActive));
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<UsagePolicyResponse>>(
    `${usagePoliciesRoot()}?${qs.toString()}`
  );
}

export async function getUsagePolicy(id: string): Promise<UsagePolicyResponse> {
  return request<UsagePolicyResponse>(`${usagePoliciesRoot()}/${id}`);
}

export async function createUsagePolicy(
  payload: CreateUsagePolicyCommand
): Promise<string | null> {
  const res = await fetch(usagePoliciesRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resolveAuthToken()
        ? { Authorization: `Bearer ${resolveAuthToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) return null;
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateUsagePolicy(
  id: string,
  payload: UpdateUsagePolicyCommand
): Promise<void> {
  await request<void>(`${usagePoliciesRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUsagePolicy(id: string): Promise<void> {
  await request<void>(`${usagePoliciesRoot()}/${id}`, { method: "DELETE" });
}

export async function getEquipments(
  query: GetAllEquipmentsQuery
): Promise<PagedResult<EquipmentResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<EquipmentResponse>>(
    `${equipmentsRoot()}?${qs.toString()}`
  );
}

export async function getEquipment(id: string): Promise<EquipmentResponse> {
  return request<EquipmentResponse>(`${equipmentsRoot()}/${id}`);
}

export async function createEquipment(
  payload: CreateEquipmentCommand
): Promise<string | null> {
  const res = await fetch(equipmentsRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resolveAuthToken()
        ? { Authorization: `Bearer ${resolveAuthToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) return null;
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateEquipment(
  id: string,
  payload: UpdateEquipmentCommand
): Promise<void> {
  await request<void>(`${equipmentsRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEquipment(id: string): Promise<void> {
  await request<void>(`${equipmentsRoot()}/${id}`, { method: "DELETE" });
}

export async function moveEquipment(
  id: string,
  newLabRoomId: string
): Promise<void> {
  const current = await getEquipment(id);
  const payload: UpdateEquipmentCommand = {
    equipmentName: current.equipmentName,
    description: current.description ?? null,
    isAvailable: current.isAvailable,
    labRoomId: newLabRoomId,
    status: current.status,
  };
  await updateEquipment(id, payload);
}

export async function login(payload: LoginUserCommand): Promise<AuthResponse> {
  const res = await request<AuthResponse>(`${authRoot()}/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(res.accessToken ?? null);
  try {
    if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);
    if (res.refreshToken)
      localStorage.setItem("refreshToken", res.refreshToken);
  } catch {}
  return res;
}

export async function logout(): Promise<void> {
  await request<void>(`${authRoot()}/logout`, { method: "POST" });
  setAuthToken(null);
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch {}
}

export async function refreshToken(
  payload: RefreshTokenRequest
): Promise<AuthResponse> {
  const res = await request<AuthResponse>(`${authRoot()}/refresh-token`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(res.accessToken ?? null);
  try {
    if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);
    if (res.refreshToken)
      localStorage.setItem("refreshToken", res.refreshToken);
  } catch {}
  return res;
}

export async function getProfile(): Promise<UserProfileResponse> {
  return request<UserProfileResponse>(`${authRoot()}/profile`);
}

export async function getCourses(
  query: GetAllCoursesQuery
): Promise<PagedResult<CourseResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<CourseResponse>>(
    `${coursesRoot()}?${qs.toString()}`
  );
}

export async function getCourse(id: string): Promise<CourseResponse> {
  return request<CourseResponse>(`${coursesRoot()}/${id}`);
}

export async function createCourse(
  payload: CreateCourseCommand
): Promise<string | null> {
  const res = await fetch(coursesRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resolveAuthToken()
        ? { Authorization: `Bearer ${resolveAuthToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) {
    try {
      const body = await res.json();
      const id = (body as any)?.Id ?? (body as any)?.id ?? null;
      return id ?? null;
    } catch {
      return null;
    }
  }
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateCourse(
  id: string,
  payload: UpdateCourseCommand
): Promise<void> {
  await request<void>(`${coursesRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCourse(id: string): Promise<void> {
  await request<void>(`${coursesRoot()}/${id}`, { method: "DELETE" });
}

export async function createSecurityGuard(
  payload: CreateSecurityGuardCommand
): Promise<string> {
  const res = await request<{ message: string }>(securityGuardsRoot(), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.message ?? "Created";
}

export async function getSecurityGuard(
  id: string
): Promise<SecurityGuardResponse> {
  return request<SecurityGuardResponse>(`${securityGuardsRoot()}/${id}`);
}

export async function updateSecurityGuard(
  id: string,
  payload: UpdateSecurityGuardCommand
): Promise<void> {
  await request<void>(`${securityGuardsRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteSecurityGuard(id: string): Promise<void> {
  await request<void>(`${securityGuardsRoot()}/${id}`, { method: "DELETE" });
}

export async function getEquipmentMaintainSchedules(
  query: GetAllEquipmentMaintainSchedulesQuery
): Promise<PagedResult<EquipmentMaintainScheduleResponse>> {
  const qs = new URLSearchParams();
  if (query.searchPhrase) qs.append("SearchPhrase", query.searchPhrase);
  if (query.status) qs.append("Status", query.status);
  qs.append("PageNumber", String(query.pageNumber));
  qs.append("PageSize", String(query.pageSize));
  if (query.sortBy) qs.append("SortBy", query.sortBy);
  qs.append("SortDirection", query.sortDirection);
  return request<PagedResult<EquipmentMaintainScheduleResponse>>(
    `${equipmentMaintainSchedulesRoot()}?${qs.toString()}`
  );
}

export async function getEquipmentMaintainSchedule(
  id: string
): Promise<EquipmentMaintainScheduleResponse> {
  return request<EquipmentMaintainScheduleResponse>(
    `${equipmentMaintainSchedulesRoot()}/${id}`
  );
}

export async function createEquipmentMaintainSchedule(
  payload: CreateEquipmentMaintainScheduleCommand
): Promise<string | null> {
  const res = await request<{ id: string }>(equipmentMaintainSchedulesRoot(), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (res as any)?.id ?? null;
}

export async function updateEquipmentMaintainSchedule(
  id: string,
  payload: UpdateEquipmentMaintainScheduleCommand
): Promise<void> {
  await request<void>(`${equipmentMaintainSchedulesRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEquipmentMaintainSchedule(
  id: string
): Promise<void> {
  await request<void>(`${equipmentMaintainSchedulesRoot()}/${id}`, {
    method: "DELETE",
  });
}

export async function getRoomMaintainSchedules(
  query: GetAllRoomMaintainSchedulesQuery
): Promise<PagedResult<RoomMaintainScheduleResponse>> {
  const qs = toQueryString({
    SearchPhrase: query.searchPhrase,
    Status: query.status,
    PageNumber: query.pageNumber,
    PageSize: query.pageSize,
    SortBy: query.sortBy,
    SortDirection: query.sortDirection,
  });
  return request<PagedResult<RoomMaintainScheduleResponse>>(
    `${roomMaintainSchedulesRoot()}?${qs}`
  );
}

export async function getRoomMaintainSchedule(
  id: string
): Promise<RoomMaintainScheduleResponse> {
  return request<RoomMaintainScheduleResponse>(
    `${roomMaintainSchedulesRoot()}/${id}`
  );
}

export async function createRoomMaintainSchedule(
  payload: CreateRoomMaintainScheduleCommand
): Promise<string | null> {
  const t = resolveAuthToken();
  const res = await fetch(roomMaintainSchedulesRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message =
        ((data as Record<string, unknown>)?.["message"] as string) ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get("Location");
  if (!location) {
    try {
      const body = await res.json();
      const id = (body as any)?.Id ?? (body as any)?.id ?? null;
      return id ?? null;
    } catch {
      return null;
    }
  }
  const id = location.split("/").filter(Boolean).pop() ?? null;
  return id;
}

export async function updateRoomMaintainSchedule(
  id: string,
  payload: UpdateRoomMaintainScheduleCommand
): Promise<void> {
  await request<void>(`${roomMaintainSchedulesRoot()}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export async function deleteRoomMaintainSchedule(id: string): Promise<void> {
  await request<void>(`${roomMaintainSchedulesRoot()}/${id}`, {
    method: "DELETE",
  });
}

export async function getUsers(
  query: GetAllUsersQuery
): Promise<PagedResult<UserResponse>> {
  const qs = toQueryString({
    SearchPhrase: query.searchPhrase,
    RoleName: query.roleName,
    PageNumber: query.pageNumber,
    PageSize: query.pageSize,
    SortBy: query.sortBy,
    SortDirection: query.sortDirection,
  });
  return request<PagedResult<UserResponse>>(`${usersRoot()}?${qs}`);
}
