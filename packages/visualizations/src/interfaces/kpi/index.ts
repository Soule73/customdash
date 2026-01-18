import type { FormatType, TrendDirection } from '../../types';
import type { Filter, Metric } from '../common';

export interface FilterableConfig {
  globalFilters?: Filter[];
  metrics?: Metric[];
}

export interface ParsedKPIWidgetParams {
  showTrend: boolean;
  showValue: boolean;
  format: FormatType;
  currency: string;
  decimals: number;
  trendType: string;
  showPercent: boolean;
  threshold: number;
}

export interface KPITrendResult {
  trend: TrendDirection;
  trendValue: number | string;
  trendPercent: number;
}

export interface KPICardColors {
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
}
