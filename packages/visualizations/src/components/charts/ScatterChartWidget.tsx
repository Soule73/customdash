import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useScatterChartVM } from '../../hooks/useScatterChartVM';
import type { ScatterChartConfig } from '../../interfaces';
import type { JSX } from 'react';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export interface ScatterChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: ScatterChartConfig;
  height?: number | string;
  className?: string;
}

/**
 * ScatterChart component to display scatter plot charts
 * @param {ScatterChartWidgetComponentProps} props - The component props
 * @returns {JSX.Element} The ScatterChart component
 *
 * @example
 * <ScatterChartWidget
 *    data={[{ height: 170, weight: 70 }, ...]}
 *    config={{
 *      metrics: [
 *        {
 *          field: 'weight',
 *          agg: 'sum',
 *          x: 'height',
 *          y: 'weight',
 *          label: 'Weight vs Height',
 *        },
 *      ],
 *    }}
 *    height={400}
 *    className="my-custom-class"
 * />
 */
export default function ScatterChartWidget({
  data,
  config,
  height = 400,
  className = '',
}: ScatterChartWidgetComponentProps): JSX.Element {
  const { chartData, options, validDatasets, isValid, validationErrors } = useScatterChartVM({
    data,
    config,
  });

  if (!config?.metrics || !Array.isArray(config.metrics) || validDatasets.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Invalid configuration</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Configuration errors:</p>
        <ul className="text-sm text-red-500 dark:text-red-400 mt-2">
          {validationErrors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
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
    <div
      className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 ${className}`}
      style={{ height }}
    >
      <Scatter data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
