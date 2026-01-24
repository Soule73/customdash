import { httpClient } from './http.client';
import type {
  DataSource,
  CreateDataSourceData,
  UpdateDataSourceData,
} from '@type/datasource.types';

export const dataSourceService = {
  async getAll(): Promise<DataSource[]> {
    return httpClient.get<DataSource[]>('/datasources');
  },

  async getById(id: string): Promise<DataSource> {
    return httpClient.get<DataSource>(`/datasources/${id}`);
  },

  async create(data: CreateDataSourceData): Promise<DataSource> {
    return httpClient.post<DataSource>('/datasources', data);
  },

  async update(id: string, data: UpdateDataSourceData): Promise<DataSource> {
    return httpClient.put<DataSource>(`/datasources/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/datasources/${id}`);
  },

  async uploadCsv(file: File, name?: string): Promise<DataSource> {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }
    return httpClient.postFormData<DataSource>('/datasources/upload', formData);
  },
};
