import type { LayoutItem, Dashboard } from './dashboard.types';
import type { Widget } from './widget.types';

export type DashboardVisibility = 'private' | 'public' | 'shared';

export type TimeRangeMode = 'absolute' | 'relative';

export type IntervalUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';

export interface TimeRangeConfig {
  mode: TimeRangeMode;
  from?: string | null;
  to?: string | null;
  relativeValue?: number;
  relativeUnit?: IntervalUnit;
}

export interface AutoRefreshConfig {
  enabled: boolean;
  intervalValue?: number;
  intervalUnit?: IntervalUnit;
}

export interface DashboardFormConfig {
  title: string;
  description: string;
  visibility: DashboardVisibility;
  layout: LayoutItem[];
  timeRange: TimeRangeConfig;
  autoRefresh: AutoRefreshConfig;
  globalFilters: DashboardFilter[];
  pageSize: number;
}

export interface DashboardFilter {
  id: string;
  field: string;
  operator: string;
  value: unknown;
}

export interface DashboardFormState {
  dashboardId: string | null;
  isCreateMode: boolean;
  config: DashboardFormConfig;
  widgets: Map<string, Widget>;
  editMode: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  forceRefreshKey: number;
}

export interface DashboardFormActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (visibility: DashboardVisibility) => void;
  setLayout: (layout: LayoutItem[]) => void;
  setEditMode: (editMode: boolean) => void;
  setTimeRange: (config: Partial<TimeRangeConfig>) => void;
  setAutoRefresh: (config: Partial<AutoRefreshConfig>) => void;
  setPageSize: (size: number) => void;
  addWidget: (widgetId: string, widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateLayoutItem: (widgetId: string, updates: Partial<LayoutItem>) => void;
  addFilter: (filter: DashboardFilter) => void;
  removeFilter: (filterId: string) => void;
  updateFilter: (filterId: string, updates: Partial<DashboardFilter>) => void;
  initializeForm: (params: InitializeDashboardFormParams) => void;
  resetForm: () => void;
  markDirty: () => void;
  markClean: () => void;
  incrementRefreshKey: () => void;
}

export interface InitializeDashboardFormParams {
  dashboard?: Dashboard;
  widgets?: Widget[];
  isCreateMode?: boolean;
}

export interface DashboardGridProps {
  layout: LayoutItem[];
  widgets: Map<string, Widget>;
  editMode: boolean;
  onLayoutChange?: (layout: LayoutItem[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
  onAddWidget?: () => void;
}

export interface DashboardGridItemProps {
  item: LayoutItem;
  widget: Widget | undefined;
  editMode: boolean;
  onRemove?: () => void;
}

export interface DashboardSaveData {
  title: string;
  description?: string;
  layout: LayoutItem[];
  visibility: DashboardVisibility;
  timeRange?: TimeRangeConfig;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: IntervalUnit;
}

export type DashboardFormStore = DashboardFormState & DashboardFormActions;
