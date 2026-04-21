/**
 * Processing Service Tests
 * @module data/services/processing.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processingService } from './processing.service';
import { httpClient } from './http.client';

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

  describe('detectColumns', () => {
    it('should detect columns from config', async () => {
      const mockResult = {
        columns: ['id', 'name', 'email'],
        types: { id: 'number', name: 'string', email: 'string' },
        preview: [{ id: 1, name: 'Alice', email: 'alice@example.com' }],
      };
      vi.mocked(httpClient.post).mockResolvedValue(mockResult);

      const config = { endpoint: 'https://api.example.com/data', type: 'json' as const };
      const result = await processingService.detectColumns(config);

      expect(httpClient.post).toHaveBeenCalledWith('/processing/detect-columns', config);
      expect(result).toEqual(mockResult);
    });

    it('should detect columns from CSV config', async () => {
      const mockResult = {
        columns: ['date', 'amount'],
        types: { date: 'date', amount: 'number' },
        preview: [],
      };
      vi.mocked(httpClient.post).mockResolvedValue(mockResult);

      const config = { filePath: '/uploads/data.csv', type: 'csv' as const };
      const result = await processingService.detectColumns(config);

      expect(httpClient.post).toHaveBeenCalledWith('/processing/detect-columns', config);
      expect(result).toEqual(mockResult);
    });
  });
});
