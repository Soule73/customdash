import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import { useBarChartVM } from '../../hooks/useBarChartVM';
import type { JSX } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartDataLabels);

export interface BarChartWidgetProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number;
  className?: string;
}

/**
 * BarChartWidget component rendering a bar chart using Chart.js
 * @param props - The properties for the Bar Chart widget
 * @returns JSX.Element representing the Bar Chart
 *
 * @example
 * const data = [
 *   { category: 'A', value: 30 },
 *   { category: 'B', value: 50 },
 *   { category: 'C', value: 40 },
 * ];
 * const config = {
 *   buckets: [{ field: 'category' }],
 *   metrics: [{ field: 'value', agg: 'sum', label: 'Total Value' }],
 *   widgetParams: {
 *     title: 'Sample Bar Chart',
 *     showLegend: true,
 *   },
 * };
 * <BarChartWidget data={data} config={config} height={400} />
 */
export function BarChartWidget({
  data,
  config,
  widgetParams,
  // height = 300,
  className = '',
}: BarChartWidgetProps): JSX.Element {
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
    // <div
    //   // className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 ${className}`}
    //   // style={{ height }}
    //   className=" w-full max-w-full h-full flex items-center justify-center overflow-hidden"
    // >
    <Bar
      data={chartData}
      options={options}
      // className="max-w-full max-h-full"
      className="max-w-full max-h-full p-1 md:p-2"
      style={{ width: '100%', maxWidth: '100%', height: 'auto', minWidth: 0 }}
    />
    // </div>
  );
}

export default BarChartWidget;
