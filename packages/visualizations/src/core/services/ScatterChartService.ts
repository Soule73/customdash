import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import type {
  ScatterMetricConfig,
  ExtendedWidgetParams,
  ScatterDataContext,
  ScatterChartInput,
  ChartValidationResult,
} from '../../interfaces';
import { prepareMetricStyles } from '../../utils/metricStyleUtils';
import { mergeWidgetParams } from '../../utils/widgetParamsUtils';
import {
  processScatterMetrics,
  validateScatterConfiguration,
  generateScatterMetricLabel,
  calculateScatterScales,
} from '../../utils/scatterChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  createAdvancedLabelConfig,
  mergeOptions,
  getDefaultColor,
} from '../../utils/echartsUtils';

/**
 * Service for processing Scatter chart data and configuration
 * Follows the same pattern as ChartDataService but specialized for X/Y metric charts
 */
export class ScatterChartService {
  /**
   * Merge widget params with echarts configuration
   */
  static mergeWidgetParams(config: ScatterChartInput['config']): ExtendedWidgetParams {
    return {
      ...mergeWidgetParams(config.widgetParams),
      echarts: config.echarts,
    };
  }

  /**
   * Validate scatter chart configuration
   */
  static validateConfig(metrics: ScatterMetricConfig[]): ChartValidationResult {
    const result = validateScatterConfiguration(metrics);
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Create the complete data context for scatter chart processing
   */
  static createDataContext(input: ScatterChartInput): ScatterDataContext {
    const widgetParams = this.mergeWidgetParams(input.config);
    const echartsConfig = widgetParams.echarts;
    const scatterConfig = echartsConfig?.scatter;
    const validMetrics = input.config.metrics || [];
    const metricStyles = prepareMetricStyles(input.config.metricStyles);
    const validation = validateScatterConfiguration(validMetrics);
    const processedMetrics = processScatterMetrics(
      input.data,
      validMetrics,
      input.config.globalFilters,
    );
    const scales = calculateScatterScales(input.data, validMetrics);

    return {
      widgetParams,
      echartsConfig,
      scatterConfig,
      validMetrics,
      metricStyles,
      validation,
      processedMetrics,
      scales,
    };
  }

  /**
   * Build series configuration for scatter chart
   */
  static buildSeries(context: ScatterDataContext): ScatterSeriesOption[] {
    const { processedMetrics, metricStyles, widgetParams, echartsConfig, scatterConfig } = context;
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
  }

  /**
   * Build complete ECharts options for scatter chart
   */
  static buildOptions(context: ScatterDataContext, series: ScatterSeriesOption[]): EChartsOption {
    const { widgetParams, echartsConfig, scales } = context;
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
      },
      series,
    });
  }
}
