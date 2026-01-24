import type { JSX } from 'react';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { useBarChartVMAE } from '../../hooks/useBarChartVMAE';
import { BaseChartAE } from './BaseChartAE';

export interface BarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number;
  className?: string;
  loading?: boolean;
}

/**
 * BarChartWidgetAE component rendering a bar chart using Apache ECharts
 * @param props - The properties for the Bar Chart widget
 * @returns JSX.Element representing the Bar Chart
 *
 * @example
 * const data = [
 *   { category: 'A', value: 30 },
 *   { category: 'B', value: 50 },
 *   { category: 'C', value: 40 },
 * ];
 * const config = {
 *   buckets: [{ field: 'category' }],
 *   metrics: [{ field: 'value', agg: 'sum', label: 'Total Value' }],
 *   widgetParams: {
 *     title: 'Sample Bar Chart',
 *     showLegend: true,
 *   },
 * };
 * <BarChartWidgetAE data={data} config={config} height={400} />
 */
export function BarChartWidgetAE({
  data,
  config,
  widgetParams,
  height = 300,
  className = '',
  loading = false,
}: BarChartWidgetAEProps): JSX.Element {
  const { option } = useBarChartVMAE({ data, config, widgetParams });

  const hasValidConfig =
    config.metrics &&
    config.metrics.length > 0 &&
    config.buckets &&
    config.buckets.length > 0 &&
    config.buckets[0]?.field;

  if (!hasValidConfig) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Invalid configuration</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <BaseChartAE
      option={option}
      className={className}
      style={{ height, minHeight: height }}
      loading={loading}
    />
  );
}

export default BarChartWidgetAE;
