'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { login, logout, getCurrentUser } from '@/lib/api/services/fetchAuth'

export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Update the cache with the user data
      queryClient.setQueryData(queryKeys.auth.user, data.user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear the user data from cache
      queryClient.setQueryData(queryKeys.auth.user, null)
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
    },
  })
}
