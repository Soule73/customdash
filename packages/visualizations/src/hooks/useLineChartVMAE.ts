import { useMemo } from 'react';
import type { EChartsOption, LineSeriesOption } from 'echarts';
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

export interface LineChartVMAE {
  option: EChartsOption;
  labels: string[];
  processedData: ProcessedData | null;
}

export interface LineChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig & { echarts?: EChartsWidgetParams };
  widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Line Chart using Apache ECharts
 */
export function useLineChartVMAE({
  data,
  config,
  widgetParams,
}: LineChartWidgetAEProps): LineChartVMAE {
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
  const lineConfig = echartsConfig?.line;

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

      const baseColor = style.colors?.[0] || getDatasetColor('line', idx, style);

      const smoothValue = lineConfig?.smooth ?? (style.tension ?? params.tension ?? 0.4) > 0;
      const hasAreaStyle = lineConfig?.areaStyle ?? style.fill;

      let areaStyleConfig: Record<string, unknown> | undefined;
      if (hasAreaStyle) {
        const areaColor = echartsConfig?.gradient?.enabled
          ? createGradientColor(baseColor, { ...echartsConfig.gradient, direction: 'vertical' })
          : baseColor;
        areaStyleConfig = {
          color: areaColor,
          opacity: lineConfig?.areaOpacity ?? 0.3,
        };
      }

      const markLineOpts = createMarkLineOptions(echartsConfig?.markLine);
      const markAreaOpts = createMarkAreaOptions(echartsConfig?.markArea);

      return {
        name: metric.label || `${metric.agg}(${metric.field})`,
        type: 'line',
        data: values,
        smooth: smoothValue,
        smoothMonotone: lineConfig?.smoothMonotone,
        step: lineConfig?.step,
        connectNulls: lineConfig?.connectNulls ?? true,
        lineStyle: {
          color: baseColor,
          width: style.borderWidth ?? params.borderWidth ?? 2,
        },
        itemStyle: {
          color: baseColor,
        },
        areaStyle: areaStyleConfig,
        showSymbol: params.showPoints !== false,
        symbol: lineConfig?.symbol ?? 'circle',
        symbolSize: lineConfig?.symbolSize ?? style.pointRadius ?? params.pointRadius ?? 4,
        label: createAdvancedLabelConfig(params.showValues, params, echartsConfig),
        ...createEmphasisOptions(echartsConfig?.emphasis),
        ...markLineOpts,
        ...markAreaOpts,
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
    echartsConfig,
    lineConfig,
  ]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(params);
    const axisConfig = createAxisConfig(labels, params);

    return mergeOptions(baseOptions, axisConfig, {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: echartsConfig?.axisConfig?.axisPointer ?? 'line' },
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
