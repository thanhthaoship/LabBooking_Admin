import { z } from 'zod'

export const PagedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalPages: z.number(),
    totalItemsCount: z.number(),
    itemsFrom: z.number(),
    itemsTo: z.number()
  })

export type PagedResult<T> = {
  items: T[]
  totalPages: number
  totalItemsCount: number
  itemsFrom: number
  itemsTo: number
}