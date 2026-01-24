import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';
import { usePieChartVM } from '../../hooks/usePieChartVM';
import type { ChartConfig, WidgetParams } from '../../interfaces';
import type { JSX } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export interface PieChartWidgetComponentProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  widgetParams?: WidgetParams;
  height?: number | string;
  className?: string;
}

/**
 * PieChart component to display pie charts
 * @param {PieChartWidgetComponentProps} props - The component props
 * @returns {JSX.Element} The PieChart component
 *
 * @example
 * <PieChartWidget
 *    data={[{ category: 'Electronics', sales: 4500 }, ...]}
 *    config={{
 *      metrics: [{ field: 'sales', agg: 'sum', label: 'Sales' }],
 *      buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
 *    }}
 *    widgetParams={{ legend: true }}
 *    height={300}
 *    className="my-custom-class"
 * />
 */
export default function PieChartWidget({
  data,
  config,
  widgetParams,
  // height = 300,
  className = '',
}: PieChartWidgetComponentProps): JSX.Element {
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
    //   className={`w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-center justify-center ${className}`}
    //   style={{ height }}
    // >
    <Pie
      data={chartData}
      options={options}
      // className="max-w-full max-h-full"
      className="p-1 md:p-2"
      style={{ width: '100%', maxWidth: '100%', height: 'auto', minWidth: 0 }}
    />
    // </div>
  );
}
