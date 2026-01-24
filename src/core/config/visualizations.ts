import type { WidgetType, ChartConfig } from '@customdash/visualizations';
import type { DataConfigEntry, FieldSchema } from '@type/widget-form.types';
import { widgetRegistry, type IWidgetTypeDefinition, type WidgetCategory } from '../widgets';

interface WidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
}

type WidgetComponent = React.ComponentType<WidgetComponentProps>;

export { AGGREGATION_OPTIONS, BUCKET_TYPE_OPTIONS, DEFAULT_CHART_COLORS } from '../widgets/schemas';

export interface WidgetTypeDefinition {
  type: WidgetType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'chart' | 'metric' | 'data';
}

function mapToLegacyDefinition(def: IWidgetTypeDefinition): WidgetTypeDefinition {
  return {
    type: def.type,
    label: def.label,
    description: def.description,
    icon: def.icon,
    category: def.category as WidgetCategory,
  };
}

/**
 * Returns the list of all widget type definitions.
 * Uses the WidgetRegistry internally.
 */
export const WIDGET_TYPES: WidgetTypeDefinition[] = widgetRegistry
  .getAllDefinitions()
  .map(mapToLegacyDefinition);

/**
 * Returns all widget components mapped by type.
 * Uses the WidgetRegistry internally.
 */
export const WIDGET_COMPONENTS: Record<WidgetType, WidgetComponent> = (() => {
  const components = {} as Record<WidgetType, WidgetComponent>;
  for (const widget of widgetRegistry.getAll()) {
    const def = widget.getDefinition();
    components[def.type] = widget.getComponent();
  }
  return components;
})();

/**
 * Returns all widget config schemas mapped by type.
 * Uses the WidgetRegistry internally.
 */
export const WIDGET_CONFIG_SCHEMAS: Record<
  WidgetType,
  {
    metricStyles: Record<string, FieldSchema>;
    widgetParams: Record<string, FieldSchema>;
  }
> = (() => {
  const schemas = {} as Record<
    WidgetType,
    { metricStyles: Record<string, FieldSchema>; widgetParams: Record<string, FieldSchema> }
  >;
  for (const widget of widgetRegistry.getAll()) {
    const def = widget.getDefinition();
    const configSchema = widget.getConfigSchema();
    schemas[def.type] = {
      metricStyles: configSchema.metricStyles,
      widgetParams: configSchema.widgetParams,
    };
  }
  return schemas;
})();

/**
 * Returns all widget data configs mapped by type.
 * Uses the WidgetRegistry internally.
 */
export const WIDGET_DATA_CONFIG: Record<WidgetType, DataConfigEntry> = (() => {
  const configs = {} as Record<WidgetType, DataConfigEntry>;
  for (const widget of widgetRegistry.getAll()) {
    const def = widget.getDefinition();
    const dataConfig = widget.getDataConfig();
    configs[def.type] = {
      metrics: dataConfig.metrics,
      buckets: dataConfig.buckets,
      datasetType: dataConfig.datasetType,
      useMetricSection: dataConfig.useMetricSection,
      useDatasetSection: dataConfig.useDatasetSection,
      useGlobalFilters: dataConfig.useGlobalFilters,
      useBuckets: dataConfig.useBuckets,
      allowMultipleMetrics: dataConfig.allowMultipleMetrics,
      allowMultipleDatasets: dataConfig.allowMultipleDatasets,
      datasetSectionTitle: dataConfig.datasetSectionTitle,
    } as DataConfigEntry;
  }
  return configs;
})();

/**
 * Gets the widget type definition for a specific type
 */
export function getWidgetTypeDefinition(type: WidgetType): WidgetTypeDefinition | undefined {
  const widget = widgetRegistry.get(type);
  if (!widget) return undefined;
  return mapToLegacyDefinition(widget.getDefinition());
}

/**
 * Gets the config schema for a specific widget type
 */
export function getWidgetConfigSchema(type: WidgetType) {
  return widgetRegistry.getConfigSchema(type);
}

/**
 * Gets the data config for a specific widget type
 */
export function getWidgetDataConfig(type: WidgetType) {
  return widgetRegistry.getDataConfig(type);
}

export {
  LEGEND_POSITION_OPTIONS,
  TITLE_ALIGN_OPTIONS,
  FORMAT_OPTIONS,
  POINT_STYLE_OPTIONS,
  TREND_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  COMMON_METRIC_STYLES,
  COMMON_WIDGET_PARAMS,
} from '../widgets/schemas/CommonSchemas';

export {
  ANIMATION_EASING_OPTIONS,
  TOOLTIP_TRIGGER_OPTIONS,
  EMPHASIS_FOCUS_OPTIONS,
  LABEL_POSITION_OPTIONS,
  ROSE_TYPE_OPTIONS,
  LINE_STEP_OPTIONS,
  SYMBOL_TYPE_OPTIONS,
  RADAR_SHAPE_OPTIONS,
  DATAZOOM_TYPE_OPTIONS,
  GRADIENT_DIRECTION_OPTIONS,
  ECHARTS_COMMON_PARAMS,
  ECHARTS_BAR_PARAMS,
  ECHARTS_LINE_PARAMS,
  ECHARTS_PIE_PARAMS,
  ECHARTS_RADAR_PARAMS,
  ECHARTS_SCATTER_PARAMS,
} from '../widgets/schemas/EChartsSchemas';
