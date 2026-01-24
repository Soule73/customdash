import { httpClient } from './http.client';
import type { Widget, CreateWidgetData, UpdateWidgetData } from '@type/widget.types';

export const widgetService = {
  async getAll(dataSourceId?: string): Promise<Widget[]> {
    const url = dataSourceId ? `/widgets?dataSourceId=${dataSourceId}` : '/widgets';
    return httpClient.get<Widget[]>(url);
  },

  async getById(id: string): Promise<Widget> {
    return httpClient.get<Widget>(`/widgets/${id}`);
  },

  async create(data: CreateWidgetData): Promise<Widget> {
    return httpClient.post<Widget>('/widgets', data);
  },

  async update(id: string, data: UpdateWidgetData): Promise<Widget> {
    return httpClient.put<Widget>(`/widgets/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/widgets/${id}`);
  },
};
