import { create, type StateCreator, type StoreApi } from 'zustand';
import type { UseBoundStore } from 'zustand';
import { dashboardFormService } from '@/core/dashboards';
import type {
  DashboardFormStore,
  DashboardFormState,
  DashboardVisibility,
  TimeRangeConfig,
  AutoRefreshConfig,
  DashboardFilter,
  InitializeDashboardFormParams,
} from '@type/dashboard-form.types';
import type { LayoutItem } from '@type/dashboard.types';
import type { Widget } from '@type/widget.types';

declare global {
  var __dashboardFormStore: UseBoundStore<StoreApi<DashboardFormStore>> | undefined;
}

const createInitialState = (): DashboardFormState => ({
  dashboardId: null,
  isCreateMode: true,
  config: dashboardFormService.createDefaultConfig(),
  widgets: new Map(),
  editMode: false,
  isDirty: false,
  isLoading: false,
  isSaving: false,
  errors: {},
  forceRefreshKey: 0,
});

const createStore: StateCreator<DashboardFormStore> = (set, get) => ({
  ...createInitialState(),

  setTitle: (title: string) => {
    set(state => ({
      config: { ...state.config, title },
      isDirty: true,
    }));
  },

  setDescription: (description: string) => {
    set(state => ({
      config: { ...state.config, description },
      isDirty: true,
    }));
  },

  setVisibility: (visibility: DashboardVisibility) => {
    set(state => ({
      config: { ...state.config, visibility },
      isDirty: true,
    }));
  },

  setLayout: (layout: LayoutItem[]) => {
    set(state => ({
      config: { ...state.config, layout },
      isDirty: true,
    }));
  },

  setEditMode: (editMode: boolean) => {
    set({ editMode });
  },

  setTimeRange: (updates: Partial<TimeRangeConfig>) => {
    set(state => ({
      config: {
        ...state.config,
        timeRange: { ...state.config.timeRange, ...updates },
      },
      isDirty: true,
    }));
  },

  setAutoRefresh: (updates: Partial<AutoRefreshConfig>) => {
    set(state => ({
      config: {
        ...state.config,
        autoRefresh: { ...state.config.autoRefresh, ...updates },
      },
      isDirty: true,
    }));
  },

  setPageSize: (pageSize: number) => {
    const clampedSize = Math.min(Math.max(pageSize, 100), 10000);
    set(state => ({
      config: { ...state.config, pageSize: clampedSize },
    }));
  },

  addWidget: (widgetId: string, widget: Widget) => {
    const { config, widgets } = get();
    const position = dashboardFormService.calculateNextPosition(config.layout);
    const layoutItem = dashboardFormService.createLayoutItem(widgetId, position);

    const newWidgets = new Map(widgets);
    newWidgets.set(widgetId, widget);

    set({
      config: {
        ...config,
        layout: [...config.layout, layoutItem],
      },
      widgets: newWidgets,
      isDirty: true,
    });
  },

  removeWidget: (widgetId: string) => {
    const { config, widgets } = get();
    const newWidgets = new Map(widgets);
    newWidgets.delete(widgetId);

    set({
      config: {
        ...config,
        layout: config.layout.filter(item => item.widgetId !== widgetId),
      },
      widgets: newWidgets,
      isDirty: true,
    });
  },

  updateLayoutItem: (widgetId: string, updates: Partial<LayoutItem>) => {
    set(state => ({
      config: {
        ...state.config,
        layout: state.config.layout.map(item =>
          item.widgetId === widgetId ? { ...item, ...updates } : item,
        ),
      },
      isDirty: true,
    }));
  },

  addFilter: (filter: DashboardFilter) => {
    set(state => ({
      config: {
        ...state.config,
        globalFilters: [...state.config.globalFilters, filter],
      },
      isDirty: true,
    }));
  },

  removeFilter: (filterId: string) => {
    set(state => ({
      config: {
        ...state.config,
        globalFilters: state.config.globalFilters.filter(f => f.id !== filterId),
      },
      isDirty: true,
    }));
  },

  updateFilter: (filterId: string, updates: Partial<DashboardFilter>) => {
    set(state => ({
      config: {
        ...state.config,
        globalFilters: state.config.globalFilters.map(f =>
          f.id === filterId ? { ...f, ...updates } : f,
        ),
      },
      isDirty: true,
    }));
  },

  initializeForm: (params: InitializeDashboardFormParams) => {
    const config = dashboardFormService.initializeConfig(params);
    const widgetsMap = new Map<string, Widget>();

    if (params.widgets) {
      for (const widget of params.widgets) {
        widgetsMap.set(widget.widgetId, widget);
      }
    }

    set({
      dashboardId: params.dashboard?.id || null,
      isCreateMode: params.isCreateMode ?? !params.dashboard,
      config,
      widgets: widgetsMap,
      editMode: params.isCreateMode ?? false,
      isDirty: false,
      isLoading: false,
      isSaving: false,
      errors: {},
      forceRefreshKey: 0,
    });
  },

  resetForm: () => {
    set(createInitialState());
  },

  markDirty: () => {
    set({ isDirty: true });
  },

  markClean: () => {
    set({ isDirty: false });
  },

  incrementRefreshKey: () => {
    set(state => ({ forceRefreshKey: state.forceRefreshKey + 1 }));
  },
});

export const useDashboardFormStore =
  globalThis.__dashboardFormStore ?? create<DashboardFormStore>(createStore);

if (import.meta.hot) {
  globalThis.__dashboardFormStore = useDashboardFormStore;
}
