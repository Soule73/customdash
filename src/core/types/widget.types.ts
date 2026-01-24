export type WidgetType =
  | 'kpi'
  | 'card'
  | 'kpiGroup'
  | 'bar'
  | 'line'
  | 'pie'
  | 'table'
  | 'radar'
  | 'bubble'
  | 'scatter';

export type Visibility = 'private' | 'public';

export interface WidgetConfig {
  metrics?: MetricConfig[];
  buckets?: BucketConfig[];
  globalFilters?: FilterConfig[];
  styles?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MetricConfig {
  field: string;
  type: 'sum' | 'avg' | 'count' | 'min' | 'max';
  alias?: string;
}

export interface BucketConfig {
  field: string;
  format?: string;
}

export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'regex'
  | 'is_null'
  | 'is_not_null';

export interface Widget {
  id: string;
  widgetId: string;
  title: string;
  description?: string;
  type: WidgetType;
  dataSourceId: string;
  ownerId: string;
  config: WidgetConfig;
  visibility: Visibility;
  isGeneratedByAI: boolean;
  isDraft: boolean;
  reasoning?: string;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWidgetData {
  title: string;
  type: WidgetType;
  dataSourceId: string;
  description?: string;
  config?: WidgetConfig;
  visibility?: Visibility;
  isGeneratedByAI?: boolean;
  isDraft?: boolean;
  reasoning?: string;
  confidence?: number;
}

export interface UpdateWidgetData {
  title?: string;
  description?: string;
  config?: WidgetConfig;
  visibility?: Visibility;
  isDraft?: boolean;
}
