import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useBubbleChartVM } from '../../hooks/useBubbleChartVM';
import type { BubbleChartConfig } from '../../interfaces';
import type { JSX } from 'react';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export interface BubbleChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: BubbleChartConfig;
  height?: number | string;
  className?: string;
}

/**
 * Component BubbleChart to display bubble charts
 * @param {BubbleChartWidgetComponentProps} props - The component props
 * @returns {JSX.Element} The BubbleChart component
 *
 * @example
 * <BubbleChartWidget
 *    data={[{ age: 25, salary: 35000, experience: 2 }, ...]}
 *    config={{
 *      metrics: [
 *        {
 *          field: 'salary',
 *          agg: 'sum',
 *          x: 'age',
 *          y: 'salary',
 *          r: 'experience',
 *          label: 'Employees',
 *        },
 *      ],
 *    }}
 *    height={400}
 *    className="my-custom-class"
 * />
 */
export default function BubbleChartWidget({
  data,
  config,
  height = 400,
  className = '',
}: BubbleChartWidgetComponentProps): JSX.Element {
  const { chartData, options, validDatasets, isValid, validationErrors } = useBubbleChartVM({
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
      <Bubble data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
