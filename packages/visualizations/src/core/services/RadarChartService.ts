import type { EChartsOption, RadarSeriesOption } from 'echarts';
import type {
  Metric,
  MetricStyle,
  RadarChartConfig,
  ExtendedWidgetParams,
  ChartValidationResult,
  ThemeColors,
} from '../../interfaces';
import type { EChartsWidgetParams, RadarSpecificConfig } from '../../types/echarts.types';
import { applyAllFilters } from '../../utils/filterUtils';
import { aggregate } from '../../utils/chartUtils';
import {
  createBaseOptions,
  createEmphasisOptions,
  createAdvancedLegendOptions,
  mergeOptions,
  getDefaultColor,
  createGradientColor,
} from '../../utils/echartsUtils';

export interface RadarIndicator {
  name: string;
  max: number;
}

export interface RadarSeriesData {
  name: string;
  value: number[];
  color: string;
}

export interface RadarDataResult {
  indicators: RadarIndicator[];
  seriesData: RadarSeriesData[];
}

export interface RadarChartInput {
  data: Record<string, unknown>[];
  config: RadarChartConfig & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors };
}

export interface RadarDataContext {
  filteredData: Record<string, unknown>[];
  metrics: Metric[];
  metricStyles: MetricStyle[];
  groupBy?: string;
  params: ExtendedWidgetParams;
  validation: ChartValidationResult;
}

/**
 * Service for processing Radar chart data and configuration
 * Supports two modes:
 * - Global aggregation (default): One polygon with aggregated metrics
 * - GroupBy mode: Multiple polygons, one per group value
 */
export class RadarChartService {
  /**
   * Validate radar chart configuration
   */
  static validateConfig(metrics: Metric[]): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!metrics || metrics.length === 0) {
      errors.push('Au moins une metrique doit etre configuree');
    } else {
      metrics.forEach((m, idx) => {
        if (!m.field) {
          errors.push(`Metrique ${idx + 1}: le champ est requis`);
        }
      });

      if (metrics.length < 3) {
        warnings.push('Un radar fonctionne mieux avec au moins 3 axes');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Create the data context for radar chart processing
   */
  static createDataContext(
    input: RadarChartInput,
    widgetParams?: ExtendedWidgetParams,
  ): RadarDataContext {
    const filteredData = applyAllFilters(input.data, input.config.globalFilters);
    const metrics = input.config.metrics || [];
    const metricStyles = input.config.metricStyles || [];
    const groupBy = input.config.groupBy;

    const params: ExtendedWidgetParams = {
      ...input.config.widgetParams,
      ...widgetParams,
      echarts: {
        ...input.config.widgetParams?.echarts,
        ...input.config.echarts,
        ...widgetParams?.echarts,
      },
      themeColors: {
        ...input.config.themeColors,
        ...widgetParams?.themeColors,
      },
    };

    const validation = this.validateConfig(metrics);

    return {
      filteredData,
      metrics,
      metricStyles,
      groupBy,
      params,
      validation,
    };
  }

  /**
   * Compute radar data - handles both global aggregation and groupBy modes
   */
  static computeRadarData(context: RadarDataContext): RadarDataResult {
    const { metrics, filteredData, groupBy, metricStyles } = context;

    if (!metrics || metrics.length === 0) {
      return this.getDefaultRadarData();
    }

    const validMetrics = metrics.filter(m => m.field);
    if (validMetrics.length === 0) {
      return this.getDefaultRadarData();
    }

    const labels = validMetrics.map(m => m.label || `${m.agg}(${m.field})`);

    if (groupBy && groupBy.trim() !== '') {
      return this.computeGroupedRadarData(
        filteredData,
        validMetrics,
        groupBy,
        labels,
        metricStyles,
      );
    }

    return this.computeGlobalRadarData(filteredData, validMetrics, labels, metricStyles);
  }

  /**
   * Compute global aggregation mode - one polygon
   */
  private static computeGlobalRadarData(
    data: Record<string, unknown>[],
    metrics: Metric[],
    labels: string[],
    metricStyles: MetricStyle[],
  ): RadarDataResult {
    const values = metrics.map(m => aggregate(data, m.agg, m.field));
    const indicators = labels.map((name, idx) => ({
      name,
      max: (values[idx] || 1) * 1.2,
    }));

    const style = metricStyles[0] || {};
    const color = style.colors?.[0] || getDefaultColor(0);

    return {
      indicators,
      seriesData: [{ name: 'Total', value: values, color }],
    };
  }

  /**
   * Compute groupBy mode - one polygon per group
   */
  private static computeGroupedRadarData(
    data: Record<string, unknown>[],
    metrics: Metric[],
    groupBy: string,
    labels: string[],
    metricStyles: MetricStyle[],
  ): RadarDataResult {
    const groups = new Map<string, Record<string, unknown>[]>();

    data.forEach(row => {
      const groupValue = String(row[groupBy] ?? 'N/A');
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(row);
    });

    const seriesData: RadarSeriesData[] = [];
    const allValues: number[][] = [];

    let colorIndex = 0;
    groups.forEach((groupData, groupName) => {
      const values = metrics.map(m => aggregate(groupData, m.agg, m.field));
      allValues.push(values);

      const style = metricStyles[colorIndex] || {};
      const color = style.colors?.[0] || getDefaultColor(colorIndex);

      seriesData.push({ name: groupName, value: values, color });
      colorIndex++;
    });

    const indicators = labels.map((name, idx) => {
      const maxForAxis = Math.max(...allValues.map(vals => vals[idx] || 0), 1);
      return { name, max: maxForAxis * 1.2 };
    });

    return { indicators, seriesData };
  }

  /**
   * Default data when no metrics are configured
   */
  private static getDefaultRadarData(): RadarDataResult {
    return {
      indicators: [
        { name: 'Axis 1', max: 100 },
        { name: 'Axis 2', max: 100 },
        { name: 'Axis 3', max: 100 },
      ],
      seriesData: [{ name: 'Data', value: [0, 0, 0], color: getDefaultColor(0) }],
    };
  }

  /**
   * Build ECharts series configuration
   */
  static buildSeries(context: RadarDataContext, radarData: RadarDataResult): RadarSeriesOption[] {
    const { params } = context;
    const echartsConfig = params.echarts;
    const radarConfig = echartsConfig?.radar as RadarSpecificConfig | undefined;
    const emphasisConfig = createEmphasisOptions(echartsConfig?.emphasis);

    const hasAreaStyle = radarConfig?.areaStyle !== false;
    const areaOpacity = radarConfig?.areaOpacity ?? 0.25;

    const dataItems = radarData.seriesData.map(item => {
      const baseColor = item.color;
      const color = echartsConfig?.gradient?.enabled
        ? createGradientColor(baseColor, { ...echartsConfig.gradient, direction: 'radial' })
        : baseColor;

      return {
        name: item.name,
        value: item.value,
        itemStyle: { color: baseColor },
        lineStyle: { color: baseColor, width: 2 },
        areaStyle: hasAreaStyle ? { color: color as string, opacity: areaOpacity } : undefined,
        ...emphasisConfig,
      };
    });

    return [
      {
        type: 'radar' as const,
        data: dataItems,
        symbol: params.showPoints !== false ? 'circle' : 'none',
        symbolSize: params.pointRadius ?? 6,
        label: {
          show: params.showValues ?? false,
          formatter: echartsConfig?.labelFormatter ?? '{c}',
          fontSize: params.labelFontSize ?? 11,
          color: params.labelColor,
        },
      },
    ];
  }

  /**
   * Build complete ECharts options for radar chart
   */
  static buildOptions(
    context: RadarDataContext,
    radarData: RadarDataResult,
    series: RadarSeriesOption[],
  ): EChartsOption {
    const { params } = context;
    const echartsConfig = params.echarts;
    const radarConfig = echartsConfig?.radar as RadarSpecificConfig | undefined;
    const themeColors = params.themeColors;

    const baseOptions = createBaseOptions(params);
    const radarShape = radarConfig?.shape ?? 'polygon';
    const splitNumber = radarConfig?.splitNumber ?? 5;
    const showAxisName = radarConfig?.axisNameShow !== false;

    return mergeOptions(baseOptions, {
      tooltip: {
        trigger: 'item',
        confine: echartsConfig?.tooltipConfig?.confine ?? true,
      },
      legend: createAdvancedLegendOptions(echartsConfig?.legendConfig, params, themeColors),
      radar: {
        indicator: radarData.indicators,
        shape: radarShape,
        splitNumber,
        center: ['50%', '55%'],
        radius: '65%',
        axisName: showAxisName
          ? {
              color: themeColors?.labelColor ?? '#666',
              fontSize: 12,
            }
          : { show: false },
        splitLine: {
          lineStyle: { color: themeColors?.gridColor ?? 'rgba(0, 0, 0, 0.1)' },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
          },
        },
        axisLine: {
          lineStyle: { color: themeColors?.gridColor ?? 'rgba(0, 0, 0, 0.1)' },
        },
      },
      series,
    });
  }
}
