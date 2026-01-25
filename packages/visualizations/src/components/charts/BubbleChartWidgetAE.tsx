import type { JSX } from 'react';
import type { BubbleChartConfig } from '../../interfaces';
import { useBubbleChartVMAE } from '../../hooks/useBubbleChartVMAE';
import { BaseChartAE } from './BaseChartAE';

export interface BubbleChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: BubbleChartConfig;
  height?: number;
  className?: string;
  loading?: boolean;
  editMode?: boolean;
}

/**
 * BubbleChartWidgetAE component rendering a bubble chart using Apache ECharts
 */
export function BubbleChartWidgetAE({
  data,
  config,
  height = 350,
  className = '',
  loading = false,
  editMode = false,
}: BubbleChartWidgetAEProps): JSX.Element {
  const { option, isValid, validationErrors } = useBubbleChartVMAE({ data, config });

  if (!isValid) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Invalid configuration</p>
        {validationErrors.map((error, idx) => (
          <p key={idx} className="text-red-500 text-sm">
            {error}
          </p>
        ))}
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
      editMode={editMode}
    />
  );
}

export default BubbleChartWidgetAE;
