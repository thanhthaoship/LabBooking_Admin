import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import userService, {
  User,
  UserResponse,
  UserUpdateResponse,
} from '@/lib/api/services/fetchUser';
import { toast } from 'sonner';

const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

/**
 * Hook to fetch current user's profile
 */
export function useUserProfile() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => userService.getUserProfile(),
    enabled: isAuthenticated,
    select: (data: UserResponse) => ({
      profile: data.data,
      status: data.status,
      message: data.message,
    }),
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<User>) => userService.updateUserProfile(profileData),
    onSuccess: (data: UserUpdateResponse) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => userService.changePassword(passwordData),
    onSuccess: (data: UserUpdateResponse) => {
      toast.success(data.message || 'Đổi mật khẩu thành công');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    },
  });
}


