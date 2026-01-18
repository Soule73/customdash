import type { SelectOption } from './interfaces';
import type {
  BucketType,
  DateInterval,
  AggregationType,
  FilterOperator,
  ChartType,
  FormatType,
} from './types';

/**
 * Default chart color palette for visualizations
 */
export const DEFAULT_CHART_COLORS: readonly string[] = [
  '#6366f1',
  '#f59e42',
  '#10b981',
  '#ef4444',
  '#fbbf24',
  '#3b82f6',
  '#a21caf',
  '#14b8a6',
  '#eab308',
  '#f472b6',
] as const;

/**
 * Bucket type options for data grouping
 */
export const BUCKET_TYPE_OPTIONS: SelectOption<BucketType>[] = [
  { value: 'terms', label: 'Terms', description: 'Group by field values (categories)' },
  { value: 'histogram', label: 'Histogram', description: 'Group by numeric intervals' },
  { value: 'date_histogram', label: 'Date Histogram', description: 'Group by time intervals' },
  { value: 'range', label: 'Ranges', description: 'Group by custom ranges' },
  { value: 'split_series', label: 'Split into Series', description: 'Create one series per value' },
  { value: 'split_rows', label: 'Split into Rows', description: 'Create one row per value' },
  {
    value: 'split_chart',
    label: 'Split into Charts',
    description: 'Create a separate chart per value',
  },
];

/**
 * Date interval options for date histograms
 */
export const DATE_INTERVAL_OPTIONS: SelectOption<DateInterval>[] = [
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

/**
 * Sort order options for data ordering
 */
export const SORT_ORDER_OPTIONS: SelectOption<'asc' | 'desc'>[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

/**
 * Aggregation type options for metrics
 */
export const AGGREGATION_TYPE_OPTIONS: SelectOption<AggregationType>[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'none', label: 'None' },
];

/**
 * Filter operator options for data filtering
 */
export const FILTER_OPERATOR_OPTIONS: SelectOption<FilterOperator>[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does not contain' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'greater_equal', label: 'Greater or equal' },
  { value: 'less_equal', label: 'Less or equal' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
];

/**
 * Valid filter operators array
 */
export const VALID_FILTER_OPERATORS: FilterOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
  'starts_with',
  'ends_with',
];

/**
 * Legend position options for charts
 */
export const LEGEND_POSITION_OPTIONS: SelectOption<'top' | 'bottom' | 'left' | 'right'>[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

/**
 * Chart type options
 */
export const CHART_TYPE_OPTIONS: SelectOption<ChartType>[] = [
  { value: 'bar', label: 'Bar Chart', description: 'Compare values across categories' },
  { value: 'line', label: 'Line Chart', description: 'Show trends over time' },
  { value: 'pie', label: 'Pie Chart', description: 'Show proportions of a whole' },
  {
    value: 'scatter',
    label: 'Scatter Chart',
    description: 'Show correlation between two variables',
  },
  { value: 'bubble', label: 'Bubble Chart', description: 'Show three-dimensional data points' },
  {
    value: 'radar',
    label: 'Radar Chart',
    description: 'Compare multiple metrics across categories',
  },
];

/**
 * Format type options for value formatting
 */
export const FORMAT_TYPE_OPTIONS: SelectOption<FormatType>[] = [
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency' },
  { value: 'percent', label: 'Percentage' },
  { value: 'date', label: 'Date' },
  { value: 'text', label: 'Text' },
];

/**
 * Default formatting configuration
 */
export const DEFAULT_FORMAT_CONFIG = {
  locale: 'en-US',
  currency: 'USD',
  decimals: 2,
  nullValue: '-',
} as const;

/**
 * Default widget parameters
 */
export const DEFAULT_WIDGET_PARAMS = {
  title: '',
  legendPosition: 'top' as const,
  xLabel: '',
  yLabel: '',
  labelFormat: '{label}: {value} ({percent}%)',
  tooltipFormat: '{label}: {value}',
  titleAlign: 'center' as const,
  labelFontSize: 12,
  labelColor: '#000000',
  legend: true,
  showGrid: true,
  showValues: false,
  stacked: false,
  horizontal: false,
  showPoints: true,
  tension: 0,
  borderWidth: 1,
  borderRadius: 0,
  pointRadius: 3,
  showTicks: true,
} as const;

/**
 * Default KPI widget parameters
 */
export const DEFAULT_KPI_PARAMS = {
  showTrend: true,
  showValue: true,
  format: 'number' as const,
  currency: 'USD',
  decimals: 2,
  trendType: 'percent' as const,
  showPercent: true,
  threshold: 0,
} as const;

/**
 * Default KPI colors
 */
export const DEFAULT_KPI_COLORS = {
  icon: '#6366f1',
  value: '#2563eb',
  description: '#6b7280',
  trendUp: 'text-green-600',
  trendDown: 'text-red-600',
} as const;

/**
 * Default locale and currency settings
 */
export const DEFAULT_LOCALE = 'en-US' as const;

/**
 * Default currency code
 */
export const DEFAULT_CURRENCY = 'USD' as const;

/**
 * Default representation for null or undefined values
 */
export const DEFAULT_NULL_VALUE = '-' as const;
/**
 * Locales that typically place currency symbol before the amount
 */
export const CURRENCY_SYMBOL_BEFORE_LOCALES: string[] = [
  'en-US',
  'en-GB',
  'en-AU',
  'en-CA',
  'en-NZ',
  'en-IE',
  'en-ZA',
  'ja-JP',
  'zh-CN',
  'zh-TW',
  'ko-KR',
] as const;

/**
 * Currencies that typically display with code after the amount
 */
export const CURRENCY_CODE_AFTER_CURRENCIES: string[] = [
  'EUR',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'CZK',
  'HUF',
  'RON',
  'BGN',
] as const;

/**
 * Common currency options
 */
export const CURRENCY_OPTIONS: SelectOption<string>[] = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)' },
  { value: 'AUD', label: 'Australian Dollar (AUD)' },
];

/**
 * HSL color generation defaults
 */
export const HSL_COLOR_DEFAULTS = {
  saturation: 70,
  lightness: 60,
  hueStep: 60,
} as const;

/**
 * Chart default configurations
 */
export const CHART_DEFAULTS = {
  maxDataPoints: 100,
  minBucketSize: 1,
  defaultBucketSize: 10,
  animationDuration: 300,
} as const;

/**
 * Table default configurations
 */
export const TABLE_DEFAULTS = {
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100] as const,
  defaultSortOrder: 'asc' as const,
} as const;

/**
 * Valid filter operators
 */
export const VALID_OPERATORS: FilterOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
  'starts_with',
  'ends_with',
];
