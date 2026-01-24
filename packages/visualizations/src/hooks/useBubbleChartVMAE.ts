import { useMemo } from 'react';
import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import type {
  BubbleMetricConfig,
  BubbleChartConfig,
  MetricStyle,
  BubbleValidationResult,
} from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { prepareMetricStyles } from '../utils/metricStyleUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import {
  processBubbleMetrics,
  validateBubbleConfiguration,
  generateBubbleMetricLabel,
  calculateBubbleScales,
} from '../utils/bubbleChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  createAdvancedLabelConfig,
  createGradientColor,
  mergeOptions,
  getDefaultColor,
  type ExtendedWidgetParams,
} from '../utils/echartsUtils';

export interface BubbleChartVMAE {
  option: EChartsOption;
  validDatasets: BubbleMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface BubbleChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: BubbleChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Bubble Chart using Apache ECharts
 */
export function useBubbleChartVMAE({ data, config }: BubbleChartWidgetAEProps): BubbleChartVMAE {
  const widgetParams: ExtendedWidgetParams = useMemo(
    () => ({
      ...mergeWidgetParams(config.widgetParams),
      echarts: (config as { echarts?: EChartsWidgetParams }).echarts,
    }),
    [config],
  );

  const echartsConfig = widgetParams.echarts;
  const scatterConfig = echartsConfig?.scatter;

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

  const scales = useMemo(() => {
    return calculateBubbleScales(data, validMetrics);
  }, [data, validMetrics]);

  const series = useMemo<ScatterSeriesOption[]>(() => {
    const emphasisConfig = createEmphasisOptions(echartsConfig?.emphasis);
    const labelConfig = createAdvancedLabelConfig(
      widgetParams.showValues,
      widgetParams,
      echartsConfig,
    );

    return processedMetrics.map(({ metric, bubbleData, index }) => {
      const style = metricStyles[index] || {};
      const baseColor = style.colors?.[0] || getDefaultColor(index);
      const label = metric.label || generateBubbleMetricLabel(metric);

      const color = echartsConfig?.gradient?.enabled
        ? createGradientColor(baseColor, { ...echartsConfig.gradient, direction: 'radial' })
        : baseColor;

      const maxR = Math.max(...bubbleData.map(d => d.r), 1);
      const minSize = 10;
      const maxSize = 50;

      return {
        type: 'scatter',
        name: label,
        data: bubbleData.map(point => ({
          value: [point.x, point.y],
          symbolSize: minSize + (point.r / maxR) * (maxSize - minSize),
        })),
        symbolRotate: scatterConfig?.symbolRotate,
        large: scatterConfig?.large,
        largeThreshold: scatterConfig?.largeThreshold,
        itemStyle: {
          color,
          opacity: style.opacity ?? 0.7,
        },
        ...emphasisConfig,
        label: widgetParams.showValues
          ? {
              ...labelConfig,
              formatter:
                echartsConfig?.labelFormatter ??
                ((params: { value: [number, number] }) =>
                  `(${params.value[0]}, ${params.value[1]})`),
            }
          : undefined,
      } as ScatterSeriesOption;
    });
  }, [processedMetrics, metricStyles, widgetParams, echartsConfig, scatterConfig]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(widgetParams);
    const axisConfig = echartsConfig?.axisConfig;

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
        confine: echartsConfig?.tooltipConfig?.confine ?? true,
        formatter: (params: unknown) => {
          const p = params as {
            seriesName?: string;
            value?: [number, number];
            data?: { symbolSize?: number };
          };
          return `${p.seriesName || ''}<br/>X: ${p.value?.[0] ?? ''}<br/>Y: ${p.value?.[1] ?? ''}<br/>Size: ${Math.round(p.data?.symbolSize ?? 0)}`;
        },
      },
      xAxis: {
        type: 'value',
        name: widgetParams.xLabel || 'X',
        min: scales.xMin,
        max: scales.xMax,
        splitLine: { show: widgetParams.showGrid !== false },
        axisLabel: { rotate: axisConfig?.axisLabelRotate ?? 0 },
      },
      yAxis: {
        type: 'value',
        name: widgetParams.yLabel || 'Y',
        min: scales.yMin,
        max: scales.yMax,
        splitLine: { show: widgetParams.showGrid !== false },
        splitArea: axisConfig?.splitAreaShow ? { show: true } : undefined,
      },
      series,
    });
  }, [widgetParams, scales, series, echartsConfig]);

  return {
    option,
    validDatasets: validMetrics,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}
