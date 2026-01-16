import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import type { RadarChartConfig, RadarMetricConfig, WidgetParams } from '../types';
import { createRadarChartDataset, prepareMetricStyles } from '../utils/chartDatasetUtils';
import { createBaseOptions } from '../utils/chartConfigUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import { getCustomChartOptions, mergeOptions } from '../utils/chartOptionsUtils';
import {
  getRadarLabels,
  processRadarMetrics,
  validateRadarConfiguration,
  generateRadarMetricLabel,
} from '../utils/radarChartUtils';

export interface RadarChartVM {
  chartData: ChartData<'radar'>;
  options: ChartOptions<'radar'>;
  validDatasets: RadarMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartWidgetProps {
  data: Record<string, unknown>[];
  config: RadarChartConfig;
}

/**
 * ViewModel hook for RadarChart widget handling data processing, validation and chart configuration
 */
export function useRadarChartVM({ data, config }: RadarChartWidgetProps): RadarChartVM {
  const widgetParams: WidgetParams = useMemo(
    () => mergeWidgetParams(config.widgetParams),
    [config.widgetParams],
  );

  const validMetrics = useMemo(
    () => (config.metrics || []) as RadarMetricConfig[],
    [config.metrics],
  );

  const metricStyles = useMemo(
    () => prepareMetricStyles(config.metricStyles),
    [config.metricStyles],
  );

  const validation = useMemo(() => validateRadarConfiguration(validMetrics), [validMetrics]);

  const labels = useMemo(() => getRadarLabels(validMetrics), [validMetrics]);

  const processedMetrics = useMemo(
    () => processRadarMetrics(data, validMetrics, config.globalFilters),
    [data, validMetrics, config.globalFilters],
  );

  const datasets = useMemo(() => {
    return processedMetrics.map(({ metric, values, index }) => {
      const metricWithLabel = {
        ...metric,
        label: metric.label || generateRadarMetricLabel(metric),
      };

      const style = metricStyles[index] || {};
      return createRadarChartDataset(metricWithLabel, index, values, labels, widgetParams, style);
    });
  }, [processedMetrics, labels, widgetParams, metricStyles]);

  const options = useMemo(() => {
    const baseOptions = createBaseOptions('radar', widgetParams, labels);
    const customOptions = getCustomChartOptions('radar', widgetParams);
    const mergedOptions = mergeOptions(baseOptions, customOptions);
    const existingScales = mergedOptions.scales as Record<string, unknown> | undefined;
    const existingR = existingScales?.r as Record<string, unknown> | undefined;

    return {
      ...mergedOptions,
      scales: {
        ...existingScales,
        r: {
          ...existingR,
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          pointLabels: {
            font: {
              size: 12,
            },
          },
        },
      },
    } as ChartOptions<'radar'>;
  }, [widgetParams, labels]);

  const chartData: ChartData<'radar'> = useMemo(
    () => ({
      labels,
      datasets: datasets as unknown as ChartData<'radar'>['datasets'],
    }),
    [labels, datasets],
  );

  return {
    chartData,
    options,
    validDatasets: validMetrics,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}
