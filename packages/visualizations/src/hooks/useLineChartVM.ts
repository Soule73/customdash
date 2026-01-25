import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig, WidgetParams, ProcessedData } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { ChartDataService } from '../core/services/ChartDataService';
import { LineSeriesBuilder } from '../core/abstracts/AbstractSeriesBuilder';
import { AxisChartOptionsBuilder } from '../core/abstracts/AbstractOptionsBuilder';

export interface LineChartVM {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface LineChartInput {
  data: Record<string, unknown>[];
  config: ChartConfig & { echarts?: EChartsWidgetParams };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Line Chart using Apache ECharts
 * Uses ChartDataService for data processing and LineSeriesBuilder for series generation
 * @see [ChartDataService](../core/services/ChartDataService.ts)
 * @see [LineSeriesBuilder](../core/abstracts/AbstractSeriesBuilder.ts)
 */
export function useLineChartVM({ data, config, widgetParams }: LineChartInput): LineChartVM {
  const dataContext = useMemo(
    () => ChartDataService.createDataContext(data, config, widgetParams),
    [data, config, widgetParams],
  );

  const series = useMemo(() => {
    const seriesBuilder = new LineSeriesBuilder({
      ...dataContext,
      bucketField: config.buckets?.[0]?.field || '',
    });
    return seriesBuilder.build();
  }, [dataContext, config.buckets]);

  const option = useMemo<EChartsOption>(() => {
    const optionsBuilder = new AxisChartOptionsBuilder(dataContext.params, dataContext.labels, {
      horizontal: false,
      axisPointerType: 'line',
    });
    return optionsBuilder.build(series);
  }, [dataContext.params, dataContext.labels, series]);

  return {
    option,
    labels: dataContext.labels,
    processedData: dataContext.processedData,
  };
}
