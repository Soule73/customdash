import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import type { RadarChartConfig, WidgetParams, ThemeColors } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { RadarChartService, type RadarDataResult } from '../core/services/RadarChartService';

export interface RadarChartVM {
  option: EChartsOption;
  labels: string[];
  seriesNames: string[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartInput {
  data: Record<string, unknown>[];
  config: RadarChartConfig & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors };
}

/**
 * Hook to create the ViewModel for a Radar Chart using Apache ECharts
 * Supports two modes:
 * - Global aggregation (default): One polygon with aggregated metrics across all data
 * - GroupBy mode: Multiple polygons for comparing entities on the same axes
 * @see [RadarChartService](../core/services/RadarChartService.ts)
 */
export function useRadarChartVM({ data, config, widgetParams }: RadarChartInput): RadarChartVM {
  const extendedWidgetParams = useMemo(
    () => ({
      ...config.widgetParams,
      ...widgetParams,
      echarts: {
        ...config.widgetParams?.echarts,
        ...config.echarts,
        ...widgetParams?.echarts,
      },
      themeColors: {
        ...config.themeColors,
        ...widgetParams?.themeColors,
      },
    }),
    [config, widgetParams],
  );

  const context = useMemo(
    () => RadarChartService.createDataContext({ data, config }, extendedWidgetParams),
    [data, config, extendedWidgetParams],
  );

  const radarData = useMemo<RadarDataResult>(
    () => RadarChartService.computeRadarData(context),
    [context],
  );

  const series = useMemo(
    () => RadarChartService.buildSeries(context, radarData),
    [context, radarData],
  );

  const option = useMemo<EChartsOption>(
    () => RadarChartService.buildOptions(context, radarData, series),
    [context, radarData, series],
  );

  const labels = radarData.indicators.map(ind => ind.name);
  const seriesNames = radarData.seriesData.map(s => s.name);

  return {
    option,
    labels,
    seriesNames,
    isValid: context.validation.isValid,
    validationErrors: context.validation.errors,
    validationWarnings: context.validation.warnings,
  };
}
