import { useMemo } from 'react';
import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import type {
  ScatterMetricConfig,
  ScatterChartConfig,
  MetricStyle,
  WidgetParams,
  ScatterValidationResult,
} from '../interfaces';
import { prepareMetricStyles } from '../utils/chartDatasetUtils';
import { mergeWidgetParams } from '../utils/widgetParamsUtils';
import {
  processScatterMetrics,
  validateScatterConfiguration,
  generateScatterMetricLabel,
  calculateScatterScales,
} from '../utils/scatterChartUtils';
import { createBaseOptions, mergeOptions } from '../utils/echartsUtils';

export interface ScatterChartVMAE {
  option: EChartsOption;
  validDatasets: ScatterMetricConfig[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ScatterChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ScatterChartConfig;
}

/**
 * Hook to create the ViewModel for a Scatter Chart using Apache ECharts
 */
export function useScatterChartVMAE({ data, config }: ScatterChartWidgetAEProps): ScatterChartVMAE {
  const widgetParams = useMemo<WidgetParams>(() => {
    return mergeWidgetParams(config.widgetParams);
  }, [config.widgetParams]);

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
    return processedMetrics.map(({ metric, scatterData, index }) => {
      const style = metricStyles[index] || {};
      const color = style.colors?.[0] || getDefaultColor(index);
      const label = metric.label || generateScatterMetricLabel(metric);

      return {
        type: 'scatter',
        name: label,
        data: scatterData.map(point => [point.x, point.y]),
        symbolSize: style.pointRadius ?? widgetParams.pointRadius ?? 10,
        itemStyle: {
          color,
          opacity: style.opacity ?? 0.8,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        label: widgetParams.showValues
          ? {
              show: true,
              formatter: (params: { value: [number, number] }) =>
                `(${params.value[0]}, ${params.value[1]})`,
              position: 'top',
              fontSize: widgetParams.labelFontSize ?? 10,
            }
          : undefined,
      } as ScatterSeriesOption;
    });
  }, [processedMetrics, metricStyles, widgetParams]);

  const option = useMemo<EChartsOption>(() => {
    const baseOptions = createBaseOptions(widgetParams);

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
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
      },
      yAxis: {
        type: 'value',
        name: widgetParams.yLabel || 'Y',
        min: scales.yMin,
        max: scales.yMax,
        splitLine: { show: widgetParams.showGrid !== false },
      },
      series,
    });
  }, [widgetParams, scales, series]);

  return {
    option,
    validDatasets: validMetrics,
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}

function getDefaultColor(index: number): string {
  const colors = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
  ];
  return colors[index % colors.length];
}
