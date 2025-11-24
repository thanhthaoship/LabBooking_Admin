import { z } from 'zod'
import { PagedResultSchema } from './pagedResult'

export const EquipmentStatusEnum = z.enum(['Maintain', 'Available', 'Broken', 'Other'])

export const EquipmentResponseSchema = z.object({
  id: z.string().uuid(),
  equipmentName: z.string(),
  description: z.string().nullable(),
  isAvailable: z.boolean(),
  labRoomId: z.string().uuid(),
  status: EquipmentStatusEnum
})

export const GetAllEquipmentsResponseSchema = PagedResultSchema(EquipmentResponseSchema)

export const CreateEquipmentSchema = z.object({
  equipmentName: z.string().min(1),
  description: z.string().optional(),
  labRoomId: z.string().uuid()
})

export const UpdateEquipmentSchema = z.object({
  equipmentName: z.string().min(1),
  description: z.string().optional(),
  isAvailable: z.boolean(),
  labRoomId: z.string().uuid(),
  status: EquipmentStatusEnum
})

export type EquipmentResponse = z.infer<typeof EquipmentResponseSchema>
export type CreateEquipmentRequest = z.infer<typeof CreateEquipmentSchema>
export type UpdateEquipmentRequest = z.infer<typeof UpdateEquipmentSchema>