import { useMemo } from 'react';
import type { KPIConfig, KPIDataContext } from '../interfaces';
import type { TrendDirection } from '../types';
import { KPIWidgetService } from '../core/services/KPIWidgetService';

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

export interface KPIWidgetInput {
  data: Record<string, unknown>[];
  config: KPIConfig;
}

/**
 * ViewModel hook for KPIWidget handling data processing, formatting and trend calculation
 * Uses KPIWidgetService for business logic
 */
export function useKPIWidgetVM({ data, config }: KPIWidgetInput): KPIWidgetVM {
  const context = useMemo<KPIDataContext>(
    () => KPIWidgetService.createDataContext({ data, config }),
    [data, config],
  );

  const value = useMemo(() => KPIWidgetService.calculateValue(context), [context]);

  const trendResult = useMemo(() => KPIWidgetService.calculateTrend(context), [context]);

  const trendColor = useMemo(
    () =>
      KPIWidgetService.getTrendColor(
        trendResult.trend,
        trendResult.trendPercent,
        context.widgetParams.threshold,
      ),
    [trendResult, context.widgetParams.threshold],
  );

  return {
    value,
    title: context.title,
    valueColor: context.valueColor,
    titleColor: context.titleColor,
    showTrend: context.widgetParams.showTrend,
    showValue: context.widgetParams.showValue,
    trendType: context.widgetParams.trendType,
    showPercent: context.widgetParams.showPercent,
    trend: trendResult.trend,
    trendValue: trendResult.trendValue,
    trendPercent: trendResult.trendPercent,
    trendColor,
  };
}
