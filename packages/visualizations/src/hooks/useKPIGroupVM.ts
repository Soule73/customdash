import { useEffect, useMemo, useState } from 'react';
import type { Metric, Filter, MetricStyle, KPIGroupConfig } from '../types';

export interface KPIGroupWidgetVM {
  gridColumns: number;
  metrics: Metric[];
  metricStyles: MetricStyle[];
  filters: Filter[] | undefined;
  groupTitle: string;
  widgetParamsList: Array<Record<string, unknown>>;
}

export interface KPIGroupWidgetProps {
  data: Record<string, unknown>[];
  config: KPIGroupConfig;
}

/**
 * ViewModel hook for KPIGroupWidget managing grid layout and individual KPI configurations
 */
export function useKPIGroupVM(config: KPIGroupConfig): KPIGroupWidgetVM {
  const [gridColumns, setGridColumns] = useState(1);

  const columns =
    (typeof config.widgetParams?.columns === 'number' ? config.widgetParams.columns : undefined) ||
    2;

  const groupTitle =
    (typeof config.widgetParams?.title === 'string' ? config.widgetParams.title : undefined) ||
    'KPI Group';

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setGridColumns(1);
      } else {
        setGridColumns(columns);
      }
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  const metrics: Metric[] = useMemo(
    () => (Array.isArray(config.metrics) ? config.metrics : []),
    [config.metrics],
  );

  const metricStyles = useMemo<MetricStyle[]>(
    () => (Array.isArray(config.metricStyles) ? config.metricStyles : []),
    [config.metricStyles],
  );

  const filters = useMemo<Filter[] | undefined>(() => config.globalFilters, [config.globalFilters]);

  const widgetParamsList = useMemo<Array<Record<string, unknown>>>(
    () =>
      metrics.map((metric, idx) => {
        const metricStyle = Array.isArray(metricStyles) ? metricStyles[idx] : undefined;
        const baseParams = (config.widgetParams as Record<string, unknown>) || {};

        return {
          ...baseParams,
          title: metric.label || metric.field || `KPI ${idx + 1}`,
          valueColor: metricStyle?.color || baseParams.valueColor || '#2563eb',
        };
      }),
    [metrics, config.widgetParams, metricStyles],
  );

  return {
    gridColumns,
    metrics,
    metricStyles,
    filters,
    groupTitle,
    widgetParamsList,
  };
}
