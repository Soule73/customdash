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

export type WidgetType = ChartType | 'kpi' | 'card' | 'kpiGroup' | 'table';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | (string | number)[];
}

export interface Metric {
  field: string;
  agg: AggregationType;
  label?: string;
  filters?: Filter[];
}

export interface RangeConfig {
  from?: number;
  to?: number;
  label?: string;
}

export interface MultiBucketConfig {
  field: string;
  label?: string;
  type: BucketType;
  order?: 'asc' | 'desc';
  size?: number;
  minDocCount?: number;
  interval?: number;
  dateInterval?: DateInterval;
  ranges?: RangeConfig[];
  splitType?: 'series' | 'rows' | 'chart';
}

export interface Bucket {
  field: string;
  label?: string;
}

export interface ChartStyles {
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
  barThickness?: number;
  borderRadius?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  pointStyle?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  opacity?: number;
  cutout?: string;
}

export interface MetricStyle extends ChartStyles {
  color?: string;
  colors?: string[];
}

export interface ChartConfig {
  metrics: Metric[];
  buckets?: MultiBucketConfig[];
  globalFilters?: Filter[];
  styles?: ChartStyles;
  metricStyles?: MetricStyle[];
}

export interface WidgetParams {
  title?: string;
  titleAlign?: 'start' | 'center' | 'end';
  legend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  showLegend?: boolean;
  showTooltip?: boolean;
  xLabel?: string;
  yLabel?: string;
  showGrid?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  tooltipFormat?: string;
  labelFormat?: string;
  labelColor?: string;
  labelFontSize?: number;
  borderWidth?: number;
  barThickness?: number;
  borderRadius?: number;
  tension?: number;
  showPoints?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  pointRadius?: number;
}

export interface ScatterMetricConfig extends Metric {
  x: string;
  y: string;
  datasetFilters?: Filter[];
}

export interface BubbleMetricConfig extends ScatterMetricConfig {
  r: string;
}

export interface RadarMetricConfig {
  agg: AggregationType;
  fields: string[];
  label?: string;
  filters?: Filter[];
  datasetFilters?: Filter[];
}

export interface BubbleChartConfig {
  metrics: BubbleMetricConfig[];
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: WidgetParams;
}

export interface ScatterChartConfig {
  metrics: ScatterMetricConfig[];
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: WidgetParams;
}

export interface RadarChartConfig {
  metrics: RadarMetricConfig[];
  buckets?: MultiBucketConfig[];
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: WidgetParams;
}

export interface KPIWidgetParams extends WidgetParams {
  showTrend?: boolean;
  showValue?: boolean;
  format?: 'number' | 'currency' | 'percent';
  currency?: string;
  decimals?: number;
  trendType?: 'arrow' | 'caret';
  showPercent?: boolean;
  trendThreshold?: number;
  valueColor?: string;
  titleColor?: string;
}

export interface KPIGroupWidgetParams extends KPIWidgetParams {
  columns?: number;
}

export interface KPIConfig {
  metrics?: Metric[];
  metric?: Metric;
  globalFilters?: Filter[];
  widgetParams?: KPIWidgetParams;
}

export interface KPIGroupConfig {
  metrics: Metric[];
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: KPIGroupWidgetParams;
}

export interface CardWidgetParams extends KPIWidgetParams {
  description?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  descriptionColor?: string;
}

export interface CardConfig {
  metrics: Metric[];
  globalFilters?: Filter[];
  widgetParams?: CardWidgetParams;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'date' | 'percent';
}

export interface TableWidgetParams extends WidgetParams {
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  striped?: boolean;
  compact?: boolean;
}

export interface TableWidgetConfig {
  columns?: TableColumn[];
  metrics?: Metric[];
  buckets?: MultiBucketConfig[];
  globalFilters?: Filter[];
  widgetParams?: TableWidgetParams;
}

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  dataSourceId: string;
  config: ChartConfig | KPIConfig;
  widgetParams?: WidgetParams;
}

export interface BucketItem {
  key: string;
  keyAsString?: string;
  docCount: number;
  data: Record<string, unknown>[];
}

export interface BucketLevel {
  bucket: MultiBucketConfig;
  level: number;
  buckets: BucketItem[];
  data: Record<string, unknown>[];
}

export interface SplitItem {
  key: string;
  data: Record<string, unknown>[];
  bucket: MultiBucketConfig;
}

export interface SplitData {
  series: SplitItem[];
  rows: SplitItem[];
  charts: SplitItem[];
}

export interface ProcessedData {
  groupedData: Record<string, unknown>[];
  labels: string[];
  bucketHierarchy: BucketLevel[];
  splitData: SplitData;
}

export interface DatasetCreationContext {
  chartType: ChartType;
  labels: string[];
  widgetParams: WidgetParams;
  metrics: Metric[];
  metricStyles: MetricStyle[];
  processedData: ProcessedData;
  getValues: (metric: Metric) => number[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
