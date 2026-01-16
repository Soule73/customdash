import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useBubbleChartVM } from '../../hooks/useBubbleChartVM';
import type { BubbleChartConfig } from '../../types';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export interface BubbleChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: BubbleChartConfig;
  height?: number | string;
  className?: string;
}

/**
 * Composant BubbleChart pour afficher des graphiques a bulles
 */
export default function BubbleChartWidget({
  data,
  config,
  height = 400,
  className = '',
}: BubbleChartWidgetComponentProps) {
  const { chartData, options, validDatasets, isValid, validationErrors } = useBubbleChartVM({
    data,
    config,
  });

  if (!config?.metrics || !Array.isArray(config.metrics) || validDatasets.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Configuration invalide</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">Erreurs de configuration:</p>
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
        <p className="text-gray-500 dark:text-gray-400">Aucune donnee disponible</p>
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
