import apiService from "@/lib/api/core";
import { deleteCookie } from 'cookies-next';

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiService.post('/auth/login', credentials);
  return response.data as AuthResponse;
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await apiService.get('/auth/me');
  return response.data as User | null;
}
export async function logout(): Promise<void> {
  deleteCookie('auth-token', { path: '/' });
}