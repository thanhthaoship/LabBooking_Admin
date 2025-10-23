import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import deviceService, {
  Device,
  DeviceResponse,
  DeviceDetailResponse,
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from '@/lib/api/services/fetchDevice';
import { toast } from 'sonner';

const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...deviceKeys.lists(), { filters }] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
  search: (query: string) => [...deviceKeys.all, 'search', query] as const,
  byLab: (labCode: string) => [...deviceKeys.all, 'byLab', labCode] as const,
};

/**
 * Hook to fetch all devices
 */
export function useDevices(filters?: { status?: string; type?: string; labCode?: string }) {
  return useQuery({
    queryKey: deviceKeys.list(filters || {}),
    queryFn: async () => {
      let response: DeviceResponse;
      if (filters?.labCode) {
        response = await deviceService.getDevicesByLab(filters.labCode);
      } else if (filters?.status) {
        response = await deviceService.getDevicesByStatus(filters.status);
      } else if (filters?.type) {
        response = await deviceService.getDevicesByType(filters.type);
      } else {
        response = await deviceService.getAllDevices();
      }
      return response.data;
    },
    select: (data: Device[]) => ({
      devices: data,
      total: data.length,
      available: data.filter(device => device.status === 'available').length,
      inUse: data.filter(device => device.status === 'in_use').length,
      maintenance: data.filter(device => device.status === 'maintenance').length,
      broken: data.filter(device => device.status === 'broken').length,
      retired: data.filter(device => device.status === 'retired').length,
    }),
  });
}

/**
 * Hook to fetch device by ID
 */
export function useDevice(id: string) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: async () => {
      const response = await deviceService.getDeviceById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to fetch devices by lab
 */
export function useDevicesByLab(labCode: string) {
  return useQuery({
    queryKey: deviceKeys.byLab(labCode),
    queryFn: async () => {
      const response = await deviceService.getDevicesByLab(labCode);
      return response.data;
    },
    enabled: !!labCode,
  });
}

/**
 * Hook to search devices
 */
export function useSearchDevices(query: string) {
  return useQuery({
    queryKey: deviceKeys.search(query),
    queryFn: async () => {
      const response = await deviceService.searchDevices(query);
      return response.data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new device
 */
export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceData: CreateDeviceRequest) => deviceService.createDevice(deviceData),
    onSuccess: (data: DeviceDetailResponse) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
        toast.success('Tạo thiết bị thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi tạo thiết bị');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo thiết bị');
    },
  });
}

/**
 * Hook to update device
 */
export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceRequest }) =>
      deviceService.updateDevice(id, data),
    onSuccess: (data: DeviceDetailResponse, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: deviceKeys.detail(variables.id) });
        toast.success('Cập nhật thiết bị thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật thiết bị');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thiết bị');
    },
  });
}

/**
 * Hook to delete device
 */
export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deviceService.deleteDevice(id),
    onSuccess: (data, id) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
        queryClient.removeQueries({ queryKey: deviceKeys.detail(id) });
        toast.success('Xóa thiết bị thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi xóa thiết bị');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa thiết bị');
    },
  });
}

/**
 * Hook to update device status
 */
export function useUpdateDeviceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      deviceService.updateDeviceStatus(id, status),
    onSuccess: (data: DeviceDetailResponse, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: deviceKeys.detail(variables.id) });
        toast.success('Cập nhật trạng thái thiết bị thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật trạng thái thiết bị');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái thiết bị');
    },
  });
}

/**
 * Hook to schedule maintenance
 */
export function useScheduleMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, maintenanceDate }: { id: string; maintenanceDate: string }) =>
      deviceService.scheduleMaintenance(id, maintenanceDate),
    onSuccess: (data: DeviceDetailResponse, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
        queryClient.invalidateQueries({ queryKey: deviceKeys.detail(variables.id) });
        toast.success('Lên lịch bảo trì thiết bị thành công');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi lên lịch bảo trì thiết bị');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi lên lịch bảo trì thiết bị');
    },
  });
}
