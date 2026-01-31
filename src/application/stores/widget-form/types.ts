/**
 * Types for Widget Form Store Slices
 *
 * @description Types internes pour les slices du widget form store
 */
import type { StateCreator } from 'zustand';
import type { WidgetType, MetricStyle } from '@customdash/visualizations';
import type {
  WidgetFormConfig,
  WidgetFormTab,
  MetricConfig,
  BucketConfig,
  GlobalFilter,
  InitializeFormParams,
} from '@type/widget-form.types';

// ============================================================================
// BASE SLICE
// ============================================================================

export interface BaseState {
  type: WidgetType;
  sourceId: string;
  columns: string[];
  columnTypes: Record<string, string>;
  dataPreview: Record<string, unknown>[];
  activeTab: WidgetFormTab;
  widgetTitle: string;
  widgetDescription: string;
  visibility: 'public' | 'private';
  isLoading: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

export interface BaseActions {
  setType: (type: WidgetType) => void;
  setSourceId: (sourceId: string) => void;
  setActiveTab: (tab: WidgetFormTab) => void;
  setWidgetTitle: (title: string) => void;
  setWidgetDescription: (description: string) => void;
  setVisibility: (visibility: 'public' | 'private') => void;
  setErrors: (errors: Record<string, string>) => void;
  setIsDirty: (isDirty: boolean) => void;
}

export type BaseSlice = BaseState & BaseActions;

// ============================================================================
// CONFIG SLICE
// ============================================================================

export interface ConfigState {
  config: WidgetFormConfig;
}

export interface ConfigActions {
  updateConfig: <K extends keyof WidgetFormConfig>(key: K, value: WidgetFormConfig[K]) => void;
  updateWidgetParam: (key: string, value: unknown) => void;
  setConfig: (config: WidgetFormConfig) => void;
}

export type ConfigSlice = ConfigState & ConfigActions;

// ============================================================================
// METRICS SLICE
// ============================================================================

export interface MetricsActions {
  addMetric: () => void;
  updateMetric: (index: number, updates: Partial<MetricConfig>) => void;
  removeMetric: (index: number) => void;
  moveMetric: (fromIndex: number, toIndex: number) => void;
  updateMetricStyle: (index: number, updates: Partial<MetricStyle>) => void;
}

export type MetricsSlice = MetricsActions;

// ============================================================================
// BUCKETS SLICE
// ============================================================================

export interface BucketsActions {
  addBucket: () => void;
  updateBucket: (index: number, updates: Partial<BucketConfig>) => void;
  removeBucket: (index: number) => void;
  moveBucket: (fromIndex: number, toIndex: number) => void;
}

export type BucketsSlice = BucketsActions;

// ============================================================================
// FILTERS SLICE
// ============================================================================

export interface FiltersActions {
  addGlobalFilter: () => void;
  updateGlobalFilter: (index: number, updates: Partial<GlobalFilter>) => void;
  removeGlobalFilter: (index: number) => void;
}

export type FiltersSlice = FiltersActions;

// ============================================================================
// FORM ACTIONS SLICE
// ============================================================================

export interface FormActionsSlice {
  initializeForm: (params: InitializeFormParams) => void;
  loadSourceData: (
    sourceId: string,
    data: Record<string, unknown>[],
    columns: string[],
    columnTypes: Record<string, string>,
  ) => void;
  resetForm: () => void;
}

// ============================================================================
// COMBINED STORE
// ============================================================================

export type WidgetFormStore = BaseSlice &
  ConfigSlice &
  MetricsSlice &
  BucketsSlice &
  FiltersSlice &
  FormActionsSlice;

export type SliceCreator<T> = StateCreator<WidgetFormStore, [], [], T>;
