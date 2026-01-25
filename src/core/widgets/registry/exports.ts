import type { WidgetType } from '@customdash/visualizations';
import type {
  IWidgetTypeDefinition,
  WidgetComponent,
  IWidgetConfigSchema,
  IWidgetDataConfig,
} from '../interfaces';
import { widgetRegistry } from './WidgetRegistry';

export type { IWidgetTypeDefinition as WidgetTypeDefinition };

export const WIDGET_TYPES: IWidgetTypeDefinition[] = widgetRegistry.getAllDefinitions();

export const WIDGET_COMPONENTS: Record<WidgetType, WidgetComponent> =
  widgetRegistry.getAllComponents();

export function getWidgetConfigSchema(type: WidgetType): IWidgetConfigSchema | undefined {
  return widgetRegistry.getConfigSchema(type);
}

export function getWidgetDataConfig(type: WidgetType): IWidgetDataConfig | undefined {
  return widgetRegistry.getDataConfig(type);
}
