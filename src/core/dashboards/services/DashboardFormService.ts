import { v4 as uuid } from 'uuid';
import type { IDashboardFormService, ValidationMessages } from '../interfaces';
import type {
  DashboardFormConfig,
  DashboardFilter,
  TimeRangeConfig,
  AutoRefreshConfig,
  InitializeDashboardFormParams,
  DashboardSaveData,
  IntervalUnit,
} from '@type/dashboard-form.types';
import type { LayoutItem } from '@type/dashboard.types';

const DEFAULT_COLS = 12;
const DEFAULT_WIDGET_WIDTH = 6;
const DEFAULT_WIDGET_HEIGHT = 4;
const DEFAULT_PAGE_SIZE = 10000;

const INTERVAL_MS: Record<IntervalUnit, number> = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

class DashboardFormServiceImpl implements IDashboardFormService {
  createDefaultConfig(): DashboardFormConfig {
    return {
      title: '',
      description: '',
      visibility: 'private',
      layout: [],
      timeRange: this.createDefaultTimeRange(),
      autoRefresh: this.createDefaultAutoRefresh(),
      globalFilters: [],
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }

  createDefaultTimeRange(): TimeRangeConfig {
    return {
      mode: 'absolute',
      from: null,
      to: null,
      relativeValue: undefined,
      relativeUnit: 'hour',
    };
  }

  createDefaultAutoRefresh(): AutoRefreshConfig {
    return {
      enabled: false,
      intervalValue: undefined,
      intervalUnit: 'minute',
    };
  }

  createFilter(field?: string): DashboardFilter {
    return {
      id: uuid(),
      field: field || '',
      operator: 'equals',
      value: '',
    };
  }

  initializeConfig(params: InitializeDashboardFormParams): DashboardFormConfig {
    const { dashboard, isCreateMode } = params;

    if (isCreateMode || !dashboard) {
      return this.createDefaultConfig();
    }

    return {
      title: dashboard.title,
      description: dashboard.description || '',
      visibility: dashboard.visibility,
      layout: dashboard.layout || [],
      styles: dashboard.styles,
      timeRange: this.createDefaultTimeRange(),
      autoRefresh: this.createDefaultAutoRefresh(),
      globalFilters: [],
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }

  calculateNextPosition(
    layout: LayoutItem[],
    cols: number = DEFAULT_COLS,
  ): { x: number; y: number } {
    if (layout.length === 0) {
      return { x: 0, y: 0 };
    }

    let maxY = 0;
    let maxYItems: LayoutItem[] = [];

    for (const item of layout) {
      const itemBottom = item.y + item.h;
      if (itemBottom > maxY) {
        maxY = itemBottom;
        maxYItems = [item];
      } else if (itemBottom === maxY) {
        maxYItems.push(item);
      }
    }

    const lastRowItem = maxYItems.reduce((prev, curr) =>
      curr.x + curr.w > prev.x + prev.w ? curr : prev,
    );

    const nextX = lastRowItem.x + lastRowItem.w;

    if (nextX + DEFAULT_WIDGET_WIDTH <= cols) {
      return { x: nextX, y: lastRowItem.y };
    }

    return { x: 0, y: maxY };
  }

  createLayoutItem(widgetId: string, position?: { x: number; y: number }): LayoutItem {
    return {
      i: widgetId,
      widgetId,
      x: position?.x ?? 0,
      y: position?.y ?? 0,
      w: DEFAULT_WIDGET_WIDTH,
      h: DEFAULT_WIDGET_HEIGHT,
      minW: 2,
      minH: 2,
    };
  }

  buildSavePayload(config: DashboardFormConfig): DashboardSaveData {
    const payload: DashboardSaveData = {
      title: config.title.trim(),
      layout: config.layout,
      styles: config.styles,
      visibility: config.visibility,
    };

    if (config.description.trim()) {
      payload.description = config.description.trim();
    }

    if (config.timeRange.mode === 'absolute') {
      if (config.timeRange.from || config.timeRange.to) {
        payload.timeRange = {
          mode: 'absolute',
          from: config.timeRange.from,
          to: config.timeRange.to,
        };
      }
    } else if (config.timeRange.relativeValue) {
      payload.timeRange = {
        mode: 'relative',
        relativeValue: config.timeRange.relativeValue,
        relativeUnit: config.timeRange.relativeUnit,
      };
    }

    if (config.autoRefresh.enabled && config.autoRefresh.intervalValue) {
      payload.autoRefreshIntervalValue = config.autoRefresh.intervalValue;
      payload.autoRefreshIntervalUnit = config.autoRefresh.intervalUnit;
    }

    return payload;
  }

  getEffectiveTimeRange(config: TimeRangeConfig): { from: Date | null; to: Date | null } {
    if (config.mode === 'absolute') {
      return {
        from: config.from ? new Date(config.from) : null,
        to: config.to ? new Date(config.to) : null,
      };
    }

    if (!config.relativeValue || !config.relativeUnit) {
      return { from: null, to: null };
    }

    const now = new Date();
    const msOffset = config.relativeValue * INTERVAL_MS[config.relativeUnit];
    const from = new Date(now.getTime() - msOffset);

    return { from, to: now };
  }

  getAutoRefreshMs(config: AutoRefreshConfig): number | null {
    if (!config.enabled || !config.intervalValue || !config.intervalUnit) {
      return null;
    }

    return config.intervalValue * INTERVAL_MS[config.intervalUnit];
  }

  validateConfig(
    config: DashboardFormConfig,
    messages: ValidationMessages,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!config.title.trim()) {
      errors.title = messages.titleRequired;
    } else if (config.title.length < 2) {
      errors.title = messages.titleMinLength;
    } else if (config.title.length > 100) {
      errors.title = messages.titleMaxLength;
    }

    if (config.autoRefresh.enabled) {
      if (!config.autoRefresh.intervalValue || config.autoRefresh.intervalValue < 1) {
        errors.autoRefreshInterval = messages.autoRefreshInterval;
      }
    }

    return errors;
  }
}

export const dashboardFormService = new DashboardFormServiceImpl();
