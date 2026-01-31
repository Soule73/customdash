import type {
  FilterOperator,
  AggregationType,
  BucketType,
  SortOrder,
  DateInterval,
  SplitType,
  TitleAlign,
  LegendPosition,
  FormatType,
  TrendType,
  WidgetType,
  TextAlign,
  ChartType,
} from '../types';
import type { EChartsWidgetParams } from '../types/echarts.types';

export interface ThemeColors {
  textColor?: string;
  labelColor?: string;
  gridColor?: string;
  tooltipBackground?: string;
  tooltipTextColor?: string;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

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
  width?: string;
  align?: TextAlign;
  format?: FormatType;
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
  order?: SortOrder;
  size?: number;
  minDocCount?: number;
  interval?: number;
  dateInterval?: DateInterval;
  ranges?: RangeConfig[];
  splitType?: SplitType;
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
  width?: string;
  align?: TextAlign;
  format?: FormatType;
}

export interface BaseChartConfig {
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: WidgetParams;
  themeColors?: ThemeColors;
}

export interface ChartConfig extends BaseChartConfig {
  metrics: Metric[];
  buckets?: MultiBucketConfig[];
  styles?: ChartStyles;
  groupBy?: string;
}

export interface WidgetParams {
  title?: string;
  titleAlign?: TitleAlign;
  legend?: boolean;
  legendPosition?: LegendPosition;
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
  cutout?: string;
  format?: FormatType;
  currency?: string;
  decimals?: number;
  echarts?: EChartsWidgetParams;
}

export interface ScatterMetricConfig extends Metric {
  x: string;
  y: string;
  datasetFilters?: Filter[];
}

export interface BubbleMetricConfig extends ScatterMetricConfig {
  r: string;
}

export interface BubbleChartConfig extends BaseChartConfig {
  metrics: BubbleMetricConfig[];
}

export interface ScatterChartConfig extends BaseChartConfig {
  metrics: ScatterMetricConfig[];
}

export interface RadarChartConfig extends BaseChartConfig {
  metrics: Metric[];
  groupBy?: string;
}

export interface KPIWidgetParams extends WidgetParams {
  showTrend?: boolean;
  showValue?: boolean;
  format?: FormatType;
  currency?: string;
  decimals?: number;
  trendType?: TrendType;
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
  globalFilters?: Filter[];
  widgetParams?: KPIWidgetParams;
  themeColors?: ThemeColors;
}

export interface KPIGroupConfig {
  metrics: Metric[];
  globalFilters?: Filter[];
  metricStyles?: MetricStyle[];
  widgetParams?: KPIGroupWidgetParams;
  themeColors?: ThemeColors;
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
  themeColors?: ThemeColors;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: TextAlign;
  format?: FormatType;
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
  metricStyles?: MetricStyle[];
  widgetParams?: TableWidgetParams;
  themeColors?: ThemeColors;
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

export interface BaseDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  [key: string]: unknown;
}
