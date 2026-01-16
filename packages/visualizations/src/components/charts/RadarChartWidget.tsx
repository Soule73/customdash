import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useRadarChartVM, type RadarChartWidgetProps } from '../../hooks/useRadarChartVM';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

/**
 * RadarChart widget component displaying multi-axis comparison data
 */
export default function RadarChartWidget({ data, config }: RadarChartWidgetProps) {
  const { chartData, options, validDatasets, isValid, validationErrors } = useRadarChartVM({
    data,
    config,
  });

  if (!data || !config.metrics || !Array.isArray(config.metrics) || validDatasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Configuration invalide</p>
      </div>
    );
  }

  if (!isValid && validationErrors.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-red-500 dark:text-red-400 font-medium mb-2">Erreurs de configuration:</p>
        <ul className="text-sm text-red-400 dark:text-red-300">
          {validationErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnee disponible</p>
      </div>
    );
  }

  return (
    <div className="shadow bg-white dark:bg-gray-900 rounded-lg w-full max-w-full h-full flex items-center justify-center overflow-hidden p-4">
      <Radar
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: '100%', maxWidth: '100%', height: 'auto', minWidth: 0 }}
      />
    </div>
  );
}
