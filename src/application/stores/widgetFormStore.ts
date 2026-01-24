import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { generateId, setNestedValue, isNestedPath } from '@customdash/utils';
import type {
  WidgetType,
  AggregationType,
  Filter,
  MetricStyle,
  WidgetParams,
} from '@customdash/visualizations';
import type {
  WidgetFormState,
  WidgetFormActions,
  WidgetFormConfig,
  WidgetFormTab,
  MetricConfig,
  BucketConfig,
  GlobalFilter,
  MetricStyleConfig,
  WidgetParamsConfig,
  InitializeFormParams,
} from '@type/widget-form.types';

const DEFAULT_METRIC = (): MetricConfig => ({
  id: generateId('metric'),
  field: '',
  agg: 'sum' as AggregationType,
  label: '',
});

const DEFAULT_BUCKET = (): BucketConfig => ({
  id: generateId('bucket'),
  field: '',
  type: 'terms',
  size: 10,
});

const DEFAULT_FILTER = (): Filter => ({
  field: '',
  operator: 'equals',
  value: '',
});

const DEFAULT_METRIC_STYLE = (): MetricStyle => ({
  color: '#6366f1',
  borderColor: '#4f46e5',
  borderWidth: 1,
});

const DEFAULT_WIDGET_PARAMS: WidgetParams = {
  title: '',
  titleAlign: 'center',
  legend: true,
  legendPosition: 'top',
  showGrid: true,
  showValues: false,
  labelFontSize: 12,
  labelColor: '#374151',
  format: 'number',
  currency: 'EUR',
  decimals: 2,
};

const DEFAULT_CONFIG: WidgetFormConfig = {
  metrics: [DEFAULT_METRIC()],
  buckets: [DEFAULT_BUCKET()],
  globalFilters: [],
  metricStyles: [DEFAULT_METRIC_STYLE()],
  widgetParams: { ...DEFAULT_WIDGET_PARAMS },
};

const INITIAL_STATE: WidgetFormState = {
  type: 'bar',
  sourceId: '',
  columns: [],
  columnTypes: {},
  dataPreview: [],
  config: { ...DEFAULT_CONFIG },
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
        set({ type, isDirty: true });
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

        const baseConfig = { ...DEFAULT_CONFIG };

        if (existingConfig) {
          if (existingConfig.metrics?.length) {
            baseConfig.metrics = existingConfig.metrics;
            baseConfig.metricStyles = existingConfig.metrics.map(() => DEFAULT_METRIC_STYLE());
          }
          if (existingConfig.buckets?.length) {
            baseConfig.buckets = existingConfig.buckets;
          }
          if (existingConfig.globalFilters) {
            baseConfig.globalFilters = existingConfig.globalFilters;
          }
          if (existingConfig.metricStyles) {
            baseConfig.metricStyles = existingConfig.metricStyles;
          }
          if (existingConfig.widgetParams) {
            baseConfig.widgetParams = { ...DEFAULT_WIDGET_PARAMS, ...existingConfig.widgetParams };
          }
        }

        set({
          type,
          sourceId,
          config: baseConfig,
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
        const firstColumn = columns[0] || '';
        const secondColumn = columns[1] || columns[0] || '';
        const thirdColumn = columns[2] || columns[1] || columns[0] || '';

        const updatedMetrics = state.config.metrics.map((metric, index) => ({
          ...metric,
          field: metric.field || (index === 0 ? firstColumn : ''),
          x: metric.x || firstColumn,
          y: metric.y || secondColumn,
          r: metric.r || thirdColumn,
          fields: metric.fields?.length ? metric.fields : [firstColumn, secondColumn],
        }));

        const updatedBuckets = state.config.buckets.map((bucket, index) => ({
          ...bucket,
          field: bucket.field || (index === 0 ? firstColumn : ''),
        }));

        set({
          sourceId,
          dataPreview: data.slice(0, 100),
          columns,
          columnTypes,
          config: {
            ...state.config,
            metrics: updatedMetrics,
            buckets: updatedBuckets,
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
          let updatedParams: WidgetParamsConfig;

          if (isNestedPath(key)) {
            updatedParams = setNestedValue(
              state.config.widgetParams as Record<string, unknown>,
              key,
              value,
            ) as WidgetParamsConfig;
          } else {
            updatedParams = { ...state.config.widgetParams, [key]: value };
          }

          return {
            config: {
              ...state.config,
              widgetParams: updatedParams,
            },
            isDirty: true,
          };
        });
      },

      addMetric: () => {
        set(state => ({
          config: {
            ...state.config,
            metrics: [...state.config.metrics, DEFAULT_METRIC()],
            metricStyles: [...state.config.metricStyles, DEFAULT_METRIC_STYLE()],
          },
          isDirty: true,
        }));
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

          return {
            config: { ...state.config, metrics, metricStyles },
            isDirty: true,
          };
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

          return {
            config: { ...state.config, metrics, metricStyles },
            isDirty: true,
          };
        });
      },

      addBucket: () => {
        set(state => ({
          config: {
            ...state.config,
            buckets: [...state.config.buckets, DEFAULT_BUCKET()],
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
            globalFilters: [...state.config.globalFilters, DEFAULT_FILTER()],
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

      updateMetricStyle: (index: number, updates: Partial<MetricStyleConfig>) => {
        set(state => {
          const metricStyles = [...state.config.metricStyles];
          if (metricStyles[index]) {
            metricStyles[index] = { ...metricStyles[index], ...updates };
          }
          return { config: { ...state.config, metricStyles }, isDirty: true };
        });
      },

      resetForm: () => {
        set({ ...INITIAL_STATE, config: { ...DEFAULT_CONFIG } });
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
        config: state.config,
        widgetTitle: state.widgetTitle,
        widgetDescription: state.widgetDescription,
        visibility: state.visibility,
        activeTab: state.activeTab,
      }),
    },
  ),
);

export const useWidgetFormType = () => useWidgetFormStore(s => s.type);
export const useWidgetFormSourceId = () => useWidgetFormStore(s => s.sourceId);
export const useWidgetFormColumns = () => useWidgetFormStore(s => s.columns);
export const useWidgetFormData = () => useWidgetFormStore(s => s.dataPreview);
export const useWidgetFormConfig = () => useWidgetFormStore(s => s.config);
export const useWidgetFormMetrics = () => useWidgetFormStore(s => s.config.metrics);
export const useWidgetFormBuckets = () => useWidgetFormStore(s => s.config.buckets);
export const useWidgetFormFilters = () => useWidgetFormStore(s => s.config.globalFilters);
export const useWidgetFormMetricStyles = () => useWidgetFormStore(s => s.config.metricStyles);
export const useWidgetFormParams = () => useWidgetFormStore(s => s.config.widgetParams);
export const useWidgetFormTitle = () => useWidgetFormStore(s => s.widgetTitle);
export const useWidgetFormDescription = () => useWidgetFormStore(s => s.widgetDescription);
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
