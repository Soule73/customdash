import type {
  WidgetType,
  AggregationType,
  BucketType,
  DateInterval,
  SortOrder,
  Filter,
  RangeConfig,
  MetricStyle,
  WidgetParams,
  SelectOption,
  TextAlign,
  FormatType,
} from '@customdash/visualizations';

export type GlobalFilter = Filter;

export interface MetricConfig {
  id: string;
  field: string;
  agg: AggregationType;
  label: string;
  filters?: Filter[];
  x?: string;
  y?: string;
  r?: string;
  fields?: string[];
  width?: string;
  align?: TextAlign;
  format?: FormatType;
}

export interface BucketConfig {
  id: string;
  field: string;
  type: BucketType;
  label?: string;
  order?: SortOrder;
  size?: number;
  minDocCount?: number;
  interval?: number;
  dateInterval?: DateInterval;
  ranges?: RangeConfig[];
}

export interface WidgetFormConfig {
  metrics: MetricConfig[];
  buckets: BucketConfig[];
  globalFilters: GlobalFilter[];
  metricStyles: MetricStyle[];
  widgetParams: WidgetParams;
  groupBy?: string;
}

export type WidgetFormTab = 'data' | 'style' | 'params' | 'filters';

export interface WidgetFormState {
  type: WidgetType;
  sourceId: string;
  columns: string[];
  columnTypes: Record<string, string>;
  dataPreview: Record<string, unknown>[];
  config: WidgetFormConfig;
  activeTab: WidgetFormTab;
  widgetTitle: string;
  widgetDescription: string;
  visibility: 'public' | 'private';
  isLoading: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

export interface WidgetFormActions {
  setType: (type: WidgetType) => void;
  setSourceId: (sourceId: string) => void;
  setActiveTab: (tab: WidgetFormTab) => void;
  setWidgetTitle: (title: string) => void;
  setWidgetDescription: (description: string) => void;
  setVisibility: (visibility: 'public' | 'private') => void;
  initializeForm: (params: InitializeFormParams) => void;
  loadSourceData: (
    sourceId: string,
    data: Record<string, unknown>[],
    columns: string[],
    columnTypes: Record<string, string>,
  ) => void;
  updateConfig: <K extends keyof WidgetFormConfig>(key: K, value: WidgetFormConfig[K]) => void;
  updateWidgetParam: (key: string, value: unknown) => void;
  addMetric: () => void;
  updateMetric: (index: number, updates: Partial<MetricConfig>) => void;
  removeMetric: (index: number) => void;
  moveMetric: (fromIndex: number, toIndex: number) => void;
  addBucket: () => void;
  updateBucket: (index: number, updates: Partial<BucketConfig>) => void;
  removeBucket: (index: number) => void;
  moveBucket: (fromIndex: number, toIndex: number) => void;
  addGlobalFilter: () => void;
  updateGlobalFilter: (index: number, updates: Partial<GlobalFilter>) => void;
  removeGlobalFilter: (index: number) => void;
  updateMetricStyle: (index: number, updates: Partial<MetricStyle>) => void;
  resetForm: () => void;
  setErrors: (errors: Record<string, string>) => void;
}

export interface InitializeFormParams {
  type: WidgetType;
  sourceId?: string;
  existingConfig?: Partial<WidgetFormConfig>;
  widgetTitle?: string;
  widgetDescription?: string;
}

export interface FieldSchema {
  default: unknown;
  inputType: 'text' | 'number' | 'color' | 'checkbox' | 'select' | 'color-array';
  label: string;
  placeholder?: string;
  group?: string;
  key?: string;
  options?: SelectOption[];
}
