import { useMemo } from 'react';
import type { EChartsOption, LineSeriesOption } from 'echarts';
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

export interface LineChartVMAE {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface LineChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
}

/**
 * Hook to create the ViewModel for a Line Chart using Apache ECharts
 */
export function useLineChartVMAE({
  data,
  config,
  widgetParams,
}: LineChartWidgetAEProps): LineChartVMAE {
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

  const series = useMemo<LineSeriesOption[]>(() => {
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

      const color = style.colors?.[0] || getDatasetColor('line', idx, style);

      return {
        name: metric.label || `${metric.agg}(${metric.field})`,
        type: 'line',
        data: values,
        smooth: (style.tension ?? params.tension ?? 0.4) > 0,
        lineStyle: {
          color,
          width: style.borderWidth ?? params.borderWidth ?? 2,
        },
        itemStyle: {
          color,
        },
        areaStyle: style.fill ? { opacity: 0.3 } : undefined,
        showSymbol: params.showPoints !== false,
        symbolSize: style.pointRadius ?? params.pointRadius ?? 4,
        label: createLabelConfig(params.showValues, params),
        emphasis: {
          focus: 'series',
        },
      } as LineSeriesOption;
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
    const axisConfig = createAxisConfig(labels, params);

    return mergeOptions(baseOptions, axisConfig, {
      tooltip: {
        trigger: 'axis',
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
