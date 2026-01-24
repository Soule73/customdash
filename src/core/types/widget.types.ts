import type { WidgetType } from '@customdash/visualizations';

export type { WidgetType };

export type Visibility = 'private' | 'public';

export interface WidgetConfigData {
  metrics?: Array<{
    field: string;
    agg: string;
    label?: string;
  }>;
  buckets?: Array<{
    field: string;
    type: string;
    label?: string;
    size?: number;
    interval?: number;
  }>;
  globalFilters?: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
  styles?: Record<string, unknown>;
  metricStyles?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface Widget {
  id: string;
  widgetId: string;
  title: string;
  description?: string;
  type: WidgetType;
  dataSourceId: string;
  ownerId: string;
  config: WidgetConfigData;
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
  config?: WidgetConfigData;
  visibility?: Visibility;
  isGeneratedByAI?: boolean;
  isDraft?: boolean;
  reasoning?: string;
  confidence?: number;
}

export interface UpdateWidgetData {
  title?: string;
  description?: string;
  config?: WidgetConfigData;
  visibility?: Visibility;
  isDraft?: boolean;
}
