import type { ChartOptions } from 'chart.js';

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none';

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'starts_with'
  | 'ends_with';

export type BucketType =
  | 'terms'
  | 'histogram'
  | 'date_histogram'
  | 'range'
  | 'split_series'
  | 'split_rows'
  | 'split_chart';

export type DateInterval = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'radar';

export type ChartOptionsType = ChartOptions<
  'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'radar'
>;

export type WidgetType = ChartType | 'kpi' | 'card' | 'kpiGroup' | 'table';

export type FormatType = 'number' | 'currency' | 'percent' | 'date' | 'text';

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right';

export type TextAlign = 'left' | 'center' | 'right';

export type TitleAlign = 'start' | 'center' | 'end';

export type SortOrder = 'asc' | 'desc';

export type TrendDirection = 'up' | 'down' | null;

export type TrendType = 'arrow' | 'caret';

export type SplitType = 'series' | 'rows' | 'chart';
