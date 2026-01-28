import { generateId, setNestedValue, isNestedPath, getNestedValue } from '@customdash/utils';
import type {
  WidgetType,
  WidgetParams,
  MetricStyle,
  Filter,
  AggregationType,
  BucketType,
  FilterOperator,
  Metric,
  MultiBucketConfig,
  ChartConfig,
} from '@customdash/visualizations';
import type { Widget } from '@type/widget.types';
import type {
  MetricConfig,
  BucketConfig,
  WidgetFormConfig,
  FieldSchema,
} from '@type/widget-form.types';
import type { IWidgetConfigSchema, IWidgetDataConfig } from '../interfaces';
import type {
  IWidgetFormService,
  CreateMetricParams,
  CreateBucketParams,
  InitFormConfigParams,
  LoadSourceDataParams,
  LoadSourceDataResult,
} from './IWidgetFormService';
import { widgetRegistry } from '../registry';

const BASE_WIDGET_PARAMS: WidgetParams = {
  title: '',
  titleAlign: 'center',
  legend: true,
  legendPosition: 'top',
  showGrid: true,
  showValues: true,
  labelFontSize: 12,
  labelColor: '#374151',
  format: 'number',
  currency: 'EUR',
  decimals: 2,
};

const DEFAULT_METRIC_STYLE: MetricStyle = {
  color: '#6366f1',
  borderColor: '#4f46e5',
  borderWidth: 1,
};

/**
 * Service implementation for widget form business logic.
 * Centralizes all creation, validation, and transformation logic.
 * Follows Single Responsibility Principle - only handles form-related operations.
 */
export class WidgetFormService implements IWidgetFormService {
  private static instance: WidgetFormService;

  private constructor() {}

  static getInstance(): WidgetFormService {
    if (!WidgetFormService.instance) {
      WidgetFormService.instance = new WidgetFormService();
    }
    return WidgetFormService.instance;
  }

  createMetric(params?: CreateMetricParams): MetricConfig {
    const dataConfig = params?.datasetType ? this.getDataConfigByType(params.datasetType) : null;
    const defaultAgg = dataConfig?.metrics?.defaultAgg || 'sum';

    const columns = params?.columns || [];
    const firstCol = columns[0] || '';
    const secondCol = columns[1] || firstCol;
    const thirdCol = columns[2] || secondCol;

    return {
      id: generateId('metric'),
      field: params?.field || '',
      agg: defaultAgg as AggregationType,
      label: '',
      x: params?.datasetType === 'xy' || params?.datasetType === 'xyr' ? firstCol : undefined,
      y: params?.datasetType === 'xy' || params?.datasetType === 'xyr' ? secondCol : undefined,
      r: params?.datasetType === 'xyr' ? thirdCol : undefined,
      fields: params?.datasetType === 'multiAxis' ? [firstCol, secondCol] : undefined,
    };
  }

  createBucket(params?: CreateBucketParams): BucketConfig {
    return {
      id: generateId('bucket'),
      field: params?.field || '',
      type: 'terms' as BucketType,
      size: 10,
    };
  }

  createFilter(): Filter {
    return {
      field: '',
      operator: 'equals',
      value: '',
    };
  }

  createMetricStyle(): MetricStyle {
    return { ...DEFAULT_METRIC_STYLE };
  }

  createDefaultWidgetParams(type: WidgetType): WidgetParams {
    const baseParams = { ...BASE_WIDGET_PARAMS };
    return this.applySchemaDefaults(type, baseParams);
  }

  createFormConfig(params: InitFormConfigParams): WidgetFormConfig {
    const { type, existingConfig } = params;
    const dataConfig = this.getDataConfig(type);
    const datasetType = dataConfig?.datasetType;

    const config: WidgetFormConfig = {
      metrics: [this.createMetric({ datasetType })],
      buckets: [this.createBucket()],
      globalFilters: [],
      metricStyles: [this.createMetricStyle()],
      widgetParams: this.createDefaultWidgetParams(type),
    };

    if (existingConfig) {
      if (existingConfig.metrics?.length) {
        config.metrics = existingConfig.metrics;
        config.metricStyles = existingConfig.metrics.map(() => this.createMetricStyle());
      }
      if (existingConfig.buckets?.length) {
        config.buckets = existingConfig.buckets;
      }
      if (existingConfig.globalFilters) {
        config.globalFilters = existingConfig.globalFilters;
      }
      if (existingConfig.metricStyles) {
        config.metricStyles = existingConfig.metricStyles;
      }
      if (existingConfig.widgetParams) {
        config.widgetParams = this.applySchemaDefaults(type, {
          ...BASE_WIDGET_PARAMS,
          ...existingConfig.widgetParams,
        });
      }
    }

    return config;
  }

  applySourceData(params: LoadSourceDataParams): LoadSourceDataResult {
    const { columns, datasetType, currentMetrics, currentBuckets } = params;

    const firstCol = columns[0] || '';
    const secondCol = columns[1] || firstCol;
    const thirdCol = columns[2] || secondCol;

    const metrics = currentMetrics.map((metric, index) => {
      const updates: Partial<MetricConfig> = {
        ...metric,
        field: metric.field || (index === 0 ? firstCol : ''),
      };

      if (datasetType === 'xy' || datasetType === 'xyr') {
        updates.x = metric.x || firstCol;
        updates.y = metric.y || secondCol;
      }
      if (datasetType === 'xyr') {
        updates.r = metric.r || thirdCol;
      }
      if (datasetType === 'multiAxis') {
        updates.fields = metric.fields?.length ? metric.fields : [firstCol, secondCol];
      }

      return updates as MetricConfig;
    });

    const buckets = currentBuckets.map((bucket, index) => ({
      ...bucket,
      field: bucket.field || (index === 0 ? firstCol : ''),
    }));

    return { metrics, buckets };
  }

  getConfigSchema(type: WidgetType): IWidgetConfigSchema | undefined {
    return widgetRegistry.getConfigSchema(type);
  }

  getDataConfig(type: WidgetType): IWidgetDataConfig | undefined {
    return widgetRegistry.getDataConfig(type);
  }

  getSchemaDefaults(schema: Record<string, FieldSchema> | undefined): Record<string, unknown> {
    if (!schema) return {};

    const defaults: Record<string, unknown> = {};
    for (const [key, fieldSchema] of Object.entries(schema)) {
      if (fieldSchema.default !== undefined) {
        defaults[key] = fieldSchema.default;
      }
    }
    return defaults;
  }

  applySchemaDefaults(type: WidgetType, existingParams: WidgetParams): WidgetParams {
    const configSchema = this.getConfigSchema(type);
    const schemaDefaults = this.getSchemaDefaults(configSchema?.widgetParams);
    let result: Record<string, unknown> = { ...existingParams };

    for (const [key, value] of Object.entries(schemaDefaults)) {
      if (isNestedPath(key)) {
        const existingValue = getNestedValue(result, key);
        if (existingValue === undefined) {
          result = setNestedValue(result, key, value);
        }
      } else if (result[key] === undefined) {
        result[key] = value;
      }
    }

    return result as WidgetParams;
  }

  setNestedParam(params: WidgetParams, key: string, value: unknown): WidgetParams {
    if (isNestedPath(key)) {
      return setNestedValue(params as Record<string, unknown>, key, value) as WidgetParams;
    }
    return { ...params, [key]: value };
  }

  buildChartConfig(widget: Widget): ChartConfig {
    const { config, type } = widget;
    const isDatasetChart = type === 'scatter' || type === 'bubble' || type === 'radar';

    interface RawMetricConfig {
      field?: string;
      agg?: string;
      label?: string;
      x?: string;
      y?: string;
      r?: string;
      fields?: string[];
    }

    const rawMetrics = (config.metrics || []) as RawMetricConfig[];

    const metrics: Metric[] = rawMetrics
      .filter((m): m is RawMetricConfig => {
        if (isDatasetChart) {
          if (type === 'scatter') return Boolean(m.x && m.y);
          if (type === 'bubble') return Boolean(m.x && m.y && m.r);
          if (type === 'radar') return Boolean(m.fields && m.fields.length > 0);
        }
        return Boolean(m.field);
      })
      .map(m => ({
        field: m.field || '',
        agg: (m.agg || 'count') as AggregationType,
        label: m.label || m.field || '',
        x: m.x,
        y: m.y,
        r: m.r,
        fields: m.fields,
      }));

    const buckets: MultiBucketConfig[] = (config.buckets || [])
      .filter(b => b.field)
      .map(b => ({
        field: b.field,
        type: (b.type || 'terms') as BucketType,
        label: b.label || b.field,
        size: b.size,
        interval: b.interval,
      }));

    const globalFilters: Filter[] = (config.globalFilters || [])
      .filter(f => f.field && f.value !== undefined)
      .map(f => ({
        field: f.field,
        operator: f.operator as FilterOperator,
        value: f.value as string | number | boolean | (string | number)[],
      }));

    const metricStyles = (config.metricStyles || []).map(s => ({ ...s }));

    return {
      metrics,
      buckets,
      globalFilters,
      metricStyles,
      widgetParams: (config.widgetParams || {}) as WidgetParams,
    };
  }

  private getDataConfigByType(datasetType: string): IWidgetDataConfig | undefined {
    const allWidgets = widgetRegistry.getAll();
    for (const widget of allWidgets) {
      const config = widget.getDataConfig();
      if (config.datasetType === datasetType) {
        return config;
      }
    }
    return undefined;
  }
}

export const widgetFormService = WidgetFormService.getInstance();
