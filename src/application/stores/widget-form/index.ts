/**
 * Widget Form Store - Refactored with Slices
 *
 * @description Store Zustand pour le formulaire de création/édition de widgets
 * Refactorisé en slices pour respecter le Single Responsibility Principle
 *
 * @module stores/widget-form
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { widgetFormService } from '@core/widgets';
import type { WidgetParams } from '@customdash/visualizations';
import type { WidgetFormStore } from './types';
import { createBaseSlice } from './baseSlice';
import { createConfigSlice } from './configSlice';
import { createMetricsSlice } from './metricsSlice';
import { createBucketsSlice } from './bucketsSlice';
import { createFiltersSlice } from './filtersSlice';
import { createFormActionsSlice } from './formActionsSlice';

/**
 * Combined Widget Form Store with all slices
 *
 * @description Uses Zustand slice pattern to split store into manageable pieces
 * while maintaining a single store instance for atomic updates
 */
export const useWidgetFormStore = create<WidgetFormStore>()(
  persist(
    (...args) => {
      const [set, get] = args;

      // Combine all slices
      const baseSlice = createBaseSlice(...args);
      const configSlice = createConfigSlice(...args);
      const metricsSlice = createMetricsSlice(...args);
      const bucketsSlice = createBucketsSlice(...args);
      const filtersSlice = createFiltersSlice(...args);
      const formActionsSlice = createFormActionsSlice(...args);

      return {
        ...baseSlice,
        ...configSlice,
        ...metricsSlice,
        ...bucketsSlice,
        ...filtersSlice,
        ...formActionsSlice,

        // Override setType to handle widget params schema
        setType: type => {
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
              widgetParams: updatedParams as WidgetParams,
            },
            isDirty: true,
          });
        },
      };
    },
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

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept();
}

// ============================================================================
// SELECTOR HOOKS - Individual state selectors for optimized re-renders
// ============================================================================

/** @returns Current widget type */
export const useWidgetFormType = () => useWidgetFormStore(s => s.type);

/** @returns Current source ID */
export const useWidgetFormSourceId = () => useWidgetFormStore(s => s.sourceId);

/** @returns Available columns from data source */
export const useWidgetFormColumns = () => useWidgetFormStore(s => s.columns);

/** @returns Column type mapping */
export const useWidgetFormColumnTypes = () => useWidgetFormStore(s => s.columnTypes);

/** @returns Data preview (first 100 rows) */
export const useWidgetFormData = () => useWidgetFormStore(s => s.dataPreview);

/** @returns Full widget config (memoized) */
export const useWidgetFormConfig = () => useWidgetFormStore(useShallow(s => s.config));

/** @returns Metrics configuration (memoized) */
export const useWidgetFormMetrics = () => useWidgetFormStore(useShallow(s => s.config.metrics));

/** @returns Buckets configuration (memoized) */
export const useWidgetFormBuckets = () => useWidgetFormStore(useShallow(s => s.config.buckets));

/** @returns Global filters (memoized) */
export const useWidgetFormFilters = () =>
  useWidgetFormStore(useShallow(s => s.config.globalFilters));

/** @returns Metric styles (memoized) */
export const useWidgetFormMetricStyles = () =>
  useWidgetFormStore(useShallow(s => s.config.metricStyles));

/** @returns Widget params */
export const useWidgetFormParams = () => useWidgetFormStore(s => s.config.widgetParams);

/** @returns Widget title */
export const useWidgetFormTitle = () => useWidgetFormStore(s => s.widgetTitle);

/** @returns Widget description */
export const useWidgetFormDescription = () => useWidgetFormStore(s => s.widgetDescription);

/** @returns Widget visibility */
export const useWidgetFormVisibility = () => useWidgetFormStore(s => s.visibility);

/** @returns Active form tab */
export const useWidgetFormActiveTab = () => useWidgetFormStore(s => s.activeTab);

/** @returns Loading state */
export const useWidgetFormIsLoading = () => useWidgetFormStore(s => s.isLoading);

/** @returns Dirty state */
export const useWidgetFormIsDirty = () => useWidgetFormStore(s => s.isDirty);

/** @returns Form errors */
export const useWidgetFormErrors = () => useWidgetFormStore(s => s.errors);

// ============================================================================
// ACTIONS HOOK - All actions grouped for convenience
// ============================================================================

/**
 * Hook to access all widget form actions
 *
 * @returns Object containing all form actions
 */
export const useWidgetFormActions = () =>
  useWidgetFormStore(
    useShallow(s => ({
      // Base actions
      setType: s.setType,
      setSourceId: s.setSourceId,
      setActiveTab: s.setActiveTab,
      setWidgetTitle: s.setWidgetTitle,
      setWidgetDescription: s.setWidgetDescription,
      setVisibility: s.setVisibility,
      setErrors: s.setErrors,
      setIsDirty: s.setIsDirty,

      // Config actions
      updateConfig: s.updateConfig,
      updateWidgetParam: s.updateWidgetParam,

      // Metrics actions
      addMetric: s.addMetric,
      updateMetric: s.updateMetric,
      removeMetric: s.removeMetric,
      moveMetric: s.moveMetric,
      updateMetricStyle: s.updateMetricStyle,

      // Buckets actions
      addBucket: s.addBucket,
      updateBucket: s.updateBucket,
      removeBucket: s.removeBucket,
      moveBucket: s.moveBucket,

      // Filters actions
      addGlobalFilter: s.addGlobalFilter,
      updateGlobalFilter: s.updateGlobalFilter,
      removeGlobalFilter: s.removeGlobalFilter,

      // Form actions
      initializeForm: s.initializeForm,
      loadSourceData: s.loadSourceData,
      resetForm: s.resetForm,
    })),
  );

// Re-export types
export type { WidgetFormStore } from './types';
