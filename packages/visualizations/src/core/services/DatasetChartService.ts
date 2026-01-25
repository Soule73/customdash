import type {
  Filter,
  MetricStyle,
  ExtendedDatasetParams,
  DatasetMetricConfig,
  DatasetChartContext,
  ChartValidationResult,
} from '../../interfaces';
import type { EChartsWidgetParams } from '../../types/echarts.types';
import { prepareMetricStyles } from '../../utils/metricStyleUtils';
import { mergeWidgetParams } from '../../utils/widgetParamsUtils';
import { applyAllFilters } from '../../utils/filterUtils';

/**
 * Service for dataset chart data processing (Scatter, Bubble, Radar)
 * These charts don't use buckets but instead use x/y/r field mappings
 */
export class DatasetChartService {
  /**
   * Creates context for dataset charts
   */
  static createDataContext<TMetric extends DatasetMetricConfig>(
    data: Record<string, unknown>[],
    config: {
      metrics?: TMetric[];
      metricStyles?: MetricStyle[];
      globalFilters?: Filter[];
      widgetParams?: Record<string, unknown>;
      echarts?: EChartsWidgetParams;
    },
    validateFn: (metrics: TMetric[]) => ChartValidationResult,
  ): DatasetChartContext<TMetric> {
    const params: ExtendedDatasetParams = {
      ...mergeWidgetParams(config.widgetParams),
      echarts: config.echarts,
    };

    const filteredData = applyAllFilters(data, config.globalFilters);
    const metrics = (config.metrics || []) as TMetric[];
    const metricStyles = prepareMetricStyles(config.metricStyles);
    const validation = validateFn(metrics);

    return {
      filteredData,
      metrics,
      metricStyles,
      params,
      validation,
    };
  }

  /**
   * Validates scatter/bubble metrics (x, y required)
   */
  static validateXYMetrics(
    metrics: DatasetMetricConfig[],
    requireR = false,
  ): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (metrics.length === 0) {
      errors.push('At least one dataset must be configured');
      return { isValid: false, errors, warnings };
    }

    metrics.forEach((metric, index) => {
      const metricErrors: string[] = [];

      if (!metric.x?.trim()) {
        metricErrors.push('X field must be specified');
      }
      if (!metric.y?.trim()) {
        metricErrors.push('Y field must be specified');
      }
      if (requireR && !metric.r?.trim()) {
        metricErrors.push('R field (radius) must be specified');
      }

      if (metricErrors.length > 0) {
        errors.push(`Dataset ${index + 1}: ${metricErrors.join(', ')}`);
      }
    });

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validates radar metrics (fields required)
   */
  static validateRadarMetrics(metrics: DatasetMetricConfig[]): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (metrics.length === 0) {
      errors.push('At least one dataset must be configured');
      return { isValid: false, errors, warnings };
    }

    metrics.forEach((metric, index) => {
      const metricErrors: string[] = [];

      if (!metric.fields || metric.fields.length === 0) {
        metricErrors.push('At least one field must be selected');
      }
      if (!metric.agg) {
        metricErrors.push('An aggregation must be specified');
      }

      if (metricErrors.length > 0) {
        errors.push(`Dataset ${index + 1}: ${metricErrors.join(', ')}`);
      }
    });

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Calculates scale bounds from XY data
   */
  static calculateXYScales(
    data: Record<string, unknown>[],
    xField: string,
    yField: string,
  ): { xMin: number; xMax: number; yMin: number; yMax: number } {
    if (data.length === 0) {
      return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
    }

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    data.forEach(row => {
      const x = Number(row[xField]) || 0;
      const y = Number(row[yField]) || 0;

      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y);
      yMax = Math.max(yMax, y);
    });

    if (!isFinite(xMin)) xMin = 0;
    if (!isFinite(xMax)) xMax = 100;
    if (!isFinite(yMin)) yMin = 0;
    if (!isFinite(yMax)) yMax = 100;

    const xMargin = (xMax - xMin) * 0.1;
    const yMargin = (yMax - yMin) * 0.1;

    return {
      xMin: xMin - xMargin,
      xMax: xMax + xMargin,
      yMin: yMin - yMargin,
      yMax: yMax + yMargin,
    };
  }
}
