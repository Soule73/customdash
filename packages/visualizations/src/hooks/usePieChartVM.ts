import { useMemo } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../interfaces';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { generateColorsForLabels } from '../utils/chartColorUtils';
import { createPieOptions } from '../utils/chartConfigUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';

export interface PieChartVM {
  chartData: ChartData<'pie'>;
  options: ChartOptions<'pie'>;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface PieChartWidgetProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook to create the ViewModel for a Pie Chart
 * @param props - The properties for the Pie Chart widget
 * @returns The ViewModel containing chart data, options, labels, and processed data
 *
 * @example
 * const pieChartVM = usePieChartVM({ data, config, widgetParams });
 */
export function usePieChartVM({
  data,
  config,
  widgetParams = {},
}: PieChartWidgetProps): PieChartVM {
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
    const metric: Metric = metrics[0] || { agg: 'sum', field: '', label: '' };
    const style = metricStyles[0] || {};

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

    const backgroundColor = style.colors || generateColorsForLabels(labels);
    const borderColor = style.borderColor || '#ffffff';

    return [
      {
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: style.borderWidth ?? 2,
        hoverOffset: 4,
      },
    ];
  }, [config.metrics, config.metricStyles, config.buckets, processedData, labels, filteredData]);

  const options = useMemo<ChartOptions<'pie'>>(() => {
    return createPieOptions(widgetParams);
  }, [widgetParams]);

  const chartData = useMemo<ChartData<'pie'>>(
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
