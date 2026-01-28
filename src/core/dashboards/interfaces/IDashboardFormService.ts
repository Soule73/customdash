import type {
  DashboardFormConfig,
  DashboardFilter,
  TimeRangeConfig,
  AutoRefreshConfig,
  InitializeDashboardFormParams,
  DashboardSaveData,
} from '@type/dashboard-form.types';
import type { LayoutItem } from '@type/dashboard.types';

export interface ValidationMessages {
  titleRequired: string;
  titleMinLength: string;
  titleMaxLength: string;
  autoRefreshInterval: string;
}

export interface IDashboardFormService {
  createDefaultConfig(): DashboardFormConfig;
  createDefaultTimeRange(): TimeRangeConfig;
  createDefaultAutoRefresh(): AutoRefreshConfig;
  createFilter(field?: string): DashboardFilter;

  initializeConfig(params: InitializeDashboardFormParams): DashboardFormConfig;

  calculateNextPosition(layout: LayoutItem[], cols?: number): { x: number; y: number };
  createLayoutItem(widgetId: string, position?: { x: number; y: number }): LayoutItem;

  buildSavePayload(config: DashboardFormConfig): DashboardSaveData;

  getEffectiveTimeRange(config: TimeRangeConfig): { from: Date | null; to: Date | null };
  getAutoRefreshMs(config: AutoRefreshConfig): number | null;

  validateConfig(config: DashboardFormConfig, messages: ValidationMessages): Record<string, string>;
}
