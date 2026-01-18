import type { JSX } from 'react';
import { useCardWidgetVM, type CardWidgetProps } from '../../hooks/useCardWidgetVM';

interface IconProps {
  name: string;
  color: string;
}

function CardIcon({ name, color }: IconProps) {
  const iconPaths: Record<string, string> = {
    'chart-bar':
      'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
    'currency-dollar':
      'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    users:
      'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
    'shopping-cart':
      'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z',
    'arrow-trending-up':
      'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
  };

  const path = iconPaths[name] || iconPaths['chart-bar'];

  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

/**
 * Card widget component displaying a metric with icon, title and description
 * @param {CardWidgetProps} props - The component props
 * @returns {JSX.Element} The CardWidget component
 *
 * @example
 * <CardWidget
 *    data={[{ sales: 150000 }]}
 *    config={{
 *      metrics: [{ field: 'sales', agg: 'sum', label: 'Total Sales' }],
 *      widgetParams: {
 *        title: 'Sales Overview',
 *        description: 'Total sales this month',
 *        icon: 'currency-dollar',
 *        iconColor: '#10b981',
 *        valueColor: '#047857',
 *        format: 'currency',
 *        currency: 'USD',
 *      },
 *    }}
 * />
 */
export default function CardWidget({ data, config }: CardWidgetProps): JSX.Element {
  const {
    formattedValue,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    iconName,
  } = useCardWidgetVM({ data, config });

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
    <div className="flex flex-col h-full shadow items-center justify-center max-h-full bg-white dark:bg-gray-900 w-full max-w-full rounded-lg p-4 transition-colors">
      {showIcon && (
        <span className="mb-2">
          <CardIcon name={iconName} color={iconColor} />
        </span>
      )}
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{title}</span>
      <span className="text-3xl font-extrabold mt-1" style={{ color: valueColor }}>
        {formattedValue}
      </span>
      {description && (
        <span
          className="text-xs mt-1 text-gray-500 dark:text-gray-400"
          style={{ color: descriptionColor }}
        >
          {description}
        </span>
      )}
    </div>
  );
}
