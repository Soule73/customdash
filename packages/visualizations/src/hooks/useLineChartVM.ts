import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../types';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { getDatasetColor } from '../utils/chartColorUtils';
import { createBaseOptions } from '../utils/chartConfigUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';

export interface LineChartVM {
  chartData: ChartData<'line'>;
  options: ChartOptions<'line'>;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface LineChartWidgetProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook pour la logique du LineChart
 */
export function useLineChartVM({
  data,
  config,
  widgetParams = {},
}: LineChartWidgetProps): LineChartVM {
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

      const backgroundColor = getDatasetColor('line', idx, style, style.colors);
      const borderColor = style.borderColor || getDatasetColor('line', idx, style);

      return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
        tension: style.tension ?? widgetParams.tension ?? 0.4,
        fill: style.fill ?? false,
        pointRadius: style.pointRadius ?? 3,
        pointHoverRadius: style.pointHoverRadius ?? 5,
        pointBackgroundColor: borderColor,
        pointBorderColor: borderColor,
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

  const options = useMemo<ChartOptions<'line'>>(() => {
    const baseOptions = createBaseOptions('line', widgetParams, labels) as ChartOptions<'line'>;
    return {
      ...baseOptions,
      elements: {
        line: {
          tension: widgetParams.tension ?? 0.4,
        },
        point: {
          radius: 3,
          hoverRadius: 5,
        },
      },
    };
  }, [widgetParams, labels]);

  const chartData = useMemo<ChartData<'line'>>(
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
