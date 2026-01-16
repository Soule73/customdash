import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartConfig, WidgetParams } from '../../types';
import { useBarChartVM } from '../../hooks/useBarChartVM';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number;
  className?: string;
}

/**
 * Widget BarChart avec support des filtres et buckets multiples
 */
export function BarChartWidget({
  data,
  config,
  widgetParams = {},
  height = 300,
  className = '',
}: BarChartWidgetProps) {
  const { chartData, options } = useBarChartVM({ data, config, widgetParams });

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
        <p className="text-gray-500 dark:text-gray-400">Configuration invalide</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Aucune donnee disponible</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 ${className}`}
      style={{ height }}
    >
      <Bar data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}

export default BarChartWidget;
