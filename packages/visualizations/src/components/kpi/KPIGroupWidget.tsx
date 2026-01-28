import { useKPIGroupVM, type KPIGroupInput } from '../../hooks/useKPIGroupVM';
import type { Metric } from '../../interfaces';
import KPIWidget from './KPIWidget';
import { VisualizationContainer } from '../common';

/**
 * KPI Group widget component displaying multiple KPIs in a responsive grid layout.
 * @param data - The dataset to visualize.
 * @param config - Configuration for the KPI group widget.
 * @returns A grid of KPI widgets or appropriate messages for invalid configuration or no data.
 *
 * @example
 * const data = [
 *   { date: '2024-01', revenue: 45000, orders: 120 },
 *   { date: '2024-02', revenue: 52000, orders: 145 },
 *   { date: '2024-03', revenue: 48000, orders: 130 },
 *   { date: '2024-04', revenue: 61000, orders: 165 },
 * ];
 * const config = {
 *   metrics: [
 *     { field: 'revenue', agg: 'sum', label: 'Total Revenue' },
 *     { field: 'orders', agg: 'sum', label: 'Total Orders' },
 *   ],
 *   widgetParamsList: [
 *     { showTrend: true, format: 'currency' },
 *     { showTrend: false, format: 'number' },
 *   ],
 *   gridColumns: 2,
 * };
 * <KPIGroupWidget
 *   data={data}
 *   config={config}
 * />
 */
export default function KPIGroupWidget({ data, config }: KPIGroupInput) {
  const { metrics, gridColumns, widgetParamsList } = useKPIGroupVM(config);

  if (!data || !config.metrics || !Array.isArray(config.metrics) || !config.metrics[0]) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">Invalid configuration</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <VisualizationContainer>
      <div
        className="grid gap-4 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        }}
      >
        {metrics.map((metric: Metric, idx: number) => (
          <KPIWidget
            key={idx}
            data={data}
            config={{
              metrics: [metric],
              globalFilters: config.globalFilters,
              widgetParams: widgetParamsList[idx],
            }}
          />
        ))}
      </div>
    </VisualizationContainer>
  );
}
