import { httpClient } from './http.client';
import type { User, CreateUserData, UpdateUserData } from '@type/user.types';

export const userService = {
  async getAll(): Promise<User[]> {
    return httpClient.get<User[]>('/users');
  },

  async getById(id: string): Promise<User> {
    return httpClient.get<User>(`/users/${id}`);
  },

  async create(data: CreateUserData): Promise<User> {
    return httpClient.post<User>('/users', data);
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  },
};
