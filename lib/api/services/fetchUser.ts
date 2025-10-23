import apiService from '@/lib/api/core';

export interface User {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
    status?: string;
    role: string;
    about?: string;
    birthdate: string;
    joinedAt: string;
}

export interface UserResponse {
    code: string;
    status: boolean;
    message?: string;
    data: User;
}

export interface UserUpdateResponse {
    code: string;
    status: boolean;
    message?: string;
    data?: string;
}


// User service with profile-related API methods
export const userService = {
    // Get current user profile
    getUserProfile: async (): Promise<UserResponse> => {
        const response = await apiService.get<UserResponse>('/api/users/profile');
        return response.data;
    },

    // Update current user profile
    updateUserProfile: async (profileData: Partial<User>): Promise<UserUpdateResponse> => {
        const response = await apiService.put<UserUpdateResponse, Partial<User>>(
            '/api/users/update-profile',
            profileData
        );
        return response.data;
    },

    // Change password
    changePassword: async (passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<UserUpdateResponse> => {
        const response = await apiService.put<UserUpdateResponse, typeof passwordData>(
            '/api/users/change-password',
            passwordData
        );
        return response.data;
    },
}

export default userService;