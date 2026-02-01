/**
 * Dashboard Service Tests
 * @module data/services/dashboard.service.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from './dashboard.service';
import { httpClient } from './http.client';

// Mock httpClient
vi.mock('./http.client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all dashboards', async () => {
      const mockDashboards = [
        { id: '1', title: 'Dashboard 1', layout: [] },
        { id: '2', title: 'Dashboard 2', layout: [] },
      ];
      vi.mocked(httpClient.get).mockResolvedValue(mockDashboards);

      const result = await dashboardService.getAll();

      expect(httpClient.get).toHaveBeenCalledWith('/dashboards');
      expect(result).toEqual(mockDashboards);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no dashboards exist', async () => {
      vi.mocked(httpClient.get).mockResolvedValue([]);

      const result = await dashboardService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch dashboard by id', async () => {
      const mockDashboard = { id: '1', title: 'Dashboard 1', layout: [] };
      vi.mocked(httpClient.get).mockResolvedValue(mockDashboard);

      const result = await dashboardService.getById('1');

      expect(httpClient.get).toHaveBeenCalledWith('/dashboards/1');
      expect(result).toEqual(mockDashboard);
    });

    it('should throw error when dashboard not found', async () => {
      const error = new Error('Dashboard not found');
      vi.mocked(httpClient.get).mockRejectedValue(error);

      await expect(dashboardService.getById('invalid')).rejects.toThrow('Dashboard not found');
    });
  });

  describe('create', () => {
    it('should create a new dashboard', async () => {
      const createData = { title: 'New Dashboard', description: 'Test' };
      const mockDashboard = { id: '3', ...createData, layout: [] };
      vi.mocked(httpClient.post).mockResolvedValue(mockDashboard);

      const result = await dashboardService.create(createData);

      expect(httpClient.post).toHaveBeenCalledWith('/dashboards', createData);
      expect(result).toEqual(mockDashboard);
    });

    it('should throw error on invalid data', async () => {
      const error = new Error('Validation error');
      vi.mocked(httpClient.post).mockRejectedValue(error);

      await expect(dashboardService.create({ title: '' })).rejects.toThrow('Validation error');
    });
  });

  describe('update', () => {
    it('should update an existing dashboard', async () => {
      const updateData = { title: 'Updated Dashboard' };
      const mockDashboard = { id: '1', title: 'Updated Dashboard', layout: [] };
      vi.mocked(httpClient.put).mockResolvedValue(mockDashboard);

      const result = await dashboardService.update('1', updateData);

      expect(httpClient.put).toHaveBeenCalledWith('/dashboards/1', updateData);
      expect(result).toEqual(mockDashboard);
    });
  });

  describe('delete', () => {
    it('should delete a dashboard', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(undefined);

      await dashboardService.delete('1');

      expect(httpClient.delete).toHaveBeenCalledWith('/dashboards/1');
    });

    it('should throw error when dashboard not found', async () => {
      const error = new Error('Dashboard not found');
      vi.mocked(httpClient.delete).mockRejectedValue(error);

      await expect(dashboardService.delete('invalid')).rejects.toThrow('Dashboard not found');
    });
  });

  describe('share', () => {
    it('should enable sharing for a dashboard', async () => {
      const mockDashboard = {
        id: '1',
        title: 'Dashboard 1',
        visibility: 'public' as const,
        sharedWith: [],
      };
      vi.mocked(httpClient.patch).mockResolvedValue(mockDashboard);

      const result = await dashboardService.share('1', true);

      expect(httpClient.patch).toHaveBeenCalledWith('/dashboards/1/share', { shareEnabled: true });
      expect(result.visibility).toBe('public');
    });

    it('should disable sharing for a dashboard', async () => {
      const mockDashboard = {
        id: '1',
        title: 'Dashboard 1',
        visibility: 'private' as const,
        sharedWith: [],
      };
      vi.mocked(httpClient.patch).mockResolvedValue(mockDashboard);

      const result = await dashboardService.share('1', false);

      expect(httpClient.patch).toHaveBeenCalledWith('/dashboards/1/share', { shareEnabled: false });
      expect(result.visibility).toBe('private');
    });
  });

  describe('updateLayout', () => {
    it('should update dashboard layout', async () => {
      const newLayout = [
        { i: 'widget-1', x: 0, y: 0, w: 4, h: 2, widgetId: 'w1' },
        { i: 'widget-2', x: 4, y: 0, w: 4, h: 2, widgetId: 'w2' },
      ];
      const mockDashboard = { id: '1', title: 'Dashboard 1', layout: newLayout };
      vi.mocked(httpClient.put).mockResolvedValue(mockDashboard);

      const result = await dashboardService.updateLayout('1', newLayout);

      expect(httpClient.put).toHaveBeenCalledWith('/dashboards/1', { layout: newLayout });
      expect(result.layout).toEqual(newLayout);
    });
  });
});
