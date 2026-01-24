import type { JSX } from 'react';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { usePieChartVMAE } from '../../hooks/usePieChartVMAE';
import { BaseChartAE } from './BaseChartAE';

export interface PieChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number;
  className?: string;
  loading?: boolean;
}

/**
 * PieChartWidgetAE component rendering a pie/donut chart using Apache ECharts
 */
export function PieChartWidgetAE({
  data,
  config,
  widgetParams,
  height = 300,
  className = '',
  loading = false,
}: PieChartWidgetAEProps): JSX.Element {
  const { option } = usePieChartVMAE({ data, config, widgetParams });

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

export default PieChartWidgetAE;
