import type { ComponentType } from 'react';
import type {
  WidgetType,
  SelectOption,
  AggregationType,
  BucketType,
} from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IWidgetType,
  IWidgetTypeDefinition,
  IWidgetConfigSchema,
  IWidgetDataConfig,
  IMetricsConfig,
  IBucketsConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { SelectOptionFactory } from '../factories';
import { AGGREGATION_TYPES, BUCKET_TYPES } from '../constants';

/**
 * Abstract base class for all widget types implementing the Template Method pattern.
 * Subclasses must implement abstract methods to define their specific configuration.
 */
export abstract class AbstractWidgetType implements IWidgetType {
  protected abstract readonly widgetType: WidgetType;
  protected abstract get widgetLabel(): string;
  protected abstract get widgetDescription(): string;
  protected abstract readonly widgetIcon: ComponentType<{ className?: string }>;
  protected abstract readonly widgetCategory: WidgetCategory;
  protected abstract readonly widgetComponent: WidgetComponent;

  protected abstract buildMetricStyles(): Record<string, FieldSchema>;
  protected abstract buildWidgetParams(): Record<string, FieldSchema>;
  protected abstract buildMetricsConfig(): Partial<IMetricsConfig>;
  protected abstract buildBucketsConfig(): Partial<IBucketsConfig> | null;
  protected abstract buildDataConfigOptions(): Partial<IWidgetDataConfig>;

  getDefinition(): IWidgetTypeDefinition {
    return {
      type: this.widgetType,
      label: this.widgetLabel,
      description: this.widgetDescription,
      icon: this.widgetIcon,
      category: this.widgetCategory,
    };
  }

  getComponent(): WidgetComponent {
    return this.widgetComponent;
  }

  getConfigSchema(): IWidgetConfigSchema {
    return {
      metricStyles: this.buildMetricStyles(),
      widgetParams: this.buildWidgetParams(),
    };
  }

  getDataConfig(): IWidgetDataConfig {
    const metricsConfig = this.buildMetricsConfig();
    const bucketsConfig = this.buildBucketsConfig();
    const options = this.buildDataConfigOptions();

    return {
      metrics: this.createMetricsConfig(metricsConfig),
      buckets: bucketsConfig ? this.createBucketsConfig(bucketsConfig) : undefined,
      ...options,
    };
  }

  protected getDefaultAggregationOptions(): SelectOption<AggregationType>[] {
    return SelectOptionFactory.createFromI18nKeys(
      AGGREGATION_TYPES,
      'widgets.options.aggregations',
    );
  }

  protected getDefaultBucketTypeOptions(): SelectOption<BucketType>[] {
    return SelectOptionFactory.createFromI18nKeys(BUCKET_TYPES, 'widgets.options.bucketTypes');
  }

  private createMetricsConfig(partial: Partial<IMetricsConfig>): IMetricsConfig {
    return {
      allowMultiple: partial.allowMultiple ?? true,
      defaultAgg: partial.defaultAgg ?? 'sum',
      allowedAggs: partial.allowedAggs ?? this.getDefaultAggregationOptions(),
      label: partial.label ?? 'Metrics',
    };
  }

  private createBucketsConfig(partial: Partial<IBucketsConfig>): IBucketsConfig {
    return {
      allow: partial.allow ?? true,
      allowMultiple: partial.allowMultiple ?? true,
      label: partial.label ?? 'Buckets',
      allowedTypes: partial.allowedTypes ?? this.getDefaultBucketTypeOptions(),
    };
  }
}
