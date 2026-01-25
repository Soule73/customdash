import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { RadarChartConfig, RadarDataContext, RadarMetricConfig } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { RadarChartService } from '../core/services/RadarChartService';

export interface RadarChartVM {
  option: EChartsOption;
  validDatasets: RadarMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartInput {
  data: Record<string, unknown>[];
  config: RadarChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Radar Chart using Apache ECharts
 * Uses RadarChartService for data processing and options building
 */
export function useRadarChartVM({ data, config }: RadarChartInput): RadarChartVM {
  const context = useMemo<RadarDataContext>(
    () => RadarChartService.createDataContext({ data, config }),
    [data, config],
  );

  const series = useMemo(() => RadarChartService.buildSeries(context), [context]);

  const option = useMemo<EChartsOption>(
    () => RadarChartService.buildOptions(context, series),
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
