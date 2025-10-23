import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/api/services/fetchBooking';

// Query keys
const BOOKING_QUERY_KEY = 'bookings';

export function useLabBookings(labId: string) {
  return useQuery({
    queryKey: [BOOKING_QUERY_KEY, 'lab', labId],
    queryFn: () => bookingService.getLabBookings(labId),
    enabled: !!labId,
    select: (data) => data.data,
  });
}

export function useDeviceBookings(deviceId: string) {
  return useQuery({
    queryKey: [BOOKING_QUERY_KEY, 'device', deviceId],
    queryFn: () => bookingService.getDeviceBookings(deviceId),
    enabled: !!deviceId,
    select: (data) => data.data,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: [BOOKING_QUERY_KEY, 'all'],
    queryFn: () => bookingService.getAllBookings(),
    select: (data) => data.data,
  });
}
