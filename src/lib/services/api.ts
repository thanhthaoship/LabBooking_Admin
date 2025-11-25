import { ApiError, CreateLabRoomCommand, GetAllLabRoomsQuery, LabRoomResponse, PagedResult, UpdateLabRoomCommand, SlotResponse, CreateSlotCommand, UpdateSlotCommand } from '../types';

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

function normalizeBase(): string {
  const raw = (process.env.aspNetApiUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
  return raw || '';
}

function labRoomsRoot(): string {
  const base = normalizeBase();
  if (!base) return '/api/LabRooms';
  if (base.endsWith('/api')) return `${base}/LabRooms`;
  return `${base}/api/LabRooms`;
}

function slotsRoot(): string {
  const base = normalizeBase();
  if (!base) return '/api/Slot';
  if (base.endsWith('/api')) return `${base}/Slot`;
  return `${base}/api/Slot`;
}

function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.append(k, String(v));
  });
  return usp.toString();
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(init?.headers ?? {}),
  };
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as Record<string, unknown>)?.['message'] as string ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const hasBody = res.status !== 204;
  if (!hasBody) return undefined as unknown as T;
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export async function getLabRooms(query: GetAllLabRoomsQuery): Promise<PagedResult<LabRoomResponse>> {
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

export async function createLabRoom(payload: CreateLabRoomCommand): Promise<string | null> {
  const res = await fetch(labRoomsRoot(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as Record<string, unknown>)?.['message'] as string ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get('Location');
  if (!location) return null;
  const id = location.split('/').filter(Boolean).pop() ?? null;
  return id;
}

export async function updateLabRoom(id: string, payload: UpdateLabRoomCommand): Promise<void> {
  await request<void>(`${labRoomsRoot()}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteLabRoom(id: string): Promise<void> {
  await request<void>(`${labRoomsRoot()}/${id}`, { method: 'DELETE' });
}

export async function getSlots(): Promise<SlotResponse[]> {
  return request<SlotResponse[]>(`${slotsRoot()}`);
}

export async function getSlot(id: string): Promise<SlotResponse> {
  return request<SlotResponse>(`${slotsRoot()}/${id}`);
}

export async function createSlot(payload: CreateSlotCommand): Promise<string | null> {
  const res = await fetch(slotsRoot(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as Record<string, unknown>)?.['message'] as string ?? message;
    } catch {}
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  const location = res.headers.get('Location');
  if (!location) return null;
  const id = location.split('/').filter(Boolean).pop() ?? null;
  return id;
}

export async function updateSlot(id: string, payload: UpdateSlotCommand): Promise<void> {
  await request<void>(`${slotsRoot()}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteSlot(id: string): Promise<void> {
  await request<void>(`${slotsRoot()}/${id}`, { method: 'DELETE' });
}
