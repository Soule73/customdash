import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig, WidgetParams, ProcessedData } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { ChartDataService } from '../core/services/ChartDataService';
import { BarSeriesBuilder } from '../core/abstracts/AbstractSeriesBuilder';
import { AxisChartOptionsBuilder } from '../core/abstracts/AbstractOptionsBuilder';

export interface BarChartVM {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface BarChartInput {
  data: Record<string, unknown>[];
  config: ChartConfig & { echarts?: EChartsWidgetParams };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Bar Chart using Apache ECharts
 * Uses ChartDataService for data processing and BarSeriesBuilder for series generation
 * @see [ChartDataService](../core/services/ChartDataService.ts)
 * @see [BarSeriesBuilder](../core/abstracts/AbstractSeriesBuilder.ts)
 */
export function useBarChartVM({ data, config, widgetParams }: BarChartInput): BarChartVM {
  const dataContext = useMemo(
    () => ChartDataService.createDataContext(data, config, widgetParams),
    [data, config, widgetParams],
  );

  const series = useMemo(() => {
    const seriesBuilder = new BarSeriesBuilder({
      ...dataContext,
      bucketField: config.buckets?.[0]?.field || '',
    });
    return seriesBuilder.build();
  }, [dataContext, config.buckets]);

  const option = useMemo<EChartsOption>(() => {
    const horizontal = dataContext.params.horizontal ?? false;
    const optionsBuilder = new AxisChartOptionsBuilder(dataContext.params, dataContext.labels, {
      horizontal,
      axisPointerType: 'shadow',
    });
    return optionsBuilder.build(series);
  }, [dataContext.params, dataContext.labels, series]);

  return {
    option,
    labels: dataContext.labels,
    processedData: dataContext.processedData,
  };
}
