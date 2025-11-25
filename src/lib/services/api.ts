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
} from "../types";

let authToken: string | null = null;

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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
  if (ct.includes("application/json")) return (await res.json()) as T;
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
  const res = await fetch(labRoomsRoot(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
