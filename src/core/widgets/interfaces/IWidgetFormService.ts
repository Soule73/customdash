import type {
  WidgetType,
  WidgetParams,
  MetricStyle,
  Filter,
  ChartConfig,
} from '@customdash/visualizations';
import type {
  MetricConfig,
  BucketConfig,
  WidgetFormConfig,
  FieldSchema,
} from '@type/widget-form.types';
import type { Widget } from '@type/widget.types';
import type { IWidgetConfigSchema, IWidgetDataConfig } from '.';

/**
 * Parameters for creating a new metric configuration
 */
export interface CreateMetricParams {
  field?: string;
  columns?: string[];
  datasetType?: 'xy' | 'xyr' | 'multiAxis' | 'metric';
}

/**
 * Parameters for creating a new bucket configuration
 */
export interface CreateBucketParams {
  field?: string;
}

/**
 * Parameters for initializing widget form configuration
 */
export interface InitFormConfigParams {
  type: WidgetType;
  existingConfig?: Partial<WidgetFormConfig>;
}

/**
 * Parameters for loading source data into form
 */
export interface LoadSourceDataParams {
  columns: string[];
  datasetType?: 'xy' | 'xyr' | 'multiAxis' | 'metric';
  currentMetrics: MetricConfig[];
  currentBuckets: BucketConfig[];
}

/**
 * Result of loading source data
 */
export interface LoadSourceDataResult {
  metrics: MetricConfig[];
  buckets: BucketConfig[];
}

/**
 * Service interface for widget form business logic.
 * Centralizes all logic for creating, validating, and transforming widget configurations.
 * Uses the WidgetRegistry internally for type-specific behavior.
 */
export interface IWidgetFormService {
  createMetric(params?: CreateMetricParams): MetricConfig;

  createBucket(params?: CreateBucketParams): BucketConfig;

  createFilter(): Filter;

  createMetricStyle(): MetricStyle;

  createDefaultWidgetParams(type: WidgetType): WidgetParams;

  createFormConfig(params: InitFormConfigParams): WidgetFormConfig;

  applySourceData(params: LoadSourceDataParams): LoadSourceDataResult;

  getConfigSchema(type: WidgetType): IWidgetConfigSchema | undefined;

  getDataConfig(type: WidgetType): IWidgetDataConfig | undefined;

  getSchemaDefaults(schema: Record<string, FieldSchema> | undefined): Record<string, unknown>;

  applySchemaDefaults(type: WidgetType, existingParams: WidgetParams): WidgetParams;

  setNestedParam(params: WidgetParams, key: string, value: unknown): WidgetParams;

  buildChartConfig(widget: Widget): ChartConfig;
}
