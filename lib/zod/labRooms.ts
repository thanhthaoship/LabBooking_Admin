import { z } from 'zod'
import { PagedResultSchema } from './pagedResult'
import { EquipmentResponseSchema } from './equipments'

export const LabRoomResponseSchema = z.object({
  id: z.string().uuid(),
  labName: z.string().nullable(),
  location: z.string().nullable(),
  maximumLimit: z.number().int().nullable(),
  mainManagerId: z.string().uuid().nullable(),
  createdById: z.string().uuid().nullable(),
  createdDate: z.string(),
  isActive: z.boolean(),
  equipments: z.array(EquipmentResponseSchema).nullable()
})

export const GetAllLabRoomsResponseSchema = PagedResultSchema(LabRoomResponseSchema)

export const CreateLabRoomSchema = z.object({
  labName: z.string().min(1),
  location: z.string().optional(),
  maximumLimit: z.number().int().positive().optional(),
  mainManagerId: z.string().uuid().optional()
})

export const UpdateLabRoomSchema = z.object({
  labName: z.string().min(1),
  location: z.string().optional(),
  maximumLimit: z.number().int().positive().optional(),
  mainManagerId: z.string().uuid().optional(),
  isActive: z.boolean()
})

export type LabRoomResponse = z.infer<typeof LabRoomResponseSchema>
export type CreateLabRoomRequest = z.infer<typeof CreateLabRoomSchema>
export type UpdateLabRoomRequest = z.infer<typeof UpdateLabRoomSchema>