import api from '@/lib/api/core'
import {
  EquipmentResponseSchema,
  GetAllEquipmentsResponseSchema,
  CreateEquipmentSchema,
  UpdateEquipmentSchema,
  EquipmentResponse,
  CreateEquipmentRequest,
  UpdateEquipmentRequest
} from '@/lib/zod/equipments'

export const equipmentKeys = {
  all: ['equipments'] as const,
  list: (filters: Record<string, unknown>) => [...equipmentKeys.all, 'list', filters] as const,
  detail: (id: string) => [...equipmentKeys.all, 'detail', id] as const
}

const extractIdFromLocation = (location?: string) => {
  if (!location) return null
  const parts = location.split('/')
  return parts[parts.length - 1] || null
}

export const equipmentsService = {
  getAll: async (params: {
    searchPhrase?: string
    pageNumber: number
    pageSize: number
    sortBy?: string
    sortDirection: 'Ascending' | 'Descending'
  }) => {
    const res = await api.get('/api/Equipments', { params })
    const parsed = GetAllEquipmentsResponseSchema.parse(res.data)
    return parsed
  },

  getById: async (id: string): Promise<EquipmentResponse> => {
    const res = await api.get(`/api/Equipments/${id}`)
    const parsed = EquipmentResponseSchema.parse(res.data)
    return parsed
  },

  create: async (body: CreateEquipmentRequest) => {
    CreateEquipmentSchema.parse(body)
    const res = await api.post('/api/Equipments', body)
    const id = extractIdFromLocation(res.headers['location'] as string | undefined)
    return { id }
  },

  update: async (id: string, body: UpdateEquipmentRequest) => {
    UpdateEquipmentSchema.parse(body)
    await api.put(`/api/Equipments/${id}`, body)
  },

  delete: async (id: string) => {
    await api.delete(`/api/Equipments/${id}`)
  }
}