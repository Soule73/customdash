import { useMemo } from 'react';
import type { ChartData, ChartOptions, ScatterDataPoint, TooltipItem } from 'chart.js';
import type {
  ScatterMetricConfig,
  ScatterChartConfig,
  MetricStyle,
  WidgetParams,
  ScatterScales,
  ScatterValidationResult,
} from '../interfaces';
import { createScatterChartDataset, prepareMetricStyles } from '../utils/chartDatasetUtils';
import { createBaseOptions } from '../utils/chartConfigUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import { getCustomChartOptions, mergeOptions } from '../utils/chartOptionsUtils';
import {
  processScatterMetrics,
  validateScatterConfiguration,
  generateScatterMetricLabel,
  calculateScatterScales,
} from '../utils/scatterChartUtils';

export interface ScatterChartVM {
  chartData: ChartData<'scatter'>;
  options: ChartOptions<'scatter'>;
  validDatasets: ScatterMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ScatterChartWidgetProps {
  data: Record<string, unknown>[];
  config: ScatterChartConfig;
}

/**
 * Hook to create the ViewModel for a Scatter Chart
 * @param props - The properties for the Scatter Chart widget
 * @returns The ViewModel containing chart data, options, valid datasets, and validation info
 *
 * @example
 * const scatterChartVM = useScatterChartVM({ data, config });
 */
export function useScatterChartVM({ data, config }: ScatterChartWidgetProps): ScatterChartVM {
  const widgetParams = useMemo<WidgetParams>(() => {
    return mergeWidgetParams(config.widgetParams);
  }, [config.widgetParams]);

  const validMetrics = useMemo<ScatterMetricConfig[]>(() => {
    return config.metrics || [];
  }, [config.metrics]);

  const metricStyles = useMemo<MetricStyle[]>(() => {
    return prepareMetricStyles(config.metricStyles);
  }, [config.metricStyles]);

  const validation = useMemo<ScatterValidationResult>(() => {
    return validateScatterConfiguration(validMetrics);
  }, [validMetrics]);

  const processedMetrics = useMemo(() => {
    return processScatterMetrics(data, validMetrics, config.globalFilters);
  }, [data, validMetrics, config.globalFilters]);

  const scales = useMemo<ScatterScales>(() => {
    return calculateScatterScales(data, validMetrics);
  }, [data, validMetrics]);

  const datasets = useMemo(() => {
    return processedMetrics.map(({ metric, scatterData, index }) => {
      const metricWithLabel = {
        ...metric,
        label: metric.label || generateScatterMetricLabel(metric),
      };

      const style = metricStyles[index] || {};
      return createScatterChartDataset(
        metricWithLabel,
        index,
        scatterData,
        [],
        widgetParams,
        style,
      );
    });
  }, [processedMetrics, widgetParams, metricStyles]);

  const options = useMemo<ChartOptions<'scatter'>>(() => {
    const baseOptions = createBaseOptions('scatter', widgetParams, []);
    const customOptions = getCustomChartOptions('scatter', widgetParams);
    const mergedOptions = mergeOptions(baseOptions, customOptions);

    return {
      ...mergedOptions,
      scales: {
        ...mergedOptions.scales,
        x: {
          ...(mergedOptions.scales?.x as Record<string, unknown>),
          type: 'linear' as const,
          position: 'bottom' as const,
          min: scales.xMin,
          max: scales.xMax,
          title: {
            display: !!widgetParams.xLabel,
            text: widgetParams.xLabel || 'X',
          },
        },
        y: {
          ...(mergedOptions.scales?.y as Record<string, unknown>),
          type: 'linear' as const,
          min: scales.yMin,
          max: scales.yMax,
          title: {
            display: !!widgetParams.yLabel,
            text: widgetParams.yLabel || 'Y',
          },
        },
      },
      plugins: {
        ...mergedOptions.plugins,
        tooltip: {
          ...mergedOptions.plugins?.tooltip,
          callbacks: {
            label: (context: TooltipItem<'scatter'>) => {
              const dataPoint = context.raw as ScatterDataPoint;
              const datasetLabel = context.dataset.label || '';
              return `${datasetLabel}: (${dataPoint.x}, ${dataPoint.y})`;
            },
          },
        },
      },
    } as ChartOptions<'scatter'>;
  }, [widgetParams, scales]);

  const chartData = useMemo<ChartData<'scatter'>>(
    () => ({
      datasets: datasets as unknown as ChartData<'scatter'>['datasets'],
    }),
    [datasets],
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
