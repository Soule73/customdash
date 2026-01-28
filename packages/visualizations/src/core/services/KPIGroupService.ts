import type {
  Metric,
  MetricStyle,
  KPIGroupConfig,
  KPIGroupDataContext,
  KPIGroupInput,
  ChartValidationResult,
} from '../../interfaces';

/**
 * Service for processing KPI Group widget configuration
 * Handles grid layout and individual KPI configurations
 */
export class KPIGroupService {
  /**
   * Validate KPI Group configuration
   */
  static validateConfig(config: KPIGroupConfig): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.metrics || config.metrics.length === 0) {
      errors.push('At least one metric is required');
    }

    if (config.metrics && config.metrics.length > 12) {
      warnings.push('Large number of KPIs may affect readability');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extract column count from config
   */
  static extractColumns(config: KPIGroupConfig): number {
    return (
      (typeof config.widgetParams?.columns === 'number'
        ? config.widgetParams.columns
        : undefined) || 2
    );
  }

  /**
   * Extract group title from config
   */
  static extractGroupTitle(config: KPIGroupConfig): string {
    return (
      (typeof config.widgetParams?.title === 'string' ? config.widgetParams.title : undefined) ||
      'KPI Group'
    );
  }

  /**
   * Extract metrics array from config
   */
  static extractMetrics(config: KPIGroupConfig): Metric[] {
    return Array.isArray(config.metrics) ? config.metrics : [];
  }

  /**
   * Extract metric styles array from config
   */
  static extractMetricStyles(config: KPIGroupConfig): MetricStyle[] {
    return Array.isArray(config.metricStyles) ? config.metricStyles : [];
  }

  /**
   * Build widget params list for each metric
   */
  static buildWidgetParamsList(
    metrics: Metric[],
    metricStyles: MetricStyle[],
    baseParams: Record<string, unknown>,
    hasThemeColors: boolean,
  ): Array<Record<string, unknown>> {
    return metrics.map((metric, idx) => {
      const metricStyle = metricStyles[idx];
      const valueColor = hasThemeColors
        ? baseParams.valueColor
        : metricStyle?.color || baseParams.valueColor;
      return {
        ...baseParams,
        title: metric.label || metric.field || `KPI ${idx + 1}`,
        valueColor,
      };
    });
  }

  /**
   * Calculate responsive grid columns based on window width
   */
  static calculateResponsiveColumns(columns: number, windowWidth: number): number {
    if (windowWidth < 640) {
      return 1;
    }
    return columns;
  }

  /**
   * Create complete data context for KPI Group processing
   */
  static createDataContext(input: KPIGroupInput): KPIGroupDataContext {
    const { config } = input;
    const columns = this.extractColumns(config);
    const groupTitle = this.extractGroupTitle(config);
    const metrics = this.extractMetrics(config);
    const metricStyles = this.extractMetricStyles(config);
    const filters = config.globalFilters;
    const themeColors = config.themeColors;
    const hasThemeColors = Boolean(themeColors?.textColor);
    const configParams = (config.widgetParams as Record<string, unknown>) || {};
    const baseParams = {
      ...configParams,
      ...(themeColors?.textColor ? { valueColor: themeColors.textColor } : {}),
      ...(themeColors?.labelColor ? { titleColor: themeColors.labelColor } : {}),
    };
    const widgetParamsList = this.buildWidgetParamsList(
      metrics,
      metricStyles,
      baseParams,
      hasThemeColors,
    );

    return {
      columns,
      groupTitle,
      metrics,
      metricStyles,
      filters,
      widgetParamsList,
    };
  }
}
