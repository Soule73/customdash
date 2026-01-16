import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { usePieChartVM } from '../../hooks/usePieChartVM';
import type { ChartConfig, WidgetParams } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number | string;
  className?: string;
}

/**
 * Composant PieChart pour afficher des graphiques en camembert
 */
export default function PieChartWidget({
  data,
  config,
  widgetParams = {},
  height = 300,
  className = '',
}: PieChartWidgetComponentProps) {
  const { chartData, options } = usePieChartVM({ data, config, widgetParams });

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
      className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <Pie data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
