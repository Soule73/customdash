import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useScatterChartVM } from '../../hooks/useScatterChartVM';
import type { ScatterChartConfig } from '../../types';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export interface ScatterChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: ScatterChartConfig;
  height?: number | string;
  className?: string;
}

/**
 * Composant ScatterChart pour afficher des graphiques en nuage de points
 */
export default function ScatterChartWidget({
  data,
  config,
  height = 400,
  className = '',
}: ScatterChartWidgetComponentProps) {
  const { chartData, options, validDatasets, isValid, validationErrors } = useScatterChartVM({
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
      <Scatter data={chartData} options={options} className="max-w-full max-h-full" />
    </div>
  );
}
