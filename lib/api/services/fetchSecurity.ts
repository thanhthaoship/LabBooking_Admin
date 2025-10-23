import apiService from '@/lib/api/core';
import { mockApiService } from '@/lib/api/mock/mockApiService';

export interface SecuritySystem {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'warning' | 'offline';
  type: string;
  description: string;
  department: string;
  contact: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface SecurityResponse {
  code: string;
  status: boolean;
  message?: string;
  data: SecuritySystem[];
}

export interface SecurityDetailResponse {
  code: string;
  status: boolean;
  message?: string;
  data: SecuritySystem;
}

export interface CreateSecurityRequest {
  name: string;
  role: string;
  type: string;
  description: string;
  department: string;
  contact: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateSecurityRequest {
  name?: string;
  role?: string;
  type?: string;
  description?: string;
  department?: string;
  contact?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive' | 'warning' | 'offline';
}

export interface DeleteSecurityResponse {
  code: string;
  status: boolean;
  message?: string;
  data?: null;
}

// Security service with security-related API methods
export const securityService = {
  // Get all security systems
  getAllSecuritySystems: async (): Promise<SecurityResponse> => {
    // const response = await apiService.get<SecurityResponse>('/api/security');
    // return response.data as SecurityResponse;
    return await mockApiService.security.getAll() as unknown as SecurityResponse;
  },

  // Get security system by ID
  getSecuritySystemById: async (id: string): Promise<SecurityDetailResponse> => {
    // const response = await apiService.get<SecurityDetailResponse>(`/api/security/${id}`);
    // return response.data as SecurityDetailResponse;
    return await mockApiService.security.getById(id) as unknown as SecurityDetailResponse;
  },

  // Create new security system
  createSecuritySystem: async (securityData: CreateSecurityRequest): Promise<SecurityDetailResponse> => {
    // const response = await apiService.post<SecurityDetailResponse, CreateSecurityRequest>(
    //   '/api/security',
    //   securityData
    // );
    // return response.data as SecurityDetailResponse;
    return await mockApiService.security.create(securityData) as unknown as SecurityDetailResponse;
  },

  // Update security system
  updateSecuritySystem: async (id: string, securityData: UpdateSecurityRequest): Promise<SecurityDetailResponse> => {
    // const response = await apiService.put<SecurityDetailResponse, UpdateSecurityRequest>(
    //   `/api/security/${id}`,
    //   securityData
    // );
    // return response.data as SecurityDetailResponse;
    return await mockApiService.security.update(id, securityData) as unknown as SecurityDetailResponse;
  },

  // Delete security system
  deleteSecuritySystem: async (id: string): Promise<DeleteSecurityResponse> => {
    // const response = await apiService.delete<DeleteSecurityResponse>(`/api/security/${id}`);
    // return response.data as DeleteSecurityResponse;
    return await mockApiService.security.delete(id) as unknown as DeleteSecurityResponse;
  },

  // Search security systems
  searchSecuritySystems: async (query: string): Promise<SecurityResponse> => {
    // const response = await apiService.get<SecurityResponse>(`/api/security/search?q=${encodeURIComponent(query)}`);
    // return response.data as SecurityResponse;
    return await mockApiService.security.search(query) as unknown as SecurityResponse;
  },

  // Get security systems by status
  getSecuritySystemsByStatus: async (status: string): Promise<SecurityResponse> => {
    // const response = await apiService.get<SecurityResponse>(`/api/security?status=${status}`);
    // return response.data as SecurityResponse;
    return await mockApiService.security.getByStatus(status) as unknown as SecurityResponse;
  },

  // Get security systems by type
  getSecuritySystemsByType: async (type: string): Promise<SecurityResponse> => {
    // const response = await apiService.get<SecurityResponse>(`/api/security?type=${type}`);
    // return response.data as SecurityResponse;
    return await mockApiService.security.getByType(type) as unknown as SecurityResponse;
  },

  // Update security system status
  updateSecuritySystemStatus: async (id: string, status: string): Promise<SecurityDetailResponse> => {
    // const response = await apiService.patch<SecurityDetailResponse, { status: string }>(
    //   `/api/security/${id}/status`,
    //   { status }
    // );
    // return response.data as SecurityDetailResponse;
    return await mockApiService.security.updateStatus(id, status) as unknown as SecurityDetailResponse;
  },

  // Update security system status
  updateSecurityStatus: async (id: string, status: string): Promise<SecurityDetailResponse> => {
    return await mockApiService.security.updateStatus(id, status) as unknown as SecurityDetailResponse;
  },

  scheduleMaintenance: async (id: string, maintenanceDate: string): Promise<SecurityDetailResponse> => {
    // const response = await apiService.patch<SecurityDetailResponse, { status: string }>(
    //   `/api/security/${id}/status`,
    //   { status }
    // );
    // return response.data as SecurityDetailResponse;
    return await mockApiService.security.updateStatus(id, status) as unknown as SecurityDetailResponse;
  }
};

export default securityService;
