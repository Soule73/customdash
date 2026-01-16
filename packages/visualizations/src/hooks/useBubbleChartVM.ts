import { useMemo } from 'react';
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import type { BubbleMetricConfig, BubbleChartConfig, MetricStyle, WidgetParams } from '../types';
import { createBubbleChartDataset, prepareMetricStyles } from '../utils/chartDatasetUtils';
import { createBaseOptions } from '../utils/chartConfigUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import { getCustomChartOptions, mergeOptions } from '../utils/chartOptionsUtils';
import {
  processBubbleMetrics,
  validateBubbleConfiguration,
  generateBubbleMetricLabel,
  calculateBubbleScales,
  type BubbleDataPoint,
  type BubbleValidationResult,
  type BubbleScales,
} from '../utils/bubbleChartUtils';

export interface BubbleChartVM {
  chartData: ChartData<'bubble'>;
  options: ChartOptions<'bubble'>;
  validDatasets: BubbleMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface BubbleChartWidgetProps {
  data: Record<string, unknown>[];
  config: BubbleChartConfig;
}

/**
 * Hook pour la logique du BubbleChart
 */
export function useBubbleChartVM({ data, config }: BubbleChartWidgetProps): BubbleChartVM {
  const widgetParams = useMemo<WidgetParams>(() => {
    return mergeWidgetParams(config.widgetParams);
  }, [config.widgetParams]);

  const validMetrics = useMemo<BubbleMetricConfig[]>(() => {
    return config.metrics || [];
  }, [config.metrics]);

  const metricStyles = useMemo<MetricStyle[]>(() => {
    return prepareMetricStyles(config.metricStyles);
  }, [config.metricStyles]);

  const validation = useMemo<BubbleValidationResult>(() => {
    return validateBubbleConfiguration(validMetrics);
  }, [validMetrics]);

  const processedMetrics = useMemo(() => {
    return processBubbleMetrics(data, validMetrics, config.globalFilters);
  }, [data, validMetrics, config.globalFilters]);

  const scales = useMemo<BubbleScales>(() => {
    return calculateBubbleScales(data, validMetrics);
  }, [data, validMetrics]);

  const datasets = useMemo(() => {
    return processedMetrics.map(({ metric, bubbleData, index }) => {
      const metricWithLabel = {
        ...metric,
        label: metric.label || generateBubbleMetricLabel(metric),
      };

      const style = metricStyles[index] || {};
      return createBubbleChartDataset(metricWithLabel, index, bubbleData, [], widgetParams, style);
    });
  }, [processedMetrics, widgetParams, metricStyles]);

  const options = useMemo<ChartOptions<'bubble'>>(() => {
    const baseOptions = createBaseOptions('bubble', widgetParams, []);
    const customOptions = getCustomChartOptions('bubble', widgetParams);
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
            label: (context: TooltipItem<'bubble'>) => {
              const dataPoint = context.raw as BubbleDataPoint;
              const datasetLabel = context.dataset.label || '';
              return `${datasetLabel}: (${dataPoint.x}, ${dataPoint.y}, ${dataPoint.r})`;
            },
          },
        },
      },
    } as ChartOptions<'bubble'>;
  }, [widgetParams, scales]);

  const chartData = useMemo<ChartData<'bubble'>>(
    () => ({
      datasets: datasets as unknown as ChartData<'bubble'>['datasets'],
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
