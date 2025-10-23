import apiService from '@/lib/api/core';
import { mockApiService } from '@/lib/api/mock/mockApiService';

export interface DeviceSpecifications {
  [key: string]: string | number | undefined;
}

export interface Device {
  id: string;
  name: string;
  code: string;
  ownedByLab: string;
  status: 'available' | 'in_use' | 'maintenance' | 'broken' | 'retired';
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  description: string;
  specifications: DeviceSpecifications;
  lastMaintenance: string;
  nextMaintenance: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceResponse {
  code: string;
  status: boolean;
  message?: string;
  data: Device[];
}

export interface DeviceDetailResponse {
  code: string;
  status: boolean;
  message?: string;
  data: Device;
}

export interface CreateDeviceRequest {
  name: string;
  code: string;
  ownedByLab: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  description: string;
  specifications: DeviceSpecifications;
}

export interface UpdateDeviceRequest {
  name?: string;
  code?: string;
  ownedByLab?: string;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  location?: string;
  description?: string;
  specifications?: DeviceSpecifications;
  status?: 'available' | 'in_use' | 'maintenance' | 'broken' | 'retired';
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface DeleteDeviceResponse {
  code: string;
  status: boolean;
  message?: string;
  data?: null;    
}

// Device service with device-related API methods
export const deviceService = {
  // Get all devices
  getAllDevices: async (): Promise<DeviceResponse> => {
    // const response = await apiService.get<DeviceResponse>('/api/devices');
    // return response.data as DeviceResponse;
    return await mockApiService.devices.getAll() as unknown as DeviceResponse;
  },

  // Get device by ID
  getDeviceById: async (id: string): Promise<DeviceDetailResponse> => {
    // const response = await apiService.get<DeviceDetailResponse>(`/api/devices/${id}`);
    // return response.data as DeviceDetailResponse;
    return await mockApiService.devices.getById(id) as unknown as DeviceDetailResponse;
  },

  // Create new device
  createDevice: async (deviceData: CreateDeviceRequest): Promise<DeviceDetailResponse> => {
    // const response = await apiService.post<DeviceDetailResponse, CreateDeviceRequest>(
    //   '/api/devices',
    //   deviceData
    // );
    // return response.data as DeviceDetailResponse;
    return await mockApiService.devices.create(deviceData) as unknown as DeviceDetailResponse;
  },

  // Update device
  updateDevice: async (id: string, deviceData: UpdateDeviceRequest): Promise<DeviceDetailResponse> => {
    // const response = await apiService.put<DeviceDetailResponse, UpdateDeviceRequest>(
    //   `/api/devices/${id}`,
    //   deviceData
    // );
    // return response.data as DeviceDetailResponse;
    return await mockApiService.devices.update(id, deviceData) as unknown as DeviceDetailResponse;
  },

  // Delete device
  deleteDevice: async (id: string): Promise<DeleteDeviceResponse> => {
    // const response = await apiService.delete<DeleteDeviceResponse>(`/api/devices/${id}`);
    // return response.data as DeleteDeviceResponse;
    return await mockApiService.devices.delete(id) as unknown as DeleteDeviceResponse;
  },

  // Search devices
  searchDevices: async (query: string): Promise<DeviceResponse> => {
    // const response = await apiService.get<DeviceResponse>(`/api/devices/search?q=${encodeURIComponent(query)}`);
    // return response.data as DeviceResponse;
    const response = await apiService.get<DeviceResponse>(`/api/devices/search?q=${encodeURIComponent(query)}`);
    return response.data as DeviceResponse;
  },

  // Get devices by lab
  getDevicesByLab: async (labCode: string): Promise<DeviceResponse> => {
    // const response = await apiService.get<DeviceResponse>(`/api/devices?labCode=${labCode}`);
    // return response.data as DeviceResponse;
    return await mockApiService.devices.getByLab(labCode) as unknown as DeviceResponse;
  },

  // Get devices by status
  getDevicesByStatus: async (status: string): Promise<DeviceResponse> => {
    // const response = await apiService.get<DeviceResponse>(`/api/devices?status=${status}`);
    // return response.data as DeviceResponse;
    return await mockApiService.devices.getByStatus(status) as unknown as DeviceResponse;
  },

  // Get devices by type
  getDevicesByType: async (type: string): Promise<DeviceResponse> => {
    // const response = await apiService.get<DeviceResponse>(`/api/devices?type=${type}`);
    // return response.data as DeviceResponse;
    return await mockApiService.devices.getByType(type) as unknown as DeviceResponse;
  },

  // Update device status
  updateDeviceStatus: async (id: string, status: string): Promise<DeviceDetailResponse> => {
    // const response = await apiService.patch<DeviceDetailResponse, { status: string }>(
    //   `/api/devices/${id}/status`,
    //   { status }
    // );
    // return response.data as DeviceDetailResponse;
    return await mockApiService.devices.updateStatus(id, status) as unknown as DeviceDetailResponse;
  },

  // Schedule maintenance
  scheduleMaintenance: async (id: string, maintenanceDate: string): Promise<DeviceDetailResponse> => {
    // const response = await apiService.patch<DeviceDetailResponse, { nextMaintenance: string }>(
    //   `/api/devices/${id}/maintenance`,
    //   { nextMaintenance: maintenanceDate }
    // );
    // return response.data as DeviceDetailResponse;
    return await mockApiService.devices.scheduleMaintenance(id, maintenanceDate) as unknown as DeviceDetailResponse;
  }
};

export default deviceService;
