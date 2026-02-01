/**
 * Processing Service Tests
 * @module data/services/processing.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processingService } from './processing.service';
import { httpClient } from './http.client';

// Mock httpClient
vi.mock('./http.client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('processingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchData', () => {
    it('should fetch data without options', async () => {
      const mockResult = {
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        totalCount: 2,
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      const result = await processingService.fetchData('ds1');

      expect(httpClient.get).toHaveBeenCalledWith('/processing/datasources/ds1/data');
      expect(result).toEqual(mockResult);
    });

    it('should fetch data with options', async () => {
      const mockResult = { data: [], total: 0 };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      const options = { page: 1, pageSize: 10, from: '2025-01-01', to: '2025-12-31' };
      await processingService.fetchData('ds1', options);

      expect(httpClient.get).toHaveBeenCalledWith(
        '/processing/datasources/ds1/data?page=1&pageSize=10&from=2025-01-01&to=2025-12-31',
      );
    });

    it('should handle empty options', async () => {
      const mockResult = { data: [], totalCount: 0 };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      await processingService.fetchData('ds1', {});

      expect(httpClient.get).toHaveBeenCalledWith('/processing/datasources/ds1/data');
    });
  });

  describe('aggregate', () => {
    it('should aggregate data with config', async () => {
      const mockData = [
        { category: 'A', total: 100 },
        { category: 'B', total: 200 },
      ];
      vi.mocked(httpClient.post).mockResolvedValue({ data: mockData });

      const config = {
        metrics: [{ field: 'amount', aggregation: 'sum' as const, type: 'sum' as const }],
        bucket: { field: 'category', type: 'terms' as const },
      };
      const result = await processingService.aggregate('ds1', config);

      expect(httpClient.post).toHaveBeenCalledWith('/processing/datasources/ds1/aggregate', config);
      expect(result).toEqual(mockData);
    });

    it('should return empty array when no data', async () => {
      vi.mocked(httpClient.post).mockResolvedValue({ data: undefined });

      const config = {
        metrics: [{ field: 'amount', aggregation: 'sum' as const, type: 'sum' as const }],
      };
      const result = await processingService.aggregate('ds1', config);

      expect(result).toEqual([]);
    });

    it('should handle multiple metrics', async () => {
      const mockData = [{ sum_amount: 1000, avg_price: 50 }];
      vi.mocked(httpClient.post).mockResolvedValue({ data: mockData });

      const config = {
        metrics: [
          { field: 'amount', aggregation: 'sum' as const, type: 'sum' as const },
          { field: 'price', aggregation: 'avg' as const, type: 'avg' as const },
        ],
      };
      const result = await processingService.aggregate('ds1', config);

      expect(result).toEqual(mockData);
    });
  });

  describe('detectColumns', () => {
    it('should detect columns from config', async () => {
      const mockResult = {
        columns: [
          { name: 'id', type: 'number', nullable: false },
          { name: 'name', type: 'string', nullable: false },
          { name: 'email', type: 'string', nullable: true },
        ],
      };
      vi.mocked(httpClient.post).mockResolvedValue(mockResult);

      const config = { endpoint: 'https://api.example.com/data', type: 'json' as const };
      const result = await processingService.detectColumns(config);

      expect(httpClient.post).toHaveBeenCalledWith('/processing/detect-columns', config);
      expect(result).toEqual(mockResult);
    });
  });

  describe('analyzeSchema', () => {
    it('should analyze schema without options', async () => {
      const mockResult = {
        columns: [{ name: 'id', type: 'number' }],
        rowCount: 100,
        sampleData: [],
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      const result = await processingService.analyzeSchema('ds1');

      expect(httpClient.get).toHaveBeenCalledWith('/processing/datasources/ds1/schema');
      expect(result).toEqual(mockResult);
    });

    it('should analyze schema with options', async () => {
      const mockResult = {
        columns: [],
        rowCount: 0,
        sampleData: [],
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      const options = { sampleSize: 50 };
      await processingService.analyzeSchema('ds1', options);

      expect(httpClient.get).toHaveBeenCalledWith(
        '/processing/datasources/ds1/schema?sampleSize=50',
      );
    });
  });

  describe('quickAnalyze', () => {
    it('should perform quick schema analysis', async () => {
      const mockResult = {
        columnCount: 5,
        rowCount: 100,
        columnTypes: ['string', 'number', 'date', 'boolean', 'string'],
      };
      vi.mocked(httpClient.get).mockResolvedValue(mockResult);

      const result = await processingService.quickAnalyze('ds1');

      expect(httpClient.get).toHaveBeenCalledWith('/processing/datasources/ds1/quick-schema');
      expect(result).toEqual(mockResult);
    });
  });
});
