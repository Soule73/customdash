import type { WidgetType } from '@customdash/visualizations';
import type { IWidgetType, IWidgetTypeDefinition } from '../interfaces';

import {
  BarWidgetType,
  LineWidgetType,
  PieWidgetType,
  ScatterWidgetType,
  BubbleWidgetType,
  RadarWidgetType,
  KPIWidgetType,
  KPIGroupWidgetType,
  CardWidgetType,
  TableWidgetType,
} from '../implementations';

/**
 * Singleton registry for widget types following the Registry pattern.
 * Provides centralized access to all widget type implementations.
 */
export class WidgetRegistry {
  private static instance: WidgetRegistry | null = null;
  private readonly widgets: Map<WidgetType, IWidgetType> = new Map();
  private initialized = false;

  private constructor() {}

  /**
   * Gets the singleton instance of the registry
   */
  static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
      WidgetRegistry.instance.initializeDefaultWidgets();
    }
    return WidgetRegistry.instance;
  }

  /**
   * Registers a widget type in the registry
   */
  register(widget: IWidgetType): void {
    const definition = widget.getDefinition();
    this.widgets.set(definition.type, widget);
  }

  /**
   * Gets a widget type by its identifier
   */
  get(type: WidgetType): IWidgetType | undefined {
    return this.widgets.get(type);
  }

  /**
   * Gets all registered widget types
   */
  getAll(): IWidgetType[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Gets all widget type definitions
   */
  getAllDefinitions(): IWidgetTypeDefinition[] {
    return this.getAll().map(widget => widget.getDefinition());
  }

  /**
   * Checks if a widget type is registered
   */
  has(type: WidgetType): boolean {
    return this.widgets.has(type);
  }

  /**
   * Gets the config schema for a widget type
   */
  getConfigSchema(type: WidgetType) {
    const widget = this.get(type);
    return widget?.getConfigSchema();
  }

  /**
   * Gets the data config for a widget type
   */
  getDataConfig(type: WidgetType) {
    const widget = this.get(type);
    return widget?.getDataConfig();
  }

  /**
   * Gets all components as a record keyed by widget type
   */
  getAllComponents(): Record<WidgetType, ReturnType<IWidgetType['getComponent']>> {
    const components = {} as Record<WidgetType, ReturnType<IWidgetType['getComponent']>>;
    for (const widget of this.getAll()) {
      const def = widget.getDefinition();
      components[def.type] = widget.getComponent();
    }
    return components;
  }

  private initializeDefaultWidgets(): void {
    if (this.initialized) return;

    this.register(new BarWidgetType());
    this.register(new LineWidgetType());
    this.register(new PieWidgetType());
    this.register(new ScatterWidgetType());
    this.register(new BubbleWidgetType());
    this.register(new RadarWidgetType());
    this.register(new KPIWidgetType());
    this.register(new KPIGroupWidgetType());
    this.register(new CardWidgetType());
    this.register(new TableWidgetType());

    this.initialized = true;
  }

  /**
   * Resets the registry (useful for testing)
   */
  static resetInstance(): void {
    WidgetRegistry.instance = null;
  }
}

export const widgetRegistry = WidgetRegistry.getInstance();
