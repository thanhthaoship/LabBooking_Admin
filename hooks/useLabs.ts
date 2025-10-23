'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import labService, {
  Lab,
  LabResponse,
  LabDetailResponse,
  CreateLabRequest,
  UpdateLabRequest,
} from '@/lib/api/services/fetchLab';
import { toast } from 'sonner';

const labKeys = {
  all: ['labs'] as const,
  lists: () => [...labKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...labKeys.lists(), { filters }] as const,
  details: () => [...labKeys.all, 'detail'] as const,
  detail: (id: string) => [...labKeys.details(), id] as const,
  search: (query: string) => [...labKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch all labs
 */
export function useLabs(filters?: { status?: string; managerId?: string }) {
  return useQuery({
    queryKey: labKeys.list(filters || {}),
    queryFn: async () => {
      let response: LabResponse;
      if (filters?.status) {
        response = await labService.getLabsByStatus(filters.status);
      } else if (filters?.managerId) {
        response = await labService.getLabsByManager(filters.managerId);
      } else {
        response = await labService.getAllLabs();
      }
      return response.data;
    },
    select: (data: Lab[]) => ({
      labs: data,
      total: data.length,
      available: data.filter(lab => lab.status === 'available').length,
      occupied: data.filter(lab => lab.status === 'occupied').length,
      maintenance: data.filter(lab => lab.status === 'maintenance').length,
      closed: data.filter(lab => lab.status === 'closed').length,
    }),
  });
}

/**
 * Hook to fetch lab by ID
 */
export function useLab(id: string) {
  return useQuery({
    queryKey: labKeys.detail(id),
    queryFn: async () => {
      const response = await labService.getLabById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to search labs
 */
export function useSearchLabs(query: string) {
  return useQuery({
    queryKey: labKeys.search(query),
    queryFn: async () => {
      const response = await labService.searchLabs(query);
      return response.data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new lab
 */
export function useCreateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labData: CreateLabRequest) => labService.createLab(labData),
    onSuccess: (data: LabDetailResponse) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: labKeys.lists() });
        toast.success('Tạo phòng thí nghiệm thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi tạo phòng thí nghiệm');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo phòng thí nghiệm');
    },
  });
}

/**
 * Hook to update lab
 */
export function useUpdateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabRequest }) =>
      labService.updateLab(id, data),
    onSuccess: (data: LabDetailResponse, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: labKeys.lists() });
        queryClient.invalidateQueries({ queryKey: labKeys.detail(variables.id) });
        toast.success('Cập nhật phòng thí nghiệm thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật phòng thí nghiệm');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật phòng thí nghiệm');
    },
  });
}

/**
 * Hook to delete lab
 */
export function useDeleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => labService.deleteLab(id),
    onSuccess: (data, id) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: labKeys.lists() });
        queryClient.removeQueries({ queryKey: labKeys.detail(id) });
        toast.success('Xóa phòng thí nghiệm thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi xóa phòng thí nghiệm');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa phòng thí nghiệm');
    },
  });
}
