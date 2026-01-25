import { useEffect, useMemo, useState } from 'react';
import type {
  Metric,
  Filter,
  MetricStyle,
  KPIGroupConfig,
  KPIGroupDataContext,
} from '../interfaces';
import { KPIGroupService } from '../core/services/KPIGroupService';

export interface KPIGroupWidgetVM {
  gridColumns: number;
  metrics: Metric[];
  metricStyles: MetricStyle[];
  filters: Filter[] | undefined;
  groupTitle: string;
  widgetParamsList: Array<Record<string, unknown>>;
}

export interface KPIGroupInput {
  data: Record<string, unknown>[];
  config: KPIGroupConfig;
}

/**
 * ViewModel hook for KPIGroupWidget managing grid layout and individual KPI configurations
 * Uses KPIGroupService for business logic
 */
export function useKPIGroupVM(config: KPIGroupConfig): KPIGroupWidgetVM {
  const [gridColumns, setGridColumns] = useState(1);

  const context = useMemo<KPIGroupDataContext>(
    () => KPIGroupService.createDataContext({ config }),
    [config],
  );

  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;
      const responsiveColumns = KPIGroupService.calculateResponsiveColumns(
        context.columns,
        window.innerWidth,
      );
      setGridColumns(responsiveColumns);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [context.columns]);

  return {
    gridColumns,
    metrics: context.metrics,
    metricStyles: context.metricStyles,
    filters: context.filters,
    groupTitle: context.groupTitle,
    widgetParamsList: context.widgetParamsList,
  };
}
