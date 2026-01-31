import type { ComponentType } from 'react';
import type {
  WidgetType,
  ChartConfig,
  SelectOption,
  AggregationType,
  BucketType,
} from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';

export interface WidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  editMode?: boolean;
}

export type WidgetComponent = ComponentType<WidgetComponentProps>;

export type WidgetCategory = 'chart' | 'metric' | 'data';

/**
 * Defines the visual representation and metadata of a widget type
 */
export interface IWidgetTypeDefinition {
  readonly type: WidgetType;
  readonly label: string;
  readonly description: string;
  readonly icon: ComponentType<{ className?: string }>;
  readonly category: WidgetCategory;
}

/**
 * Defines the configuration schema for widget parameters and styles
 */
export interface IWidgetConfigSchema {
  readonly metricStyles: Record<string, FieldSchema>;
  readonly widgetParams: Record<string, FieldSchema>;
}

/**
 * Defines metrics configuration for data aggregation
 */
export interface IMetricsConfig {
  readonly allowMultiple: boolean;
  readonly minRequired?: number;
  readonly defaultAgg: AggregationType;
  readonly allowedAggs: SelectOption<AggregationType>[];
  readonly label: string;
  readonly description?: string;
}

/**
 * Defines bucket configuration for data grouping
 */
export interface IBucketsConfig {
  readonly allow: boolean;
  readonly allowMultiple: boolean;
  readonly label: string;
  readonly allowedTypes: SelectOption<BucketType>[];
}

/**
 * Defines the data configuration for a widget type
 */
export interface IWidgetDataConfig {
  readonly metrics: IMetricsConfig;
  readonly buckets?: IBucketsConfig;
  readonly datasetType?: 'xy' | 'xyr' | 'multiAxis' | 'metric';
  readonly useMetricSection?: boolean;
  readonly useDatasetSection?: boolean;
  readonly useGlobalFilters?: boolean;
  readonly useBuckets?: boolean;
  readonly useGroupBy?: boolean;
  readonly allowMultipleMetrics?: boolean;
  readonly allowMultipleDatasets?: boolean;
  readonly datasetSectionTitle?: string;
}

/**
 * Main interface for widget type registration
 */
export interface IWidgetType {
  getDefinition(): IWidgetTypeDefinition;
  getComponent(): WidgetComponent;
  getConfigSchema(): IWidgetConfigSchema;
  getDataConfig(): IWidgetDataConfig;
}
