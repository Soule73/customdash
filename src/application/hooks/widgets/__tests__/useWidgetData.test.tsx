/**
 * useWidgetData Hook Tests
 * @module application/hooks/widgets/__tests__/useWidgetData.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useWidgetData } from '../useWidgetData';
import { dataSourceService } from '@services/data-source.service';
import { widgetFormService } from '@core/widgets';
import type { Widget } from '@type/widget.types';

// Mock services
vi.mock('@services/data-source.service', () => ({
  dataSourceService: {
    getData: vi.fn(),
  },
}));

vi.mock('@core/widgets', () => ({
  widgetFormService: {
    buildChartConfig: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
    },
  });

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const mockWidget: Widget = {
  id: 'widget-1',
  widgetId: 'widget-1',
  title: 'Test Widget',
  type: 'bar',
  dataSourceId: 'ds-1',
  config: { metrics: [], buckets: [] },
  ownerId: 'user-1',
  visibility: 'private',
  isGeneratedByAI: false,
  isDraft: false,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

describe('useWidgetData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data when enabled', async () => {
    const mockData = [
      { id: 1, value: 100 },
      { id: 2, value: 200 },
    ];
    const mockConfig = { metrics: [], buckets: [] };

    vi.mocked(dataSourceService.getData).mockResolvedValue(mockData);
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue(mockConfig);

    const { result } = renderHook(() => useWidgetData({ widget: mockWidget, enabled: true }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.hasData).toBe(true);
    expect(result.current.error).toBeNull();
    expect(dataSourceService.getData).toHaveBeenCalledWith('ds-1');
  });

  it('should not fetch when disabled', async () => {
    const mockConfig = { metrics: [], buckets: [] };
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue(mockConfig);

    const { result } = renderHook(() => useWidgetData({ widget: mockWidget, enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(dataSourceService.getData).not.toHaveBeenCalled();
  });

  it('should return empty array when no data', async () => {
    vi.mocked(dataSourceService.getData).mockResolvedValue([]);
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue({ metrics: [] });

    const { result } = renderHook(() => useWidgetData({ widget: mockWidget }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.hasData).toBe(false);
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch data');
    vi.mocked(dataSourceService.getData).mockRejectedValue(error);
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue({ metrics: [] });

    const { result } = renderHook(() => useWidgetData({ widget: mockWidget }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error?.message).toBe('Failed to fetch data');
  });

  it('should build chart config from widget', () => {
    const mockConfig = { metrics: [{ field: 'value', agg: 'sum' as const }] };
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue(mockConfig);
    vi.mocked(dataSourceService.getData).mockResolvedValue([]);

    const { result } = renderHook(() => useWidgetData({ widget: mockWidget }), {
      wrapper: createWrapper(),
    });

    expect(widgetFormService.buildChartConfig).toHaveBeenCalledWith(mockWidget);
    expect(result.current.config).toEqual(mockConfig);
  });

  it('should not fetch when dataSourceId is empty', async () => {
    const widgetWithoutSource: Widget = { ...mockWidget, dataSourceId: '' };
    vi.mocked(widgetFormService.buildChartConfig).mockReturnValue({ metrics: [] });

    renderHook(() => useWidgetData({ widget: widgetWithoutSource }), {
      wrapper: createWrapper(),
    });

    expect(dataSourceService.getData).not.toHaveBeenCalled();
  });
});
