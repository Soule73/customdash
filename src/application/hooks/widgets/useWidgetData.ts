import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ChartConfig } from '@customdash/visualizations';
import { widgetFormService } from '@core/widgets';
import { dataSourceService } from '@services/data-source.service';
import type { Widget } from '@type/widget.types';

interface UseWidgetDataOptions {
  widget: Widget;
  enabled?: boolean;
}

interface UseWidgetDataReturn {
  data: Record<string, unknown>[];
  config: ChartConfig;
  isLoading: boolean;
  isRefreshing: boolean;
  hasData: boolean;
  error: Error | null;
}

const STALE_TIME = 5 * 60 * 1000;

/**
 * Hook for fetching and preparing widget data for visualization.
 * Centralizes data fetching and config building logic.
 */
export function useWidgetData({
  widget,
  enabled = true,
}: UseWidgetDataOptions): UseWidgetDataReturn {
  const dataSourceId = widget.dataSourceId;

  const {
    data: rawData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['widget-data', dataSourceId],
    queryFn: () => dataSourceService.getData(dataSourceId),
    staleTime: STALE_TIME,
    enabled: Boolean(dataSourceId) && enabled,
  });

  const config = useMemo(() => widgetFormService.buildChartConfig(widget), [widget]);

  const data = rawData ?? [];
  const hasData = Array.isArray(rawData) && rawData.length > 0;
  const isRefreshing = isLoading && hasData;

  return {
    data,
    config,
    isLoading,
    isRefreshing,
    hasData,
    error: error as Error | null,
  };
}
