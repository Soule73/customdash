import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig, WidgetParams, ProcessedData } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { ChartDataService } from '../core/services/ChartDataService';
import { PieSeriesBuilder } from '../core/abstracts/AbstractSeriesBuilder';
import { PieChartOptionsBuilder } from '../core/abstracts/AbstractOptionsBuilder';

export interface PieChartVM {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface PieChartInput {
  data: Record<string, unknown>[];
  config: ChartConfig & { echarts?: EChartsWidgetParams };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Pie Chart using Apache ECharts
 * Uses ChartDataService for data processing and PieSeriesBuilder for series generation
 * @see [ChartDataService](../core/services/ChartDataService.ts)
 * @see [PieSeriesBuilder](../core/abstracts/AbstractSeriesBuilder.ts)
 */
export function usePieChartVM({ data, config, widgetParams }: PieChartInput): PieChartVM {
  const dataContext = useMemo(
    () => ChartDataService.createDataContext(data, config, widgetParams),
    [data, config, widgetParams],
  );

  const series = useMemo(() => {
    const seriesBuilder = new PieSeriesBuilder({
      ...dataContext,
      bucketField: config.buckets?.[0]?.field || '',
    });
    return seriesBuilder.build();
  }, [dataContext, config.buckets]);

  const option = useMemo<EChartsOption>(() => {
    const optionsBuilder = new PieChartOptionsBuilder(dataContext.params, dataContext.labels);
    return optionsBuilder.build(series);
  }, [dataContext.params, dataContext.labels, series]);

  return {
    option,
    labels: dataContext.labels,
    processedData: dataContext.processedData,
  };
}
