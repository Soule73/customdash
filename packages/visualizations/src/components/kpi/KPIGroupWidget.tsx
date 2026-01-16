import { useKPIGroupVM, type KPIGroupWidgetProps } from '../../hooks/useKPIGroupVM';
import type { Metric } from '../../types';
import KPIWidget from './KPIWidget';

/**
 * KPI Group widget component displaying multiple KPIs in a responsive grid layout
 */
export default function KPIGroupWidget({ data, config }: KPIGroupWidgetProps) {
  const { metrics, gridColumns, widgetParamsList } = useKPIGroupVM(config);

  if (!data || !config.metrics || !Array.isArray(config.metrics) || !config.metrics[0]) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">Configuration invalide</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnee disponible</p>
      </div>
    );
  }

  return (
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
  );
}
