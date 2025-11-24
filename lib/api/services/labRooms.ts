import api from '@/lib/api/core'
import { z } from 'zod'
import {
  LabRoomResponseSchema,
  GetAllLabRoomsResponseSchema,
  CreateLabRoomSchema,
  UpdateLabRoomSchema,
  LabRoomResponse,
  CreateLabRoomRequest,
  UpdateLabRoomRequest
} from '@/lib/zod/labRooms'

export const labRoomKeys = {
  all: ['labRooms'] as const,
  list: (filters: Record<string, unknown>) => [...labRoomKeys.all, 'list', filters] as const,
  detail: (id: string) => [...labRoomKeys.all, 'detail', id] as const
}

const extractIdFromLocation = (location?: string) => {
  if (!location) return null
  const parts = location.split('/')
  return parts[parts.length - 1] || null
}

export const labRoomsService = {
  getAll: async (params: {
    searchPhrase?: string
    pageNumber: number
    pageSize: number
    sortBy?: string
    sortDirection: 'Ascending' | 'Descending'
  }) => {
    const res = await api.get('/api/LabRooms', { params })
    const parsed = GetAllLabRoomsResponseSchema.parse(res.data)
    return parsed
  },

  getById: async (id: string): Promise<LabRoomResponse> => {
    const res = await api.get(`/api/LabRooms/${id}`)
    const parsed = LabRoomResponseSchema.parse(res.data)
    return parsed
  },

  create: async (body: CreateLabRoomRequest) => {
    CreateLabRoomSchema.parse(body)
    const res = await api.post('/api/LabRooms', body)
    const id = extractIdFromLocation(res.headers['location'] as string | undefined)
    return { id }
  },

  update: async (id: string, body: UpdateLabRoomRequest) => {
    UpdateLabRoomSchema.parse(body)
    await api.put(`/api/LabRooms/${id}`, body)
  },

  delete: async (id: string) => {
    await api.delete(`/api/LabRooms/${id}`)
  }
}