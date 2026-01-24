import { useMemo } from 'react';
import type { EChartsOption, BarSeriesOption } from 'echarts';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../interfaces';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { getDatasetColor } from '../utils/chartColorUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';
import {
  createBaseOptions,
  createAxisConfig,
  createLabelConfig,
  mergeOptions,
} from '../utils/echartsUtils';

export interface BarChartVMAE {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface BarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook to create the ViewModel for a Bar Chart using Apache ECharts
 */
export function useBarChartVMAE({
  data,
  config,
  widgetParams,
}: BarChartWidgetAEProps): BarChartVMAE {
  const params = widgetParams || config.widgetParams || {};

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

  const series = useMemo<BarSeriesOption[]>(() => {
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

      const color = style.colors?.[0] || getDatasetColor('bar', idx, style);

      return {
        name: metric.label || `${metric.agg}(${metric.field})`,
        type: 'bar',
        data: values,
        stack: params.stacked ? 'total' : undefined,
        itemStyle: {
          color,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth ?? params.borderWidth ?? 0,
          borderRadius: style.borderRadius ?? params.borderRadius ?? 0,
        },
        barWidth: style.barThickness ?? params.barThickness,
        label: createLabelConfig(params.showValues, params),
        emphasis: {
          focus: 'series',
        },
      } as BarSeriesOption;
    });
  }, [
    config.metrics,
    config.metricStyles,
    config.buckets,
    processedData,
    labels,
    filteredData,
    params,
  ]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(params);
    const axisConfig = createAxisConfig(labels, params, params.horizontal);

    const tooltipTrigger = params.horizontal ? 'axis' : 'axis';

    return mergeOptions(baseOptions, axisConfig, {
      tooltip: {
        trigger: tooltipTrigger,
        axisPointer: { type: 'shadow' },
      },
      series,
    });
  }, [params, labels, series]);

  return {
    option,
    labels,
    processedData,
  };
}
