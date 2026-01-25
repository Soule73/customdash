import type { JSX } from 'react';
import type { RadarChartConfig } from '../../interfaces';
import { useRadarChartVMAE } from '../../hooks/useRadarChartVMAE';
import { BaseChartAE } from './BaseChartAE';

export interface RadarChartWidgetAEProps {
  data: Record<string, unknown>[];
  config: RadarChartConfig;
  height?: number;
  className?: string;
  loading?: boolean;
  editMode?: boolean;
}

/**
 * RadarChartWidgetAE component rendering a radar chart using Apache ECharts
 */
export function RadarChartWidgetAE({
  data,
  config,
  height = 350,
  className = '',
  loading = false,
  editMode = false,
}: RadarChartWidgetAEProps): JSX.Element {
  const { option, isValid, validationErrors } = useRadarChartVMAE({ data, config });

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

export default RadarChartWidgetAE;
