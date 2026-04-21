import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig, WidgetParams, ProcessedData, ThemeColors } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { ChartDataService } from '../core/services/ChartDataService';
import { PieSeriesBuilder } from '../core/abstracts/AbstractSeriesBuilder';
import { PieChartOptionsBuilder } from '../core/abstracts/AbstractOptionsBuilder';
import { useEChartsTheme } from './useEChartsTheme';

/** Colors injected into ECharts options when dark mode is active */
const DARK_THEME_COLORS: ThemeColors = {
  textColor: '#e2e8f0',
  labelColor: '#cbd5e1',
  gridColor: '#334155',
  tooltipBackground: '#1e293b',
  tooltipTextColor: '#f1f5f9',
};

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
  const echartsTheme = useEChartsTheme();
  // Inject explicit label colors when dark mode is active so pie slice labels
  // are always readable regardless of ECharts built-in dark theme behavior.
  const themeColors = echartsTheme === 'dark' ? DARK_THEME_COLORS : undefined;

  const dataContext = useMemo(
    () =>
      ChartDataService.createDataContext(data, config, {
        ...widgetParams,
        themeColors: themeColors ?? widgetParams?.themeColors,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, config, widgetParams, echartsTheme],
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
