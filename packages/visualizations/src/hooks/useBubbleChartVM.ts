import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { BubbleMetricConfig, BubbleChartConfig, BubbleDataContext } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { BubbleChartService } from '../core/services/BubbleChartService';

export interface BubbleChartVM {
  option: EChartsOption;
  validDatasets: BubbleMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface BubbleChartInput {
  data: Record<string, unknown>[];
  config: BubbleChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Bubble Chart using Apache ECharts
 * Uses BubbleChartService for data processing and options building
 */
export function useBubbleChartVM({ data, config }: BubbleChartInput): BubbleChartVM {
  const context = useMemo<BubbleDataContext>(
    () => BubbleChartService.createDataContext({ data, config }),
    [data, config],
  );

  const series = useMemo(() => BubbleChartService.buildSeries(context), [context]);

  const option = useMemo<EChartsOption>(
    () => BubbleChartService.buildOptions(context, series),
    [context, series],
  );

  return {
    option,
    validDatasets: context.validMetrics,
    isValid: context.validation.isValid,
    validationErrors: context.validation.errors,
    validationWarnings: context.validation.warnings,
  };
}
