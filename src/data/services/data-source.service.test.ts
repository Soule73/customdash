/**
 * DataSource Service Tests
 * @module data/services/data-source.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dataSourceService } from './data-source.service';
import { httpClient } from './http.client';

// Mock httpClient
vi.mock('./http.client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('dataSourceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all data sources', async () => {
      const mockDataSources = [
        { id: '1', name: 'API Source', type: 'json' },
        { id: '2', name: 'CSV Source', type: 'csv' },
      ];
      vi.mocked(httpClient.get).mockResolvedValue(mockDataSources);

      const result = await dataSourceService.getAll();

      expect(httpClient.get).toHaveBeenCalledWith('/datasources');
      expect(result).toEqual(mockDataSources);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no data sources exist', async () => {
      vi.mocked(httpClient.get).mockResolvedValue([]);

      const result = await dataSourceService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch data source by id', async () => {
      const mockDataSource = {
        id: '1',
        name: 'API Source',
        type: 'json',
        endpoint: 'https://api.example.com/data',
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockDataSource);

      const result = await dataSourceService.getById('1');

      expect(httpClient.get).toHaveBeenCalledWith('/datasources/1');
      expect(result).toEqual(mockDataSource);
    });

    it('should throw error when data source not found', async () => {
      const error = new Error('Data source not found');
      vi.mocked(httpClient.get).mockRejectedValue(error);

      await expect(dataSourceService.getById('invalid')).rejects.toThrow('Data source not found');
    });
  });

  describe('create', () => {
    it('should create a new JSON data source', async () => {
      const createData = {
        name: 'New API',
        type: 'json' as const,
        endpoint: 'https://api.example.com',
      };
      const mockDataSource = { id: '3', ...createData };
      vi.mocked(httpClient.post).mockResolvedValue(mockDataSource);

      const result = await dataSourceService.create(createData);

      expect(httpClient.post).toHaveBeenCalledWith('/datasources', createData);
      expect(result).toEqual(mockDataSource);
    });

    it('should create a new CSV data source', async () => {
      const createData = {
        name: 'CSV File',
        type: 'csv' as const,
        filePath: '/uploads/data.csv',
      };
      const mockDataSource = { id: '4', ...createData };
      vi.mocked(httpClient.post).mockResolvedValue(mockDataSource);

      const result = await dataSourceService.create(createData);

      expect(httpClient.post).toHaveBeenCalledWith('/datasources', createData);
      expect(result.type).toBe('csv');
    });

    it('should throw error on invalid data', async () => {
      const error = new Error('Validation error');
      vi.mocked(httpClient.post).mockRejectedValue(error);

      await expect(dataSourceService.create({ name: '', type: 'json' })).rejects.toThrow(
        'Validation error',
      );
    });
  });

  describe('update', () => {
    it('should update an existing data source', async () => {
      const updateData = { name: 'Updated Source' };
      const mockDataSource = { id: '1', name: 'Updated Source', type: 'json' };
      vi.mocked(httpClient.put).mockResolvedValue(mockDataSource);

      const result = await dataSourceService.update('1', updateData);

      expect(httpClient.put).toHaveBeenCalledWith('/datasources/1', updateData);
      expect(result).toEqual(mockDataSource);
    });
  });

  describe('delete', () => {
    it('should delete a data source', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(undefined);

      await dataSourceService.delete('1');

      expect(httpClient.delete).toHaveBeenCalledWith('/datasources/1');
    });

    it('should throw error when data source is used by widgets', async () => {
      const error = new Error('Data source is used by widgets');
      vi.mocked(httpClient.delete).mockRejectedValue(error);

      await expect(dataSourceService.delete('used-ds')).rejects.toThrow(
        'Data source is used by widgets',
      );
    });
  });
});
