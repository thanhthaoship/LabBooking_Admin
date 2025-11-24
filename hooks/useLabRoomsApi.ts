"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { labRoomsService, labRoomKeys } from "@/lib/api/services/labRooms";
import { CreateLabRoomRequest, UpdateLabRoomRequest } from "@/lib/zod/labRooms";

export function useLabRoomsList(filters: {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection: "Ascending" | "Descending";
}) {
  return useQuery({
    queryKey: labRoomKeys.list(filters),
    queryFn: () => labRoomsService.getAll(filters),
    keepPreviousData: true,
  });
}

export function useLabRoom(id: string) {
  return useQuery({
    queryKey: labRoomKeys.detail(id),
    queryFn: () => labRoomsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLabRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateLabRoomRequest) => labRoomsService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: labRoomKeys.all }),
  });
}

export function useUpdateLabRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateLabRoomRequest }) =>
      labRoomsService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: labRoomKeys.all }),
  });
}

export function useDeleteLabRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => labRoomsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: labRoomKeys.all }),
  });
}
