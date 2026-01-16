import { useMemo } from 'react';
import type { Metric, CardConfig } from '../types';
import {
  applyKPIFilters,
  calculateKPIValue,
  getCardColors,
  getKPITitle,
  getKPIWidgetParams,
  formatKPIValue,
  type StylableConfig,
  type FilterableConfig,
} from '../utils/kpiUtils';

export interface CardWidgetVM {
  formattedValue: string;
  title: string;
  description: string;
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
  showIcon: boolean;
  iconName: string;
}

export interface CardWidgetProps {
  data: Record<string, unknown>[];
  config: CardConfig;
}

/**
 * ViewModel hook for CardWidget handling data processing, formatting and styling
 */
export function useCardWidgetVM({ data, config }: CardWidgetProps): CardWidgetVM {
  const filteredData = useMemo(() => {
    return applyKPIFilters(data, config as FilterableConfig);
  }, [data, config]);

  const metric: Metric | undefined = config.metrics?.[0];

  const value = useMemo(() => {
    return calculateKPIValue(metric, filteredData);
  }, [filteredData, metric]);

  const title = getKPITitle(config, metric, 'Synthese');

  const description =
    (typeof config.widgetParams?.description === 'string'
      ? config.widgetParams.description
      : undefined) || '';

  const { iconColor, valueColor, descriptionColor } = getCardColors(config as StylableConfig);

  const showIcon = config.widgetParams?.showIcon !== false;

  const iconName =
    (typeof config.widgetParams?.icon === 'string' ? config.widgetParams.icon : undefined) ||
    'chart-bar';

  const { format, decimals, currency } = getKPIWidgetParams(
    config as { widgetParams?: Record<string, unknown> },
  );

  const formattedValue = formatKPIValue(value, format, decimals, currency);

  return {
    formattedValue,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    iconName,
  };
}
