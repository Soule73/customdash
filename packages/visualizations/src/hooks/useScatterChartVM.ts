import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { ScatterMetricConfig, ScatterChartConfig, ScatterDataContext } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { ScatterChartService } from '../core/services/ScatterChartService';

export interface ScatterChartVM {
  option: EChartsOption;
  validDatasets: ScatterMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ScatterChartInput {
  data: Record<string, unknown>[];
  config: ScatterChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Scatter Chart using Apache ECharts
 * Uses ScatterChartService for data processing and options building
 * @see [ScatterChartService](../core/services/ScatterChartService.ts)
 */
export function useScatterChartVM({ data, config }: ScatterChartInput): ScatterChartVM {
  const context = useMemo<ScatterDataContext>(
    () => ScatterChartService.createDataContext({ data, config }),
    [data, config],
  );

  const series = useMemo(() => ScatterChartService.buildSeries(context), [context]);

  const option = useMemo<EChartsOption>(
    () => ScatterChartService.buildOptions(context, series),
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
