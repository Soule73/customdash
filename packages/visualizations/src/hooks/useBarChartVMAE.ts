import { useMemo } from 'react';
import type { EChartsOption, BarSeriesOption } from 'echarts';
import type { ChartConfig, WidgetParams, Metric, MetricStyle, ProcessedData } from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { applyAllFilters } from '../utils/filterUtils';
import { aggregate, getLabels } from '../utils/chartUtils';
import { getDatasetColor } from '../utils/chartColorUtils';
import { processMultiBucketData } from '../utils/multiBucketProcessor';
import {
  createBaseOptions,
  createAxisConfig,
  createAdvancedLabelConfig,
  createEmphasisOptions,
  createGradientColor,
  createMarkLineOptions,
  createMarkAreaOptions,
  mergeOptions,
  type ExtendedWidgetParams,
} from '../utils/echartsUtils';

export interface BarChartVMAE {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface BarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig & { echarts?: EChartsWidgetParams };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Bar Chart using Apache ECharts
 */
export function useBarChartVMAE({
  data,
  config,
  widgetParams,
}: BarChartWidgetAEProps): BarChartVMAE {
  const params: ExtendedWidgetParams = useMemo(
    () => ({
      ...config.widgetParams,
      ...widgetParams,
      echarts: {
        ...config.widgetParams?.echarts,
        ...(config as { echarts?: EChartsWidgetParams }).echarts,
        ...widgetParams?.echarts,
      },
    }),
    [config, widgetParams],
  );

  const echartsConfig = params.echarts;
  const barConfig = echartsConfig?.bar;

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

      const baseColor = style.colors?.[0] || getDatasetColor('bar', idx, style);
      const color = echartsConfig?.gradient?.enabled
        ? createGradientColor(baseColor, echartsConfig.gradient)
        : baseColor;

      const markLineOpts = createMarkLineOptions(echartsConfig?.markLine);
      const markAreaOpts = createMarkAreaOptions(echartsConfig?.markArea);

      return {
        name: metric.label || `${metric.agg}(${metric.field})`,
        type: 'bar',
        data: values,
        stack: barConfig?.stack ?? (params.stacked ? 'total' : undefined),
        itemStyle: {
          color,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth ?? params.borderWidth ?? 0,
          borderRadius: style.borderRadius ?? params.borderRadius ?? 0,
        },
        barWidth: barConfig?.barWidth ?? style.barThickness ?? params.barThickness,
        barMaxWidth: barConfig?.barMaxWidth,
        barMinWidth: barConfig?.barMinWidth,
        barMinHeight: barConfig?.barMinHeight,
        barGap: barConfig?.barGap,
        barCategoryGap: barConfig?.barCategoryGap,
        large: barConfig?.large,
        largeThreshold: barConfig?.largeThreshold,
        label: createAdvancedLabelConfig(params.showValues, params, echartsConfig),
        ...createEmphasisOptions(echartsConfig?.emphasis),
        ...markLineOpts,
        ...markAreaOpts,
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
    echartsConfig,
    barConfig,
  ]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(params);
    const axisConfig = createAxisConfig(labels, params, params.horizontal);

    return mergeOptions(baseOptions, axisConfig, {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: echartsConfig?.axisConfig?.axisPointer ?? 'shadow' },
      },
      series,
    });
  }, [params, labels, series, echartsConfig]);

  return {
    option,
    labels,
    processedData,
  };
}
