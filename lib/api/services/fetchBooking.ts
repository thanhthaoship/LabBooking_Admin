import { mockApiService } from '@/lib/api/mock/mockApiService';

export interface Booking {
  id: string;
  labId?: string;
  deviceId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  startTime: string;
  endTime: string;
  date: string;
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'in_use' | 'scheduled' | 'completed';
  createdAt: string;
}

export interface BookingResponse {
  code: string;
  status: boolean;
  message?: string;
  data: Booking[];
}

export const bookingService = {
  getAllBookings: async (): Promise<BookingResponse> => {
    return await mockApiService.bookings.getAllBookings() as unknown as BookingResponse;
  },

  getLabBookings: async (labId: string): Promise<BookingResponse> => {
    return await mockApiService.bookings.getLabBookings(labId) as unknown as BookingResponse;
  },

  getDeviceBookings: async (deviceId: string): Promise<BookingResponse> => {
    return await mockApiService.bookings.getDeviceBookings(deviceId) as unknown as BookingResponse;
  }
};

export default bookingService;
