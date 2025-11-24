'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { equipmentsService, equipmentKeys } from '@/lib/api/services/equipments'
import { CreateEquipmentRequest, UpdateEquipmentRequest } from '@/lib/zod/equipments'

export function useEquipmentsList(filters: {
  searchPhrase?: string
  pageNumber: number
  pageSize: number
  sortBy?: string
  sortDirection: 'Ascending' | 'Descending'
}) {
  return useQuery({
    queryKey: equipmentKeys.list(filters),
    queryFn: () => equipmentsService.getAll(filters),
    keepPreviousData: true
  })
}

export function useEquipment(id: string) {
  return useQuery({ queryKey: equipmentKeys.detail(id), queryFn: () => equipmentsService.getById(id), enabled: !!id })
}

export function useCreateEquipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateEquipmentRequest) => equipmentsService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all })
  })
}

export function useUpdateEquipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEquipmentRequest }) => equipmentsService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all })
  })
}

export function useDeleteEquipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => equipmentsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all })
  })
}