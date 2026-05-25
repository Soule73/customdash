import { httpClient } from './http.client';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@type/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/register', data);
  },

  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/profile');
  },

  async logout(): Promise<void> {
    await httpClient.post<void>('/auth/logout');
  },
};
