import type { EChartsOption, RadarSeriesOption } from 'echarts';
import type {
  RadarMetricConfig,
  ExtendedWidgetParams,
  RadarIndicator,
  RadarDataItem,
  RadarDataContext,
  RadarChartInput,
  ChartValidationResult,
} from '../../interfaces';
import { prepareMetricStyles } from '../../utils/metricStyleUtils';
import { mergeWidgetParams } from '../../utils/widgetParamsUtils';
import {
  getRadarLabels,
  processRadarMetrics,
  validateRadarConfiguration,
  generateRadarMetricLabel,
} from '../../utils/radarChartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  mergeOptions,
  getDefaultColor,
} from '../../utils/echartsUtils';

/**
 * Service for processing Radar chart data and configuration
 * Handles multi-dimensional data visualization on a radial grid
 */
export class RadarChartService {
  /**
   * Merge widget params with echarts configuration
   */
  static mergeWidgetParams(config: RadarChartInput['config']): ExtendedWidgetParams {
    return {
      ...mergeWidgetParams(config.widgetParams),
      echarts: config.echarts,
    };
  }

  /**
   * Validate radar chart configuration
   */
  static validateConfig(metrics: RadarMetricConfig[]): ChartValidationResult {
    const result = validateRadarConfiguration(metrics);
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    };
  }

  /**
   * Calculate radar indicators with max values
   */
  static calculateIndicators(
    labels: string[],
    processedMetrics: ReturnType<typeof processRadarMetrics>,
    scaleFactor = 1.2,
  ): RadarIndicator[] {
    const maxValues = labels.map((_, labelIdx) => {
      let max = 0;
      processedMetrics.forEach(({ values }) => {
        if (values[labelIdx] > max) max = values[labelIdx];
      });
      return max * scaleFactor;
    });

    return labels.map((label, idx) => ({
      name: label,
      max: maxValues[idx] || 100,
    }));
  }

  /**
   * Create the complete data context for radar chart processing
   */
  static createDataContext(input: RadarChartInput): RadarDataContext {
    const widgetParams = this.mergeWidgetParams(input.config);
    const echartsConfig = widgetParams.echarts;
    const radarConfig = echartsConfig?.radar;
    const validMetrics = (input.config.metrics || []) as RadarMetricConfig[];
    const metricStyles = prepareMetricStyles(input.config.metricStyles);
    const validation = this.validateConfig(validMetrics);
    const labels = getRadarLabels(validMetrics);
    const processedMetrics = processRadarMetrics(
      input.data,
      validMetrics,
      input.config.globalFilters,
    );
    const radarIndicators = this.calculateIndicators(labels, processedMetrics);

    return {
      widgetParams,
      echartsConfig,
      radarConfig,
      validMetrics,
      metricStyles,
      validation,
      labels,
      processedMetrics,
      radarIndicators,
    };
  }

  /**
   * Build radar data items for series
   */
  static buildRadarData(context: RadarDataContext): RadarDataItem[] {
    const { processedMetrics, metricStyles, echartsConfig, radarConfig } = context;
    const emphasisConfig = createEmphasisOptions(echartsConfig?.emphasis);

    return processedMetrics.map(({ metric, values, index }) => {
      const style = metricStyles[index] || {};
      const color = style.colors?.[0] || getDefaultColor(index);
      const hasAreaStyle = radarConfig?.areaStyle !== false;
      const areaOpacity = radarConfig?.areaOpacity ?? 0.2;

      return {
        name: metric.label || generateRadarMetricLabel(metric),
        value: values,
        itemStyle: { color },
        lineStyle: { color, width: 2 },
        areaStyle: hasAreaStyle ? { color, opacity: areaOpacity } : undefined,
        ...emphasisConfig,
      };
    });
  }

  /**
   * Build series configuration for radar chart
   */
  static buildSeries(context: RadarDataContext): RadarSeriesOption[] {
    const { widgetParams, echartsConfig } = context;
    const radarData = this.buildRadarData(context);

    return [
      {
        type: 'radar',
        data: radarData,
        symbol: widgetParams.showPoints !== false ? 'circle' : 'none',
        symbolSize: widgetParams.pointRadius ?? 4,
        label: {
          show: widgetParams.showValues ?? false,
          formatter: echartsConfig?.labelFormatter,
          fontSize: widgetParams.labelFontSize ?? 11,
          color: widgetParams.labelColor,
        },
      },
    ];
  }

  /**
   * Build complete ECharts options for radar chart
   */
  static buildOptions(context: RadarDataContext, series: RadarSeriesOption[]): EChartsOption {
    const { widgetParams, echartsConfig, radarConfig, radarIndicators } = context;
    const baseOptions = createBaseOptions(widgetParams);

    const radarShape = radarConfig?.shape ?? 'polygon';
    const splitNumber = radarConfig?.splitNumber ?? 5;
    const showAxisName = radarConfig?.axisNameShow !== false;

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
        confine: echartsConfig?.tooltipConfig?.confine ?? true,
      },
      radar: {
        indicator: radarIndicators,
        shape: radarShape,
        splitNumber,
        axisName: showAxisName
          ? {
              color: '#666',
              fontSize: 12,
            }
          : { show: false },
        splitLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' },
        },
        splitArea: {
          show: true,
          areaStyle: { color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'] },
        },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' },
        },
      },
      series,
    });
  }
}
