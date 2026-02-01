/**
 * Widget Service Tests
 * @module data/services/widget.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { widgetService } from './widget.service';
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

describe('widgetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all widgets without filter', async () => {
      const mockWidgets = [
        { id: '1', title: 'Widget 1', type: 'kpi' },
        { id: '2', title: 'Widget 2', type: 'bar' },
      ];
      vi.mocked(httpClient.get).mockResolvedValue(mockWidgets);

      const result = await widgetService.getAll();

      expect(httpClient.get).toHaveBeenCalledWith('/widgets');
      expect(result).toEqual(mockWidgets);
      expect(result).toHaveLength(2);
    });

    it('should fetch widgets filtered by dataSourceId', async () => {
      const mockWidgets = [{ id: '1', title: 'Widget 1', type: 'kpi', dataSourceId: 'ds1' }];
      vi.mocked(httpClient.get).mockResolvedValue(mockWidgets);

      const result = await widgetService.getAll('ds1');

      expect(httpClient.get).toHaveBeenCalledWith('/widgets?dataSourceId=ds1');
      expect(result).toEqual(mockWidgets);
    });

    it('should return empty array when no widgets exist', async () => {
      vi.mocked(httpClient.get).mockResolvedValue([]);

      const result = await widgetService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch widget by id', async () => {
      const mockWidget = { id: '1', title: 'Widget 1', type: 'kpi', config: {} };
      vi.mocked(httpClient.get).mockResolvedValue(mockWidget);

      const result = await widgetService.getById('1');

      expect(httpClient.get).toHaveBeenCalledWith('/widgets/1');
      expect(result).toEqual(mockWidget);
    });

    it('should throw error when widget not found', async () => {
      const error = new Error('Widget not found');
      vi.mocked(httpClient.get).mockRejectedValue(error);

      await expect(widgetService.getById('invalid')).rejects.toThrow('Widget not found');
    });
  });

  describe('create', () => {
    it('should create a new widget', async () => {
      const createData = {
        title: 'New Widget',
        type: 'kpi' as const,
        dataSourceId: 'ds1',
        config: { metrics: [] },
      };
      const mockWidget = { id: '3', ...createData };
      vi.mocked(httpClient.post).mockResolvedValue(mockWidget);

      const result = await widgetService.create(createData);

      expect(httpClient.post).toHaveBeenCalledWith('/widgets', createData);
      expect(result).toEqual(mockWidget);
    });

    it('should throw error on invalid data', async () => {
      const error = new Error('Validation error');
      vi.mocked(httpClient.post).mockRejectedValue(error);

      await expect(
        widgetService.create({ title: '', type: 'kpi', dataSourceId: '', config: {} }),
      ).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update an existing widget', async () => {
      const updateData = { title: 'Updated Widget' };
      const mockWidget = { id: '1', title: 'Updated Widget', type: 'kpi', config: {} };
      vi.mocked(httpClient.put).mockResolvedValue(mockWidget);

      const result = await widgetService.update('1', updateData);

      expect(httpClient.put).toHaveBeenCalledWith('/widgets/1', updateData);
      expect(result).toEqual(mockWidget);
    });

    it('should update widget config', async () => {
      const updateData = { config: { metrics: [{ field: 'sales', agg: 'sum' }] } };
      const mockWidget = { id: '1', title: 'Widget', type: 'kpi', ...updateData };
      vi.mocked(httpClient.put).mockResolvedValue(mockWidget);

      const result = await widgetService.update('1', updateData);

      expect(httpClient.put).toHaveBeenCalledWith('/widgets/1', updateData);
      expect(result.config).toEqual(updateData.config);
    });
  });

  describe('delete', () => {
    it('should delete a widget', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(undefined);

      await widgetService.delete('1');

      expect(httpClient.delete).toHaveBeenCalledWith('/widgets/1');
    });

    it('should throw error when widget not found', async () => {
      const error = new Error('Widget not found');
      vi.mocked(httpClient.delete).mockRejectedValue(error);

      await expect(widgetService.delete('invalid')).rejects.toThrow('Widget not found');
    });

    it('should throw error when widget is used in dashboards', async () => {
      const error = new Error('Widget is used in dashboards');
      vi.mocked(httpClient.delete).mockRejectedValue(error);

      await expect(widgetService.delete('used-widget')).rejects.toThrow(
        'Widget is used in dashboards',
      );
    });
  });
});
