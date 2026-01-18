import { useMemo } from 'react';
import type { Metric, KPIConfig, FilterableConfig } from '../interfaces';
import {
  applyKPIFilters,
  calculateKPIValue,
  calculateKPITrend,
  formatValue,
  getKPITrendColor,
  getKPITitle,
  getKPIValueColor,
  getKPIWidgetParams,
} from '../utils';
import type { TrendDirection } from '../types';

export interface KPIWidgetVM {
  value: number | string;
  title: string;
  valueColor: string;
  titleColor: string;
  showTrend: boolean;
  showValue: boolean;
  trendType: string;
  trend: TrendDirection;
  trendValue: number | string;
  trendPercent: number;
  showPercent: boolean;
  trendColor: string;
}

export interface KPIWidgetProps {
  data: Record<string, unknown>[];
  config: KPIConfig;
}

/**
 * ViewModel hook for KPIWidget handling data processing, formatting and trend calculation
 * @param props - The properties for the KPI widget
 * @returns The ViewModel containing filtered data, value, title, colors, trend info, and formatting functions
 *
 * @example
 * const data = [
 *   { date: '2024-01', revenue: 45000 },
 *   { date: '2024-02', revenue: 52000 },
 *   { date: '2024-03', revenue: 48000 },
 *   { date: '2024-04', revenue: 61000 },
 * ];
 * const config = {
 *   metrics: [{ field: 'revenue', agg: 'sum', label: 'Total Revenue' }],
 *   globalFilters: [
 *   { field: 'region', operator: 'equals', value: 'North America' },
 *  ],
 *   widgetParams: {
 *     format: 'currency',
 *     currency: 'USD',
 *     showTrend: true,
 *   },
 * };
 * const kpiWidgetVM = useKPIWidgetVM({ data, config });
 * // Result: {
 * //   value: '$61,000.00',
 * //   title: 'Total Revenue',
 * //   valueColor: '#10b981',
 * //   titleColor: '#2563eb',
 * //   showTrend: true,
 * //   trend: 'up',
 * //   trendValue: 13000,
 * //   trendPercent: 21.31,
 * //   trendColor: '#34d399',
 * // }
 */
export function useKPIWidgetVM({ data, config }: KPIWidgetProps): KPIWidgetVM {
  const filteredData = useMemo(() => {
    return applyKPIFilters(data, config as FilterableConfig);
  }, [data, config]);

  const metric: Metric | undefined = config.metrics?.[0];

  const { showTrend, showValue, format, currency, decimals, trendType, showPercent, threshold } =
    getKPIWidgetParams(config);

  const value = useMemo(() => {
    const kPIValue = calculateKPIValue(metric, filteredData);
    const val = formatValue(kPIValue, format, { decimals, currency });
    return val;
  }, [filteredData, metric, format, decimals, currency]);

  const title = getKPITitle(config, metric, 'KPI');

  const valueColor = getKPIValueColor(config);

  const titleColor = config.widgetParams?.titleColor || '#2563eb';

  const { trend, trendValue, trendPercent } = useMemo(() => {
    return calculateKPITrend(metric, filteredData, showTrend);
  }, [showTrend, metric, filteredData]);

  const trendColor = useMemo(() => {
    return getKPITrendColor(trend, trendPercent, threshold);
  }, [trend, trendPercent, threshold]);

  return {
    value,
    title,
    valueColor,
    titleColor,
    showTrend,
    showValue,
    trendType,
    showPercent,
    trend,
    trendValue,
    trendPercent,
    trendColor,
  };
}
