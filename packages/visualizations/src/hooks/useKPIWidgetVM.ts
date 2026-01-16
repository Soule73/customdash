import { useMemo } from 'react';
import type { Metric, KPIConfig } from '../types';
import {
  applyKPIFilters,
  calculateKPIValue,
  calculateKPITrend,
  formatKPIValue,
  getKPITrendColor,
  getKPITitle,
  getKPIValueColor,
  getKPIWidgetParams,
  type StylableConfig,
  type FilterableConfig,
} from '../utils/kpiUtils';

export interface KPIWidgetVM {
  filteredData: Record<string, unknown>[];
  value: number;
  title: string;
  valueColor: string;
  titleColor: string;
  showTrend: boolean;
  showValue: boolean;
  format: string;
  currency: string;
  decimals: number;
  trendType: string;
  showPercent: boolean;
  threshold: number;
  trend: 'up' | 'down' | null;
  trendValue: number;
  trendPercent: number;
  formatValue: (val: number) => string;
  getTrendColor: () => string;
}

export interface KPIWidgetProps {
  data: Record<string, unknown>[];
  config: KPIConfig;
}

/**
 * ViewModel hook for KPIWidget handling data processing, formatting and trend calculation
 */
export function useKPIWidgetVM({ data, config }: KPIWidgetProps): KPIWidgetVM {
  const filteredData = useMemo(() => {
    return applyKPIFilters(data, config as FilterableConfig);
  }, [data, config]);

  const metric: Metric | undefined = config.metrics?.[0];

  const value = useMemo(() => {
    return calculateKPIValue(metric, filteredData);
  }, [filteredData, metric]);

  const title = getKPITitle(config, metric, 'KPI');

  const valueColor = getKPIValueColor(config as StylableConfig);

  const titleColor =
    ((config.widgetParams as Record<string, unknown>)?.titleColor as string) || '#2563eb';

  const { showTrend, showValue, format, currency, decimals, trendType, showPercent, threshold } =
    getKPIWidgetParams(config as { widgetParams?: Record<string, unknown> });

  const { trend, trendValue, trendPercent } = useMemo(() => {
    return calculateKPITrend(metric, filteredData, showTrend);
  }, [showTrend, metric, filteredData]);

  function formatValue(val: number) {
    return formatKPIValue(val, format, decimals, currency);
  }

  function getTrendColor() {
    return getKPITrendColor(trend, trendPercent, threshold);
  }

  return {
    filteredData,
    value,
    title,
    valueColor,
    titleColor,
    showTrend,
    showValue,
    format,
    currency,
    decimals,
    trendType,
    showPercent,
    threshold,
    trend,
    trendValue,
    trendPercent,
    formatValue,
    getTrendColor,
  };
}
