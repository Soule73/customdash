import { useMemo } from 'react';
import type { Metric, CardConfig, FilterableConfig } from '../interfaces';
import {
  applyKPIFilters,
  calculateKPIValue,
  getCardColors,
  getKPITitle,
  getKPIWidgetParams,
  formatValue,
} from '../utils';

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
 * @param props - The properties for the Card widget
 * @returns The ViewModel containing formatted value, title, description, colors, and icon info
 *
 * @example
 * const data = [
 *   { date: '2024-01', sales: 1500 },
 *   { date: '2024-02', sales: 1800 },
 *   { date: '2024-03', sales: 1700 },
 * ];
 * const config = {
 *   metrics: [{ field: 'sales', agg: 'sum', label: 'Total Sales' }],
 *   globalFilters: [
 *     { field: 'region', operator: 'equals', value: 'Europe' },
 *   ],
 *   widgetParams: {
 *     format: 'currency',
 *     currency: 'EUR',
 *     description: 'Sales in Europe',
 *     icon: 'shopping-cart',
 *     iconColor: '#10b981',
 *     valueColor: '#ef4444',
 *     descriptionColor: '#6b7280',
 *     showIcon: true,
 *   },
 * };
 * const cardWidgetVM = useCardWidgetVM({ data, config });
 * // Result: {
 * //   formattedValue: '€5,100.00',
 * //   title: 'Total Sales',
 * //   description: 'Sales in Europe',
 * //   iconColor: '#10b981',
 * //   valueColor: '#ef4444',
 * //   descriptionColor: '#6b7280',
 * //   showIcon: true,
 * //   iconName: 'shopping-cart',
 * // }
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

  const { iconColor, valueColor, descriptionColor } = getCardColors(config);

  const showIcon = config.widgetParams?.showIcon !== false;

  const iconName = useMemo(() => {
    return (
      (typeof config.widgetParams?.icon === 'string' ? config.widgetParams.icon : undefined) ||
      'chart-bar'
    );
  }, [config]);

  const { format, decimals, currency } = useMemo(() => getKPIWidgetParams(config), [config]);

  const formattedValue = useMemo(
    () => formatValue(value, format, { decimals, currency }),
    [value, format, decimals, currency],
  );

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
