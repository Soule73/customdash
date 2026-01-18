import type { Metric, KPIWidgetParams, KPIConfig, CardConfig } from '../interfaces';
import type {
  FilterableConfig,
  ParsedKPIWidgetParams,
  KPITrendResult,
  KPICardColors,
} from '../interfaces';
import { applyAllFilters } from './filterUtils';
import { aggregateNumericValues } from './aggregation';
import { formatValue } from './valueFormatter';
import type { TrendDirection } from '../types';

/**
 * Applies filters to KPI data
 * @param data - The dataset to filter.
 * @param config - The configuration object containing global and metric-specific filters.
 * @returns The filtered dataset.
 *
 * @example
 * const data = [
 *  { name: 'Alice', age: 30 },
 *  { name: 'Bob', age: 25 },
 *  { name: 'Charlie', age: 35 },
 * ];
 * const config = {
 *   globalFilters: [
 *    { field: 'age', operator: 'greater_than', value: 28 },
 * ],
 *  metrics: [
 *   { field: 'age', filters: [ { field: 'name', operator: 'contains', value: 'a' } ] },
 * ],
 * };
 * const filteredData = applyKPIFilters(data, config);
 * // Result: [{ name: 'Alice', age: 30 }]
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
 * @param metric - The metric configuration for the KPI.
 * @param filteredData - The filtered dataset to calculate the KPI value from.
 * @returns The calculated KPI value as a number.
 *
 * @example
 * const metric = { field: 'sales', agg: 'sum' };
 * const filteredData = [
 *   { sales: 100 },
 *   { sales: 150 },
 * ];
 * const kpiValue = calculateKPIValue(metric, filteredData);
 * // Result: 250
 */
export function calculateKPIValue(
  metric: Metric | undefined,
  filteredData: Record<string, unknown>[],
): number {
  if (!metric) return 0;
  if (!filteredData || filteredData.length === 0) return 0;

  const field = metric.field;
  const values = filteredData.map(row => Number(row[field]) || 0);

  return aggregateNumericValues(values, metric.agg);
}

/**
 * Extracts value color from widget params
 * @param config - The configuration object containing widget parameters.
 * @param defaultColor - The default color to use if none is specified.
 * @returns The color for the KPI value.
 *
 * @example
 * const config = {
 *   widgetParams: {
 *     valueColor: '#ff0000',
 *     // Other params...
 *   },
 *  // Other config...
 * };
 * const valueColor = getKPIValueColor(config);
 * // Result: '#ff0000'
 */
export function getKPIValueColor(config: KPIConfig, defaultColor: string = '#2563eb'): string {
  const valueColor = config.widgetParams?.valueColor;
  return (typeof valueColor === 'string' ? valueColor : undefined) || defaultColor;
}

/**
 * Extracts colors for Card widgets from widget params
 * @param config - The card configuration object containing widget parameters.
 * @returns An object with iconColor, valueColor, and descriptionColor.
 *
 * @example
 * const config = {
 *   widgetParams: {
 *     iconColor: '#ff0000',
 *     valueColor: '#00ff00',
 *     descriptionColor: '#0000ff',
 *     // Other params...
 *   },
 *  // Other config...
 * };
 * const colors = getCardColors(config);
 * // Result: { iconColor: '#ff0000', valueColor: '#00ff00', descriptionColor: '#0000ff' }
 */
export function getCardColors(config: CardConfig): KPICardColors {
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
 * @param metric - The metric configuration for the KPI.
 * @param filteredData - The filtered dataset to calculate the trend from.
 * @param showTrend - A boolean indicating whether to calculate the trend.
 * @returns An object containing trend direction, trend value, and trend percentage.
 *
 * @example
 * const metric = { field: 'sales' };
 * const filteredData = [
 *   { sales: 100 },
 *   { sales: 150 },
 * ];
 * const trendData = calculateKPITrend(metric, filteredData, true);
 * // Result: { trend: 'up', trendValue: 50, trendPercent: 50 }
 */
export function calculateKPITrend(
  metric: Metric | undefined,
  filteredData: Record<string, unknown>[],
  showTrend: boolean,
): KPITrendResult {
  let trend: TrendDirection = null;
  let trendValue: number | string = 0;
  let trendPercent = 0;

  if (showTrend && metric && filteredData && filteredData.length > 1) {
    const field = metric.field;
    const last = Number(filteredData[filteredData.length - 1][field]) || 0;
    const prev = Number(filteredData[filteredData.length - 2][field]) || 0;
    const diff = last - prev;

    trend = diff !== 0 ? (diff > 0 ? 'up' : 'down') : null;
    trendValue = formatValue(diff, 'number', { decimals: 2 });

    if (prev !== 0) {
      trendPercent = (diff / Math.abs(prev)) * 100;
    }
  }

  return { trend, trendValue, trendPercent };
}

/**
 * Gets trend color based on type and threshold
 * @param trend - The trend direction ('up', 'down', or null).
 * @param trendPercent - The percentage change of the trend.
 * @param threshold - The threshold for strong trends.
 * @returns A string representing the CSS class for the trend color.
 *
 * @example
 * getKPITrendColor('up', 10, 5); // Returns 'text-green-700'
 * getKPITrendColor('down', 3, 5); // Returns 'text-red-500'
 * getKPITrendColor(null, 0); // Returns ''
 */
export function getKPITrendColor(
  trend: TrendDirection,
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
 * @param config - The configuration object containing widget parameters.
 * @param metric - The metric associated with the KPI.
 * @param defaultTitle - The default title to use if none is specified.
 * @returns The title of the KPI widget.
 *
 * @example
 * const config = { widgetParams: { title: 'Total Sales' } };
 * const metric = { label: 'Sales', field: 'sales' };
 * const title = getKPITitle(config, metric);
 * // Result: 'Total Sales'
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
 * @param config - The configuration object containing widget parameters.
 * @returns An object with parsed KPI widget parameters.
 *
 * @example
 * const config = {
 *   widgetParams: {
 *     showTrend: true,
 *     format: 'currency',
 *     currency: 'USD',
 *     decimals: 2,
 *     trendType: 'arrow',
 *     showPercent: false,
 *     trendThreshold: 5,
 *   },
 * };
 * const params = getKPIWidgetParams(config);
 * // Result: {
 * //   showTrend: true,
 * //   showValue: true,
 * //   format: 'currency',
 * //   currency: 'USD',
 * //   decimals: 2,
 * //   trendType: 'arrow',
 * //   showPercent: false,
 * //   threshold: 5,
 * // }
 */
export function getKPIWidgetParams(
  config: {
    widgetParams?: KPIWidgetParams;
  },
  defaultCurrency: string = 'USD',
): ParsedKPIWidgetParams {
  const params = config.widgetParams || {};

  return {
    showTrend: params.showTrend !== false,
    showValue: params.showValue !== false,
    format: params.format || 'number',
    currency:
      (typeof params.currency === 'string' ? params.currency : undefined) || defaultCurrency,
    decimals: (typeof params.decimals === 'number' ? params.decimals : undefined) ?? 2,
    trendType: params.trendType || 'arrow',
    showPercent: params.showPercent === true,
    threshold: (typeof params.trendThreshold === 'number' ? params.trendThreshold : undefined) ?? 0,
  };
}
