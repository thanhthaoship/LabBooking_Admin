import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { securityService, SecuritySystem, CreateSecurityRequest, UpdateSecurityRequest } from '@/lib/api/services/fetchSecurity';

// Query keys
export const securityKeys = {
  all: ['security'] as const,
  lists: () => [...securityKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...securityKeys.lists(), { filters }] as const,
  details: () => [...securityKeys.all, 'detail'] as const,
  detail: (id: string) => [...securityKeys.details(), id] as const,
};

// Get all security systems
export function useSecuritySystems() {
  return useQuery({
    queryKey: securityKeys.lists(),
    queryFn: securityService.getAllSecuritySystems,
    select: (data) => ({
      securitySystems: data.data,
      total: data.data.length,
      active: data.data.filter(s => s.status === 'active').length,
      inactive: data.data.filter(s => s.status === 'inactive').length,
      warning: data.data.filter(s => s.status === 'warning').length,
      offline: data.data.filter(s => s.status === 'offline').length,
    }),
  });
}

// Get security system by ID
export function useSecuritySystem(id: string) {
  return useQuery({
    queryKey: securityKeys.detail(id),
    queryFn: () => securityService.getSecuritySystemById(id),
    enabled: !!id,
  });
}

// Search security systems
export function useSearchSecuritySystems(query: string) {
  return useQuery({
    queryKey: securityKeys.list({ search: query }),
    queryFn: () => securityService.searchSecuritySystems(query),
    enabled: !!query,
    select: (data) => data.data,
  });
}

// Get security systems by status
export function useSecuritySystemsByStatus(status: string) {
  return useQuery({
    queryKey: securityKeys.list({ status }),
    queryFn: () => securityService.getSecuritySystemsByStatus(status),
    enabled: !!status,
    select: (data) => data.data,
  });
}

// Get security systems by type
export function useSecuritySystemsByType(type: string) {
  return useQuery({
    queryKey: securityKeys.list({ type }),
    queryFn: () => securityService.getSecuritySystemsByType(type),
    enabled: !!type,
    select: (data) => data.data,
  });
}

// Create security system
export function useCreateSecuritySystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSecurityRequest) => securityService.createSecuritySystem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.lists() });
      toast.success('Hệ thống an ninh đã được tạo thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo hệ thống an ninh');
    },
  });
}

// Update security system
export function useUpdateSecuritySystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSecurityRequest }) =>
      securityService.updateSecuritySystem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: securityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: securityKeys.detail(id) });
      toast.success('Hệ thống an ninh đã được cập nhật thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật hệ thống an ninh');
    },
  });
}

// Delete security system
export function useDeleteSecuritySystem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => securityService.deleteSecuritySystem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: securityKeys.lists() });
      toast.success('Hệ thống an ninh đã được xóa thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa hệ thống an ninh');
    },
  });
}

// Update security system status
export function useUpdateSecuritySystemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      securityService.updateSecuritySystemStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: securityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: securityKeys.detail(id) });
      toast.success('Trạng thái hệ thống an ninh đã được cập nhật thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái hệ thống an ninh');
    },
  });
}

// Schedule maintenance
export function useScheduleMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      securityService.updateSecuritySystemStatus(id, 'active'),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: securityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: securityKeys.detail(id) });
      toast.success('Trạng thái hệ thống an ninh đã được cập nhật thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái hệ thống an ninh');
    },
  });
}
