import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { widgetFormService } from '@core/widgets';
import type { WidgetType, WidgetParams, MetricStyle } from '@customdash/visualizations';
import type {
  WidgetFormState,
  WidgetFormActions,
  WidgetFormConfig,
  WidgetFormTab,
  MetricConfig,
  BucketConfig,
  GlobalFilter,
  InitializeFormParams,
} from '@type/widget-form.types';

function createInitialConfig(): WidgetFormConfig {
  return widgetFormService.createFormConfig({ type: 'bar' });
}

const INITIAL_STATE: WidgetFormState = {
  type: 'bar',
  sourceId: '',
  columns: [],
  columnTypes: {},
  dataPreview: [],
  config: createInitialConfig(),
  activeTab: 'data',
  widgetTitle: '',
  widgetDescription: '',
  visibility: 'private',
  isLoading: false,
  isDirty: false,
  errors: {},
};

export const useWidgetFormStore = create<WidgetFormState & WidgetFormActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setType: (type: WidgetType) => {
        const state = get();
        const dataConfig = widgetFormService.getDataConfig(type);
        const updatedParams = widgetFormService.applySchemaDefaults(
          type,
          state.config.widgetParams,
        );
        const dsType = dataConfig?.datasetType;

        const updatedMetrics = state.config.metrics.map(metric => ({
          ...metric,
          x: dsType === 'xy' || dsType === 'xyr' ? metric.x : undefined,
          y: dsType === 'xy' || dsType === 'xyr' ? metric.y : undefined,
          r: dsType === 'xyr' ? metric.r : undefined,
          fields: dsType === 'multiAxis' ? metric.fields : undefined,
        }));

        set({
          type,
          config: {
            ...state.config,
            metrics: updatedMetrics,
            widgetParams: updatedParams,
          },
          isDirty: true,
        });
      },

      setSourceId: (sourceId: string) => {
        set({ sourceId, isDirty: true });
      },

      setActiveTab: (tab: WidgetFormTab) => {
        set({ activeTab: tab });
      },

      setWidgetTitle: (title: string) => {
        set({ widgetTitle: title, isDirty: true });
      },

      setWidgetDescription: (description: string) => {
        set({ widgetDescription: description, isDirty: true });
      },

      setVisibility: (visibility: 'public' | 'private') => {
        set({ visibility, isDirty: true });
      },

      initializeForm: (params: InitializeFormParams) => {
        const {
          type,
          sourceId = '',
          existingConfig,
          widgetTitle = '',
          widgetDescription = '',
        } = params;

        const config = widgetFormService.createFormConfig({ type, existingConfig });

        set({
          type,
          sourceId,
          config,
          widgetTitle,
          widgetDescription,
          activeTab: 'data',
          isDirty: false,
          errors: {},
        });
      },

      loadSourceData: (
        sourceId: string,
        data: Record<string, unknown>[],
        columns: string[],
        columnTypes: Record<string, string>,
      ) => {
        const state = get();
        const dataConfig = widgetFormService.getDataConfig(state.type);

        const result = widgetFormService.applySourceData({
          columns,
          datasetType: dataConfig?.datasetType,
          currentMetrics: state.config.metrics,
          currentBuckets: state.config.buckets,
        });

        set({
          sourceId,
          dataPreview: data.slice(0, 100),
          columns,
          columnTypes,
          config: {
            ...state.config,
            metrics: result.metrics,
            buckets: result.buckets,
          },
          isDirty: true,
        });
      },

      updateConfig: <K extends keyof WidgetFormConfig>(key: K, value: WidgetFormConfig[K]) => {
        set(state => ({
          config: { ...state.config, [key]: value },
          isDirty: true,
        }));
      },

      updateWidgetParam: (key: string, value: unknown) => {
        set(state => {
          const newParams = widgetFormService.setNestedParam(
            state.config.widgetParams as WidgetParams,
            key,
            value,
          );
          return {
            config: { ...state.config, widgetParams: newParams },
            isDirty: true,
          };
        });
      },

      addMetric: () => {
        const state = get();
        const dataConfig = widgetFormService.getDataConfig(state.type);

        const newMetric = widgetFormService.createMetric({
          columns: state.columns,
          datasetType: dataConfig?.datasetType,
        });

        set({
          config: {
            ...state.config,
            metrics: [...state.config.metrics, newMetric],
            metricStyles: [...state.config.metricStyles, widgetFormService.createMetricStyle()],
          },
          isDirty: true,
        });
      },

      updateMetric: (index: number, updates: Partial<MetricConfig>) => {
        set(state => {
          const metrics = [...state.config.metrics];
          if (metrics[index]) {
            metrics[index] = { ...metrics[index], ...updates };
            if (updates.field && !metrics[index].label) {
              metrics[index].label = updates.field;
            }
          }
          return { config: { ...state.config, metrics }, isDirty: true };
        });
      },

      removeMetric: (index: number) => {
        set(state => {
          if (state.config.metrics.length <= 1) return state;
          const metrics = state.config.metrics.filter((_, i) => i !== index);
          const metricStyles = state.config.metricStyles.filter((_, i) => i !== index);
          return { config: { ...state.config, metrics, metricStyles }, isDirty: true };
        });
      },

      moveMetric: (fromIndex: number, toIndex: number) => {
        set(state => {
          const metrics = [...state.config.metrics];
          const metricStyles = [...state.config.metricStyles];
          const [movedMetric] = metrics.splice(fromIndex, 1);
          const [movedStyle] = metricStyles.splice(fromIndex, 1);
          metrics.splice(toIndex, 0, movedMetric);
          metricStyles.splice(toIndex, 0, movedStyle);
          return { config: { ...state.config, metrics, metricStyles }, isDirty: true };
        });
      },

      addBucket: () => {
        set(state => ({
          config: {
            ...state.config,
            buckets: [...state.config.buckets, widgetFormService.createBucket()],
          },
          isDirty: true,
        }));
      },

      updateBucket: (index: number, updates: Partial<BucketConfig>) => {
        set(state => {
          const buckets = [...state.config.buckets];
          if (buckets[index]) {
            buckets[index] = { ...buckets[index], ...updates };
          }
          return { config: { ...state.config, buckets }, isDirty: true };
        });
      },

      removeBucket: (index: number) => {
        set(state => {
          if (state.config.buckets.length <= 1) return state;
          const buckets = state.config.buckets.filter((_, i) => i !== index);
          return { config: { ...state.config, buckets }, isDirty: true };
        });
      },

      moveBucket: (fromIndex: number, toIndex: number) => {
        set(state => {
          const buckets = [...state.config.buckets];
          const [movedBucket] = buckets.splice(fromIndex, 1);
          buckets.splice(toIndex, 0, movedBucket);
          return { config: { ...state.config, buckets }, isDirty: true };
        });
      },

      addGlobalFilter: () => {
        set(state => ({
          config: {
            ...state.config,
            globalFilters: [...state.config.globalFilters, widgetFormService.createFilter()],
          },
          isDirty: true,
        }));
      },

      updateGlobalFilter: (index: number, updates: Partial<GlobalFilter>) => {
        set(state => {
          const globalFilters = [...state.config.globalFilters];
          if (globalFilters[index]) {
            globalFilters[index] = { ...globalFilters[index], ...updates };
          }
          return { config: { ...state.config, globalFilters }, isDirty: true };
        });
      },

      removeGlobalFilter: (index: number) => {
        set(state => {
          const globalFilters = state.config.globalFilters.filter((_, i) => i !== index);
          return { config: { ...state.config, globalFilters }, isDirty: true };
        });
      },

      updateMetricStyle: (index: number, updates: Partial<MetricStyle>) => {
        set(state => {
          const metricStyles = [...state.config.metricStyles];
          if (metricStyles[index]) {
            metricStyles[index] = { ...metricStyles[index], ...updates };
          }
          return { config: { ...state.config, metricStyles }, isDirty: true };
        });
      },

      resetForm: () => {
        set({ ...INITIAL_STATE, config: createInitialConfig() });
      },

      setErrors: (errors: Record<string, string>) => {
        set({ errors });
      },
    }),
    {
      name: 'customdash-widget-form',
      partialize: state => ({
        type: state.type,
        sourceId: state.sourceId,
        columns: state.columns,
        columnTypes: state.columnTypes,
        dataPreview: state.dataPreview,
        config: state.config,
        widgetTitle: state.widgetTitle,
        widgetDescription: state.widgetDescription,
        visibility: state.visibility,
        activeTab: state.activeTab,
      }),
      skipHydration: false,
    },
  ),
);

if (import.meta.hot) {
  import.meta.hot.accept();
}

export const useWidgetFormType = () => useWidgetFormStore(s => s.type);
export const useWidgetFormSourceId = () => useWidgetFormStore(s => s.sourceId);
export const useWidgetFormColumns = () => useWidgetFormStore(s => s.columns);
export const useWidgetFormColumnTypes = () => useWidgetFormStore(s => s.columnTypes);
export const useWidgetFormData = () => useWidgetFormStore(s => s.dataPreview);
export const useWidgetFormConfig = () => useWidgetFormStore(useShallow(s => s.config));
export const useWidgetFormMetrics = () => useWidgetFormStore(useShallow(s => s.config.metrics));
export const useWidgetFormBuckets = () => useWidgetFormStore(useShallow(s => s.config.buckets));
export const useWidgetFormFilters = () =>
  useWidgetFormStore(useShallow(s => s.config.globalFilters));
export const useWidgetFormMetricStyles = () =>
  useWidgetFormStore(useShallow(s => s.config.metricStyles));
export const useWidgetFormParams = () => useWidgetFormStore(s => s.config.widgetParams);
export const useWidgetFormTitle = () => useWidgetFormStore(s => s.widgetTitle);
export const useWidgetFormDescription = () => useWidgetFormStore(s => s.widgetDescription);
export const useWidgetFormVisibility = () => useWidgetFormStore(s => s.visibility);
export const useWidgetFormActiveTab = () => useWidgetFormStore(s => s.activeTab);
export const useWidgetFormIsLoading = () => useWidgetFormStore(s => s.isLoading);
export const useWidgetFormIsDirty = () => useWidgetFormStore(s => s.isDirty);
export const useWidgetFormErrors = () => useWidgetFormStore(s => s.errors);

export const useWidgetFormActions = () =>
  useWidgetFormStore(
    useShallow(s => ({
      setType: s.setType,
      setSourceId: s.setSourceId,
      setActiveTab: s.setActiveTab,
      setWidgetTitle: s.setWidgetTitle,
      setWidgetDescription: s.setWidgetDescription,
      setVisibility: s.setVisibility,
      initializeForm: s.initializeForm,
      loadSourceData: s.loadSourceData,
      updateConfig: s.updateConfig,
      updateWidgetParam: s.updateWidgetParam,
      addMetric: s.addMetric,
      updateMetric: s.updateMetric,
      removeMetric: s.removeMetric,
      moveMetric: s.moveMetric,
      addBucket: s.addBucket,
      updateBucket: s.updateBucket,
      removeBucket: s.removeBucket,
      moveBucket: s.moveBucket,
      addGlobalFilter: s.addGlobalFilter,
      updateGlobalFilter: s.updateGlobalFilter,
      removeGlobalFilter: s.removeGlobalFilter,
      updateMetricStyle: s.updateMetricStyle,
      resetForm: s.resetForm,
      setErrors: s.setErrors,
    })),
  );
