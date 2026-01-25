import type {
  KPIConfig,
  FilterableConfig,
  ParsedKPIWidgetParams,
  KPITrendResult,
  KPIDataContext,
  KPIProcessedResult,
  KPIWidgetInput,
  ChartValidationResult,
} from '../../interfaces';
import type { TrendDirection } from '../../types';
import {
  applyKPIFilters,
  calculateKPIValue,
  calculateKPITrend,
  formatValue,
  getKPITrendColor,
  getKPITitle,
  getKPIValueColor,
  getKPIWidgetParams,
} from '../../utils';

/**
 * Service for processing KPI widget data and configuration
 * Handles value calculation, formatting, and trend analysis
 */
export class KPIWidgetService {
  /**
   * Validate KPI configuration
   */
  static validateConfig(config: KPIConfig): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.metrics || config.metrics.length === 0) {
      errors.push('At least one metric is required');
    }

    const metric = config.metrics?.[0];
    if (metric && !metric.field) {
      errors.push('Metric field is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Apply filters to data
   */
  static applyFilters(
    data: Record<string, unknown>[],
    config: KPIConfig,
  ): Record<string, unknown>[] {
    return applyKPIFilters(data, config as FilterableConfig);
  }

  /**
   * Extract widget parameters from config
   */
  static extractWidgetParams(config: KPIConfig): ParsedKPIWidgetParams {
    return getKPIWidgetParams(config);
  }

  /**
   * Create data context for KPI processing
   */
  static createDataContext(input: KPIWidgetInput): KPIDataContext {
    const filteredData = this.applyFilters(input.data, input.config);
    const metric = input.config.metrics?.[0];
    const widgetParams = this.extractWidgetParams(input.config);
    const title = getKPITitle(input.config, metric, 'KPI');
    const valueColor = getKPIValueColor(input.config);
    const titleColor = input.config.widgetParams?.titleColor || '#2563eb';

    return {
      filteredData,
      metric,
      widgetParams,
      title,
      valueColor,
      titleColor,
    };
  }

  /**
   * Calculate and format KPI value
   */
  static calculateValue(context: KPIDataContext): number | string {
    const { metric, filteredData, widgetParams } = context;
    const kpiValue = calculateKPIValue(metric, filteredData);
    return formatValue(kpiValue, widgetParams.format, {
      decimals: widgetParams.decimals,
      currency: widgetParams.currency,
    });
  }

  /**
   * Calculate trend information
   */
  static calculateTrend(context: KPIDataContext): KPITrendResult {
    const { metric, filteredData, widgetParams } = context;
    return calculateKPITrend(metric, filteredData, widgetParams.showTrend);
  }

  /**
   * Get trend color based on direction and threshold
   */
  static getTrendColor(trend: TrendDirection, trendPercent: number, threshold: number): string {
    return getKPITrendColor(trend, trendPercent, threshold);
  }

  /**
   * Process complete KPI data and return all computed values
   */
  static process(input: KPIWidgetInput): KPIProcessedResult {
    const context = this.createDataContext(input);
    const value = this.calculateValue(context);
    const trendResult = this.calculateTrend(context);
    const trendColor = this.getTrendColor(
      trendResult.trend,
      trendResult.trendPercent,
      context.widgetParams.threshold,
    );

    return {
      value,
      title: context.title,
      valueColor: context.valueColor,
      titleColor: context.titleColor,
      showTrend: context.widgetParams.showTrend,
      showValue: context.widgetParams.showValue,
      trendType: context.widgetParams.trendType,
      showPercent: context.widgetParams.showPercent,
      trend: trendResult.trend,
      trendValue: trendResult.trendValue,
      trendPercent: trendResult.trendPercent,
      trendColor,
    };
  }
}
