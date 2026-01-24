import { httpClient } from './http.client';
import type {
  Dashboard,
  CreateDashboardData,
  UpdateDashboardData,
  LayoutItem,
} from '@type/dashboard.types';

export const dashboardService = {
  async getAll(): Promise<Dashboard[]> {
    return httpClient.get<Dashboard[]>('/dashboards');
  },

  async getById(id: string): Promise<Dashboard> {
    return httpClient.get<Dashboard>(`/dashboards/${id}`);
  },

  async create(data: CreateDashboardData): Promise<Dashboard> {
    return httpClient.post<Dashboard>('/dashboards', data);
  },

  async update(id: string, data: UpdateDashboardData): Promise<Dashboard> {
    return httpClient.put<Dashboard>(`/dashboards/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/dashboards/${id}`);
  },

  async share(id: string, shareEnabled: boolean): Promise<Dashboard> {
    return httpClient.patch<Dashboard>(`/dashboards/${id}/share`, { shareEnabled });
  },

  async updateLayout(id: string, layout: LayoutItem[]): Promise<Dashboard> {
    return httpClient.put<Dashboard>(`/dashboards/${id}`, { layout });
  },
};
