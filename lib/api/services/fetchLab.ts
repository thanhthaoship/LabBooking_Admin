import apiService from '@/lib/api/core';
import { mockApiService } from '@/lib/api/mock/mockApiService';

export interface LabManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface Lab {
  id: string;
  roomName: string;
  roomCode: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance' | 'closed';
  manager: LabManager;
  location: string;
  description: string;
  equipment: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LabResponse {
  code: string;
  status: boolean;
  message?: string;
  data: Lab[];
}

export interface LabDetailResponse {
  code: string;
  status: boolean;
  message?: string;
  data: Lab;
}

export interface CreateLabRequest {
  roomName: string;
  roomCode: string;
  capacity: number;
  managerId: string;
  location: string;
  description: string;
  equipment: string[];
}

export interface UpdateLabRequest {
  roomName?: string;
  roomCode?: string;
  capacity?: number;
  managerId?: string;
  location?: string;
  description?: string;
  equipment?: string[];
  status?: 'available' | 'occupied' | 'maintenance' | 'closed';
}

export interface DeleteLabResponse {
  code: string;
  status: boolean;
  message?: string;
  data?: string;    
}

// Lab service with lab-related API methods
export const labService = {
  // Get all labs
  getAllLabs: async (): Promise<LabResponse> => {
    // const response = await apiService.get<LabResponse>('/api/labs');
    // return response.data as LabResponse;
    return await mockApiService.labs.getAll() as unknown as LabResponse;
  },

  // Get lab by ID
  getLabById: async (id: string): Promise<LabDetailResponse> => {
    // const response = await apiService.get<LabDetailResponse>(`/api/labs/${id}`);
    // return response.data as LabDetailResponse;
    return await mockApiService.labs.getById(id) as unknown as LabDetailResponse;
  },

  // Create new lab
  createLab: async (labData: CreateLabRequest): Promise<LabDetailResponse> => {
    // const response = await apiService.post<LabDetailResponse, CreateLabRequest>(
    //   '/api/labs',
    //   labData
    // );
    // return response.data as LabDetailResponse;
    return await mockApiService.labs.create(labData) as unknown as LabDetailResponse;
  },

  // Update lab
  updateLab: async (id: string, labData: UpdateLabRequest): Promise<LabDetailResponse> => {
    // const response = await apiService.put<LabDetailResponse, UpdateLabRequest>(
    //   `/api/labs/${id}`,
    //   labData
    // );
    // return response.data as LabDetailResponse;
    return await mockApiService.labs.update(id, labData) as unknown as LabDetailResponse;
  },

  // Delete lab
  deleteLab: async (id: string): Promise<DeleteLabResponse> => {
    // const response = await apiService.delete<DeleteLabResponse>(`/api/labs/${id}`);
    // return response.data as DeleteLabResponse;
    return await mockApiService.labs.delete(id) as unknown as DeleteLabResponse;
  },

  // Search labs
  searchLabs: async (query: string): Promise<LabResponse> => {
    // const response = await apiService.get<LabResponse>(`/api/labs/search?q=${encodeURIComponent(query)}`);
    // return response.data as LabResponse;
    return await mockApiService.labs.search(query) as unknown as LabResponse;
  },

  // Get labs by status
  getLabsByStatus: async (status: string): Promise<LabResponse> => {
    // const response = await apiService.get<LabResponse>(`/api/labs?status=${status}`);
    // return response.data as LabResponse;
    return await mockApiService.labs.getByStatus(status) as unknown as LabResponse;
  },

  // Get labs by manager
  getLabsByManager: async (managerId: string): Promise<LabResponse> => {
    // const response = await apiService.get<LabResponse>(`/api/labs?managerId=${managerId}`);
    // return response.data as LabResponse;
    return await mockApiService.labs.getByManager(managerId) as unknown as LabResponse;
  }
};

export default labService;
