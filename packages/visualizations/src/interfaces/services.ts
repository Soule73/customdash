import type {
  Metric,
  MetricStyle,
  WidgetParams,
  ProcessedData,
  TableColumn,
  ScatterMetricConfig,
  BubbleMetricConfig,
  RadarMetricConfig,
  ScatterChartConfig,
  BubbleChartConfig,
  RadarChartConfig,
  KPIConfig,
  KPIGroupConfig,
  CardConfig,
  TableWidgetConfig,
  Filter,
} from './common';
import type { ParsedKPIWidgetParams } from './kpi';
import type { EChartsWidgetParams } from '../types/echarts.types';
import type { FormatType, TrendDirection } from '../types';
import type { processBubbleMetrics, calculateBubbleScales } from '../utils/bubbleChartUtils';
import type { processScatterMetrics, calculateScatterScales } from '../utils/scatterChartUtils';
import type { processRadarMetrics } from '../utils/radarChartUtils';
import type { detectTableConfigType } from '../utils/tableUtils';

export interface ChartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExtendedWidgetParams extends WidgetParams {
  echarts?: EChartsWidgetParams;
}

export interface ExtendedDatasetParams {
  showValues?: boolean;
  showGrid?: boolean;
  xLabel?: string;
  yLabel?: string;
  pointRadius?: number;
  echarts?: EChartsWidgetParams;
  [key: string]: unknown;
}

export interface DatasetMetricConfig {
  x?: string;
  y?: string;
  r?: string;
  fields?: string[];
  agg?: string;
  label?: string;
}

export interface ChartDataContext {
  filteredData: Record<string, unknown>[];
  processedData: ProcessedData | null;
  labels: string[];
  metrics: Metric[];
  metricStyles: MetricStyle[];
  params: ExtendedWidgetParams;
}

export interface DatasetChartContext<TMetric extends DatasetMetricConfig> {
  filteredData: Record<string, unknown>[];
  metrics: TMetric[];
  metricStyles: MetricStyle[];
  params: ExtendedDatasetParams;
  validation: ChartValidationResult;
}

export interface ScatterDataContext {
  widgetParams: ExtendedWidgetParams;
  echartsConfig: EChartsWidgetParams | undefined;
  scatterConfig: EChartsWidgetParams['scatter'] | undefined;
  validMetrics: ScatterMetricConfig[];
  metricStyles: MetricStyle[];
  validation: ChartValidationResult;
  processedMetrics: ReturnType<typeof processScatterMetrics>;
  scales: ReturnType<typeof calculateScatterScales>;
}

export interface ScatterChartInput {
  data: Record<string, unknown>[];
  config: ScatterChartConfig & { echarts?: EChartsWidgetParams };
}

export interface BubbleDataContext {
  widgetParams: ExtendedWidgetParams;
  echartsConfig: EChartsWidgetParams | undefined;
  scatterConfig: EChartsWidgetParams['scatter'] | undefined;
  validMetrics: BubbleMetricConfig[];
  metricStyles: MetricStyle[];
  validation: ChartValidationResult;
  processedMetrics: ReturnType<typeof processBubbleMetrics>;
  scales: ReturnType<typeof calculateBubbleScales>;
}

export interface BubbleChartInput {
  data: Record<string, unknown>[];
  config: BubbleChartConfig & { echarts?: EChartsWidgetParams };
}

export interface RadarIndicator {
  name: string;
  max: number;
}

export interface RadarDataItem {
  name: string;
  value: number[];
  itemStyle: { color: string };
  lineStyle: { color: string; width: number };
  areaStyle?: { color: string; opacity: number };
}

export interface RadarDataContext {
  widgetParams: ExtendedWidgetParams;
  echartsConfig: EChartsWidgetParams | undefined;
  radarConfig: EChartsWidgetParams['radar'] | undefined;
  validMetrics: RadarMetricConfig[];
  metricStyles: MetricStyle[];
  validation: ChartValidationResult;
  labels: string[];
  processedMetrics: ReturnType<typeof processRadarMetrics>;
  radarIndicators: RadarIndicator[];
}

export interface RadarChartInput {
  data: Record<string, unknown>[];
  config: RadarChartConfig & { echarts?: EChartsWidgetParams };
}

export interface KPIDataContext {
  filteredData: Record<string, unknown>[];
  metric: Metric | undefined;
  widgetParams: ParsedKPIWidgetParams;
  title: string;
  valueColor: string;
  titleColor: string;
}

export interface KPIProcessedResult {
  value: number | string;
  title: string;
  valueColor: string;
  titleColor: string;
  showTrend: boolean;
  showValue: boolean;
  trendType: string;
  showPercent: boolean;
  trend: TrendDirection;
  trendValue: number | string;
  trendPercent: number;
  trendColor: string;
}

export interface KPIWidgetInput {
  data: Record<string, unknown>[];
  config: KPIConfig;
}

export interface KPIGroupDataContext {
  columns: number;
  groupTitle: string;
  metrics: Metric[];
  metricStyles: MetricStyle[];
  filters: Filter[] | undefined;
  widgetParamsList: Array<Record<string, unknown>>;
}

export interface KPIGroupInput {
  config: KPIGroupConfig;
}

export interface ParsedCardWidgetParams {
  format: FormatType;
  currency: string;
  decimals: number;
  description: string;
  icon: string;
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
  showIcon: boolean;
}

export interface CardDataContext {
  filteredData: Record<string, unknown>[];
  metric: Metric | undefined;
  widgetParams: ParsedCardWidgetParams;
  title: string;
  validation: ChartValidationResult;
}

export interface CardProcessedResult {
  formattedValue: string;
  title: string;
  description: string;
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
  showIcon: boolean;
  iconName: string;
}

export interface CardWidgetInput {
  data: Record<string, unknown>[];
  config: CardConfig;
}

type ServiceTableConfigType = ReturnType<typeof detectTableConfigType>;

export interface TableDataContext {
  filteredData: Record<string, unknown>[];
  configType: ServiceTableConfigType;
  columns: TableColumn[];
  displayData: Record<string, unknown>[];
  tableTitle: string;
  isValid: boolean;
  pageSize: number;
}

export interface TableProcessedData {
  searchedData: Record<string, unknown>[];
  sortedData: Record<string, unknown>[];
  paginatedData: Record<string, unknown>[];
  totalRows: number;
  totalPages: number;
}

export interface TableWidgetInput {
  data: Record<string, unknown>[];
  config: TableWidgetConfig;
}

export interface TablePaginationParams {
  currentPage: number;
  pageSize: number;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
}
