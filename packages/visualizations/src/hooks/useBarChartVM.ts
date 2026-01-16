import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../types';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { getDatasetColor } from '../utils/chartColorUtils';
import { createBaseOptions } from '../utils/chartConfigUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';

export interface BarChartVM {
  chartData: ChartData<'bar'>;
  options: ChartOptions<'bar'>;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook pour la logique du BarChart
 */
export function useBarChartVM({
  data,
  config,
  widgetParams = {},
}: BarChartWidgetProps): BarChartVM {
  const filteredData = useMemo(() => {
    return applyAllFilters(data, config.globalFilters);
  }, [data, config.globalFilters]);

  const processedData = useMemo<ProcessedData | null>(() => {
    if (config.buckets && config.buckets.length > 0) {
      return processMultiBucketData(filteredData, config);
    }
    return null;
  }, [filteredData, config]);

  const labels = useMemo(() => {
    if (processedData) {
      return processedData.labels;
    }
    const bucketField = config.buckets?.[0]?.field || '';
    return getLabels(filteredData, bucketField);
  }, [processedData, filteredData, config.buckets]);

  const datasets = useMemo(() => {
    const metrics = config.metrics || [];
    const metricStyles: MetricStyle[] = config.metricStyles || [];

    return metrics.map((metric: Metric, idx: number) => {
      const style = metricStyles[idx] || {};

      let values: number[];
      if (processedData && processedData.bucketHierarchy.length > 0) {
        values = processedData.bucketHierarchy[0].buckets.map(bucket =>
          aggregate(bucket.data, metric.agg, metric.field),
        );
      } else {
        values = labels.map(label => {
          const bucketField = config.buckets?.[0]?.field || '';
          const rowsForLabel = filteredData.filter(row => String(row[bucketField]) === label);
          return aggregate(rowsForLabel, metric.agg, metric.field);
        });
      }

      const backgroundColor = getDatasetColor('bar', idx, style, style.colors);
      const borderColor = style.borderColor || getDatasetColor('bar', idx, style);

      return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 1,
        barThickness: style.barThickness ?? widgetParams.barThickness,
        borderRadius: style.borderRadius ?? widgetParams.borderRadius ?? 0,
        borderSkipped: false as const,
      };
    });
  }, [
    config.metrics,
    config.metricStyles,
    config.buckets,
    processedData,
    labels,
    filteredData,
    widgetParams,
  ]);

  const options = useMemo<ChartOptions<'bar'>>(() => {
    return createBaseOptions('bar', widgetParams, labels) as ChartOptions<'bar'>;
  }, [widgetParams, labels]);

  const chartData = useMemo<ChartData<'bar'>>(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets],
  );

  return {
    chartData,
    options,
    labels,
    processedData,
  };
}
