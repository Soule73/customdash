import type {
  WidgetParams,
  ChartConfig,
  ProcessedData,
  ChartDataContext,
  ExtendedWidgetParams,
  ChartValidationResult,
  BaseChartConfig,
  MultiBucketConfig,
  ThemeColors,
} from '../../interfaces';
import type { EChartsWidgetParams } from '../../types/echarts.types';
import { applyAllFilters } from '../../utils/filterUtils';
import { processMultiBucketData } from '../../utils/multiBucketProcessor';
import { getLabels } from '../../utils/chartUtils';

/**
 * Service for common chart data processing operations
 * Implements the Strategy pattern for different chart types
 */
export class ChartDataService {
  /**
   * Merges widget params from multiple sources with proper precedence
   */
  static mergeWidgetParams(
    config: ChartConfig & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors },
    widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors },
  ): ExtendedWidgetParams {
    return {
      ...config.widgetParams,
      ...widgetParams,
      echarts: {
        ...config.widgetParams?.echarts,
        ...(config as { echarts?: EChartsWidgetParams }).echarts,
        ...widgetParams?.echarts,
      },
      themeColors: {
        ...config.themeColors,
        ...widgetParams?.themeColors,
      },
    };
  }

  /**
   * Applies filters and processes bucket data
   */
  static processChartData(
    data: Record<string, unknown>[],
    config: ChartConfig,
  ): { filteredData: Record<string, unknown>[]; processedData: ProcessedData | null } {
    const filteredData = applyAllFilters(data, config.globalFilters);

    let processedData: ProcessedData | null = null;
    if (config.buckets && config.buckets.length > 0) {
      processedData = processMultiBucketData(filteredData, config);
    }

    return { filteredData, processedData };
  }

  /**
   * Extracts labels from processed data or raw data
   */
  static extractLabels(
    filteredData: Record<string, unknown>[],
    processedData: ProcessedData | null,
    bucketField: string,
  ): string[] {
    if (processedData) {
      return processedData.labels;
    }
    return getLabels(filteredData, bucketField);
  }

  /**
   * Creates full chart data context for rendering
   */
  static createDataContext(
    data: Record<string, unknown>[],
    config: ChartConfig & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors },
    widgetParams?: WidgetParams & { echarts?: EChartsWidgetParams; themeColors?: ThemeColors },
  ): ChartDataContext {
    const params = this.mergeWidgetParams(config, widgetParams);
    const { filteredData, processedData } = this.processChartData(data, config);
    const bucketField = config.buckets?.[0]?.field || '';
    const labels = this.extractLabels(filteredData, processedData, bucketField);

    return {
      filteredData,
      processedData,
      labels,
      metrics: config.metrics || [],
      metricStyles: config.metricStyles || [],
      params,
    };
  }

  /**
   * Validates basic bucket chart configuration
   * Checks for required metrics and buckets
   */
  static validateBucketChartConfig(
    config: BaseChartConfig & { metrics?: unknown[]; buckets?: MultiBucketConfig[] },
  ): ChartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.metrics || config.metrics.length === 0) {
      errors.push('At least one metric must be configured');
    }

    if (!config.buckets || config.buckets.length === 0) {
      errors.push('At least one bucket must be configured');
    } else if (!config.buckets[0]?.field) {
      errors.push('Bucket field must be specified');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
