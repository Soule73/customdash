import { useMemo } from 'react';
import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import type {
  ScatterMetricConfig,
  ScatterChartConfig,
  MetricStyle,
  ScatterValidationResult,
} from '../interfaces';
import type { EChartsWidgetParams } from '../types/echarts.types';
import { prepareMetricStyles } from '../utils/metricStyleUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import {
  processScatterMetrics,
  validateScatterConfiguration,
  generateScatterMetricLabel,
  calculateScatterScales,
} from '../utils/scatterChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  createAdvancedLabelConfig,
  mergeOptions,
  getDefaultColor,
  type ExtendedWidgetParams,
} from '../utils/echartsUtils';

export interface ScatterChartVMAE {
  option: EChartsOption;
  validDatasets: ScatterMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ScatterChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ScatterChartConfig & { echarts?: EChartsWidgetParams };
}

/**
 * Hook to create the ViewModel for a Scatter Chart using Apache ECharts
 */
export function useScatterChartVMAE({ data, config }: ScatterChartWidgetAEProps): ScatterChartVMAE {
  const widgetParams: ExtendedWidgetParams = useMemo(
    () => ({
      ...mergeWidgetParams(config.widgetParams),
      echarts: (config as { echarts?: EChartsWidgetParams }).echarts,
    }),
    [config],
  );

  const echartsConfig = widgetParams.echarts;
  const scatterConfig = echartsConfig?.scatter;

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

  const scales = useMemo(() => {
    return calculateScatterScales(data, validMetrics);
  }, [data, validMetrics]);

  const series = useMemo<ScatterSeriesOption[]>(() => {
    const emphasisConfig = createEmphasisOptions(echartsConfig?.emphasis);
    const labelConfig = createAdvancedLabelConfig(
      widgetParams.showValues,
      widgetParams,
      echartsConfig,
    );

    return processedMetrics.map(({ metric, scatterData, index }) => {
      const style = metricStyles[index] || {};
      const color = style.colors?.[0] || getDefaultColor(index);
      const label = metric.label || generateScatterMetricLabel(metric);

      return {
        type: 'scatter',
        name: label,
        data: scatterData.map(point => [point.x, point.y]),
        symbolSize: style.pointRadius ?? widgetParams.pointRadius ?? 10,
        symbolRotate: scatterConfig?.symbolRotate,
        large: scatterConfig?.large,
        largeThreshold: scatterConfig?.largeThreshold,
        itemStyle: {
          color,
          opacity: style.opacity ?? 0.8,
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
          const p = params as { seriesName?: string; value?: [number, number] };
          return `${p.seriesName || ''}<br/>X: ${p.value?.[0] ?? ''}<br/>Y: ${p.value?.[1] ?? ''}`;
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
