import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLineChartVM } from '../../hooks/useLineChartVM';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import type { JSX } from 'react';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export interface LineChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number | string;
  className?: string;
}

/**
 * Component LineChart to display line charts
 * @param {LineChartWidgetComponentProps} props - The component props
 * @returns {JSX.Element} The LineChart component
 *
 * @example
 * <LineChartWidget
 *    data={[{ month: 'January', temperature: 5 }, ...]}
 *    config={{
 *      metrics: [{ field: 'temperature', agg: 'avg', label: 'Temperature (C)' }],
 *      buckets: [{ field: 'month', type: 'terms', label: 'Month' }],
 *    }}
 *    widgetParams={{ legend: true }}
 *    height={300}
 *    className="my-custom-class"
 * />
 */
export default function LineChartWidget({
  data,
  config,
  widgetParams = {},
  height = 300,
  className = '',
}: LineChartWidgetComponentProps): JSX.Element {
  const { chartData, options } = useLineChartVM({ data, config, widgetParams });

  if (
    !config?.metrics ||
    !config?.buckets ||
    config.metrics.length === 0 ||
    config.buckets.length === 0
  ) {
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
    <div
      className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 ${className}`}
      style={{ height }}
    >
      <Line data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
