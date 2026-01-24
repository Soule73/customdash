import type {
  WidgetType,
  AggregationType,
  FilterOperator,
  BucketType,
  DateInterval,
  SortOrder,
  LegendPosition,
  TitleAlign,
  FormatType,
  TrendType,
} from '@customdash/visualizations';

import type {
  SelectOption,
  Filter,
  RangeConfig,
  MetricStyle,
  ChartStyles,
  WidgetParams,
} from '@customdash/visualizations';

export type {
  AggregationType,
  FilterOperator,
  BucketType,
  DateInterval,
  SortOrder,
  LegendPosition,
  TitleAlign,
  FormatType,
  TrendType,
  SelectOption,
  RangeConfig,
  ChartStyles,
};

export type GlobalFilter = Filter;
export type MetricStyleConfig = MetricStyle;
export type WidgetParamsConfig = WidgetParams;

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
  metricStyles: MetricStyleConfig[];
  widgetParams: WidgetParamsConfig;
}

export type WidgetFormTab = 'data' | 'style' | 'params';

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
  updateMetricStyle: (index: number, updates: Partial<MetricStyleConfig>) => void;
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

export interface WidgetDefinitionConfig {
  type: WidgetType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enableFilter?: boolean;
  allowMultipleMetrics?: boolean;
  hideBucket?: boolean;
  configSchema: {
    metricStyles: Record<string, FieldSchema>;
    widgetParams: Record<string, FieldSchema>;
    globalFilters?: FieldSchema;
  };
}

export interface FieldSchema {
  default: unknown;
  inputType: 'text' | 'number' | 'color' | 'checkbox' | 'select' | 'color-array';
  label: string;
  group?: string;
  key?: string;
  options?: SelectOption[];
}

export type DatasetType = 'xy' | 'xyr' | 'multiAxis' | 'metric';

export interface DataConfigEntry {
  metrics: {
    allowMultiple: boolean;
    defaultAgg: AggregationType;
    allowedAggs: SelectOption<AggregationType>[];
    label: string;
  };
  buckets?: {
    allow: boolean;
    allowMultiple: boolean;
    label: string;
    allowedTypes: SelectOption<BucketType>[];
  };
  datasetType?: DatasetType;
  useMetricSection?: boolean;
  useMetricStyles?: boolean;
  useDatasetSection?: boolean;
  useGlobalFilters?: boolean;
  useBuckets?: boolean;
  allowMultipleDatasets?: boolean;
  allowMultipleMetrics?: boolean;
  datasetSectionTitle?: string;
}

export interface WidgetConfig {
  metrics?: MetricConfig[];
  buckets?: BucketConfig[];
  globalFilters?: GlobalFilter[];
  styles?: WidgetParamsConfig;
  metricStyles?: MetricStyleConfig[];
}
