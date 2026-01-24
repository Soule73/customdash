import type { TrendDirection } from '../../types';
import { useKPIWidgetVM, type KPIWidgetProps } from '../../hooks/useKPIWidgetVM';

interface TrendIconProps {
  direction: TrendDirection;
  type: string;
}

/**
 * Trend Icon component to display up/down arrows based on trend direction and type
 * @param direction - 'up' or 'down' to indicate trend direction
 * @param type - type of icon to display ('caret' or other)
 * @return SVG icon representing the trend direction
 *
 * @example
 * <TrendIcon direction="up" type="caret" />
 * <TrendIcon direction="down" type="arrow" />
 */
function TrendIcon({ direction, type }: TrendIconProps) {
  if (type === 'caret') {
    return direction === 'up' ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  }
  return direction === 'up' ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941"
      />
    </svg>
  );
}

/**
 * KPI Widget component displaying a single key performance indicator with optional trend
 * @param data - array of data objects to visualize
 * @param config - configuration object for the KPI widget
 * @return JSX element representing the KPI widget
 *
 * @example
 * const data = [{ sales: 1000, date: '2024-01-01' }, { sales: 1200, date: '2024-01-02' }];
 * const config = {
 *   metrics: ['sales'],
 *   title: 'Total Sales',
 *   valueColor: '#4CAF50',
 *   titleColor: '#000000',
 *   showTrend: true,
 *   trendType: 'caret',
 *   showPercent: true,
 * };
 * <KPIWidget data={data} config={config} />
 */
export default function KPIWidget({ data, config }: KPIWidgetProps) {
  const {
    value,
    title,
    valueColor,
    titleColor,
    showTrend,
    showValue,
    trendType,
    showPercent,
    trend,
    trendValue,
    trendPercent,
    trendColor,
  } = useKPIWidgetVM({ data, config });

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
    <div
      // className="p-1 md:p-2"
      style={{ width: '100%', maxWidth: '100%', height: '100%', minWidth: 0 }}
      className="flex flex-col items-center justify-center bg-white dark:bg-gray-900  p-4 transition-colors"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1" style={{ color: titleColor }}>
        {title}
      </span>
      {showValue && (
        <span
          className="text-4xl font-bold text-gray-900 dark:text-white"
          style={{ color: valueColor }}
        >
          {value}
        </span>
      )}
      {showTrend && trend && (
        <span className={`flex items-center gap-1 text-xs mt-1 ${trendColor}`}>
          <TrendIcon direction={trend} type={trendType} />
          {showPercent
            ? `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`
            : `${trend === 'up' ? '+' : ''}${trendValue}`}
        </span>
      )}
    </div>
  );
}
