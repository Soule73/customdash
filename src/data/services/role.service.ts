import { httpClient } from './http.client';
import type { Role, Permission, CreateRoleData, UpdateRoleData } from '@type/role.types';

export const roleService = {
  async getAll(): Promise<Role[]> {
    return httpClient.get<Role[]>('/roles');
  },

  async getById(id: string): Promise<Role> {
    return httpClient.get<Role>(`/roles/${id}`);
  },

  async create(data: CreateRoleData): Promise<Role> {
    return httpClient.post<Role>('/roles', data);
  },

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    return httpClient.put<Role>(`/roles/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/roles/${id}`);
  },

  async getAllPermissions(): Promise<Permission[]> {
    return httpClient.get<Permission[]>('/permissions');
  },
};
