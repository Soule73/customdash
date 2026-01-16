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
import type { ChartConfig, WidgetParams } from '../../types';

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
 * Composant LineChart pour afficher des graphiques en lignes
 */
export default function LineChartWidget({
  data,
  config,
  widgetParams = {},
  height = 300,
  className = '',
}: LineChartWidgetComponentProps) {
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
      <Line data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
