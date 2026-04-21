import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ChartConfig, Filter } from '@customdash/visualizations';
import { widgetFormService } from '@core/widgets';
import { applyAllFilters } from '@customdash/visualizations';
import { dataSourceService } from '@services/data-source.service';
import type { Widget } from '@type/widget.types';

interface UseWidgetDataOptions {
  widget: Widget;
  enabled?: boolean;
  dashboardGlobalFilters?: Filter[];
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
  dashboardGlobalFilters,
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

  const widgetFilters = useMemo<Filter[]>(
    () =>
      (widget.config.globalFilters ?? []).map(f => ({
        field: f.field,
        operator: f.operator as Filter['operator'],
        value: f.value as Filter['value'],
      })),
    [widget.config.globalFilters],
  );

  const filteredData = useMemo(() => {
    const base = rawData ?? [];
    return applyAllFilters(base, dashboardGlobalFilters, widgetFilters);
  }, [rawData, dashboardGlobalFilters, widgetFilters]);

  const hasData = Array.isArray(rawData) && rawData.length > 0;
  const isRefreshing = isLoading && hasData;

  return {
    data: filteredData,
    config,
    isLoading,
    isRefreshing,
    hasData,
    error: error as Error | null,
  };
}
