import { httpClient } from './http.client';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@type/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<{ user: User; token: string }>(
      '/auth/login',
      credentials,
    );
    return {
      user: response.user,
      accessToken: response.token,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post<{ user: User; token: string }>('/auth/register', data);
    return {
      user: response.user,
      accessToken: response.token,
    };
  },

  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/profile');
  },

  async logout(): Promise<void> {
    // No server-side logout endpoint needed for JWT
  },
};
