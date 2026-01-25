import type { EChartsOption, ScatterSeriesOption } from 'echarts';
import type {
  BubbleMetricConfig,
  ExtendedWidgetParams,
  BubbleDataContext,
  BubbleChartInput,
  ChartValidationResult,
} from '../../interfaces';
import { prepareMetricStyles } from '../../utils/metricStyleUtils';
import { mergeWidgetParams } from '../../utils/widgetParamsUtils';
import {
  processBubbleMetrics,
  validateBubbleConfiguration,
  generateBubbleMetricLabel,
  calculateBubbleScales,
} from '../../utils/bubbleChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  createAdvancedLabelConfig,
  createGradientColor,
  mergeOptions,
  getDefaultColor,
} from '../../utils/echartsUtils';

/**
 * Service for processing Bubble chart data and configuration
 * Extends scatter chart functionality with size dimension
 */
export class BubbleChartService {
  /**
   * Merge widget params with echarts configuration
   */
  static mergeWidgetParams(config: BubbleChartInput['config']): ExtendedWidgetParams {
    return {
      ...mergeWidgetParams(config.widgetParams),
      echarts: config.echarts,
    };
  }

  /**
   * Validate bubble chart configuration
   */
  static validateConfig(metrics: BubbleMetricConfig[]): ChartValidationResult {
    const result = validateBubbleConfiguration(metrics);
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Create the complete data context for bubble chart processing
   */
  static createDataContext(input: BubbleChartInput): BubbleDataContext {
    const widgetParams = this.mergeWidgetParams(input.config);
    const echartsConfig = widgetParams.echarts;
    const scatterConfig = echartsConfig?.scatter;
    const validMetrics = input.config.metrics || [];
    const metricStyles = prepareMetricStyles(input.config.metricStyles);
    const validation = validateBubbleConfiguration(validMetrics);
    const processedMetrics = processBubbleMetrics(
      input.data,
      validMetrics,
      input.config.globalFilters,
    );
    const scales = calculateBubbleScales(input.data, validMetrics);

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
   * Calculate symbol size based on radius value
   */
  static calculateSymbolSize(
    radius: number,
    maxRadius: number,
    minSize = 10,
    maxSize = 50,
  ): number {
    const safeMaxRadius = maxRadius || 1;
    return minSize + (radius / safeMaxRadius) * (maxSize - minSize);
  }

  /**
   * Build series configuration for bubble chart
   */
  static buildSeries(context: BubbleDataContext): ScatterSeriesOption[] {
    const { processedMetrics, metricStyles, widgetParams, echartsConfig, scatterConfig } = context;
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

      return {
        type: 'scatter',
        name: label,
        data: bubbleData.map(point => ({
          value: [point.x, point.y],
          symbolSize: this.calculateSymbolSize(point.r, maxR),
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
  }

  /**
   * Build complete ECharts options for bubble chart
   */
  static buildOptions(context: BubbleDataContext, series: ScatterSeriesOption[]): EChartsOption {
    const { widgetParams, echartsConfig, scales } = context;
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
      },
      series,
    });
  }
}
