import type { Metric, Filter } from '../types';
import { applyAllFilters } from './filterUtils';

export interface FilterableConfig {
  globalFilters?: Filter[];
  metrics?: Metric[];
}

export interface StylableConfig {
  metricStyles?: Record<string, unknown> | Record<string, unknown>[];
  widgetParams?: Record<string, unknown>;
}

export interface ParsedKPIWidgetParams {
  showTrend: boolean;
  showValue: boolean;
  format: string;
  currency: string;
  decimals: number;
  trendType: string;
  showPercent: boolean;
  threshold: number;
}

export interface KPITrendResult {
  trend: 'up' | 'down' | null;
  trendValue: number;
  trendPercent: number;
}

export interface KPICardColors {
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
}

/**
 * Applies filters to KPI data
 */
export function applyKPIFilters(
  data: Record<string, unknown>[],
  config: FilterableConfig,
): Record<string, unknown>[] {
  let baseData = data;

  if (config.globalFilters && config.globalFilters.length > 0) {
    baseData = applyAllFilters(baseData, config.globalFilters, []);
  }

  const metric = config.metrics?.[0];
  if (metric && metric.filters && metric.filters.length > 0) {
    baseData = applyAllFilters(baseData, metric.filters, []);
  }

  return baseData;
}

/**
 * Calculates KPI value from filtered data
 */
export function calculateKPIValue(
  metric: Metric | undefined,
  filteredData: Record<string, unknown>[],
): number {
  if (!metric) return 0;
  if (!filteredData || filteredData.length === 0) return 0;

  const field = metric.field;
  const values = filteredData.map((row: Record<string, unknown>) => Number(row[field]) || 0);

  return aggregateValues(values, metric.agg);
}

/**
 * Aggregates an array of values according to aggregation type
 */
export function aggregateValues(values: number[], aggregationType: string): number {
  if (values.length === 0) return 0;

  switch (aggregationType) {
    case 'sum':
      return values.reduce((a: number, b: number) => a + b, 0);
    case 'avg':
      return values.reduce((a: number, b: number) => a + b, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'count':
      return values.length;
    default:
      return values[0] || 0;
  }
}

/**
 * Extracts value color from widget params
 */
export function getKPIValueColor(config: StylableConfig, defaultColor: string = '#2563eb'): string {
  const valueColor = config.widgetParams?.valueColor;
  return (typeof valueColor === 'string' ? valueColor : undefined) || defaultColor;
}

/**
 * Extracts colors for Card widgets from widget params
 */
export function getCardColors(config: StylableConfig): KPICardColors {
  const params = config.widgetParams || {};

  const iconColor =
    (typeof params.iconColor === 'string' ? params.iconColor : undefined) || '#6366f1';
  const valueColor =
    (typeof params.valueColor === 'string' ? params.valueColor : undefined) || '#2563eb';
  const descriptionColor =
    (typeof params.descriptionColor === 'string' ? params.descriptionColor : undefined) ||
    '#6b7280';

  return { iconColor, valueColor, descriptionColor };
}

/**
 * Calculates trend data for a KPI
 */
export function calculateKPITrend(
  metric: Metric | undefined,
  filteredData: Record<string, unknown>[],
  showTrend: boolean,
): KPITrendResult {
  let trend: 'up' | 'down' | null = null;
  let trendValue = 0;
  let trendPercent = 0;

  if (showTrend && metric && filteredData && filteredData.length > 1) {
    const field = metric.field;
    const last = Number(filteredData[filteredData.length - 1][field]) || 0;
    const prev = Number(filteredData[filteredData.length - 2][field]) || 0;
    const diff = last - prev;

    trend = diff !== 0 ? (diff > 0 ? 'up' : 'down') : null;
    trendValue = diff;

    if (prev !== 0) {
      trendPercent = (diff / Math.abs(prev)) * 100;
    }
  }

  return { trend, trendValue, trendPercent };
}

/**
 * Formats a value according to the specified format
 */
export function formatKPIValue(
  value: number,
  format: string = 'number',
  decimals: number = 2,
  currency: string = 'EUR',
): string {
  if (format === 'currency') {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
    });
  }

  if (format === 'percent') {
    return (value * 100).toFixed(decimals) + '%';
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Gets trend color based on type and threshold
 */
export function getKPITrendColor(
  trend: 'up' | 'down' | null,
  trendPercent: number,
  threshold: number = 0,
): string {
  if (trend === null) return '';

  if (threshold && Math.abs(trendPercent) >= threshold) {
    return trend === 'up' ? 'text-green-700' : 'text-red-700';
  }

  return trend === 'up' ? 'text-green-500' : 'text-red-500';
}

/**
 * Extracts the title of a KPI widget
 */
export function getKPITitle(
  config: { widgetParams?: { title?: string } },
  metric: Metric | undefined,
  defaultTitle: string = 'KPI',
): string {
  return config.widgetParams?.title || metric?.label || metric?.field || defaultTitle;
}

/**
 * Extracts common parameters from a KPI widget
 */
export function getKPIWidgetParams(config: {
  widgetParams?: Record<string, unknown>;
}): ParsedKPIWidgetParams {
  const params = config.widgetParams || {};

  return {
    showTrend: params.showTrend !== false,
    showValue: params.showValue !== false,
    format: (typeof params.format === 'string' ? params.format : undefined) || 'number',
    currency: (typeof params.currency === 'string' ? params.currency : undefined) || 'EUR',
    decimals: (typeof params.decimals === 'number' ? params.decimals : undefined) ?? 2,
    trendType: (typeof params.trendType === 'string' ? params.trendType : undefined) || 'arrow',
    showPercent: params.showPercent === true,
    threshold: (typeof params.trendThreshold === 'number' ? params.trendThreshold : undefined) ?? 0,
  };
}
