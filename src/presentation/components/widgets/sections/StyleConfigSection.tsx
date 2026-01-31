import { useTranslation } from 'react-i18next';
import { Card } from '@customdash/ui';
import { MetricStyleFields } from '../fields/SchemaField';
import { widgetRegistry } from '@core/widgets';
import {
  useWidgetFormType,
  useWidgetFormMetrics,
  useWidgetFormMetricStyles,
  useWidgetFormActions,
} from '@stores';

/**
 * StyleConfigSection component for configuring metric styles per metric
 */
export function StyleConfigSection() {
  const { t } = useTranslation();
  const type = useWidgetFormType();
  const metrics = useWidgetFormMetrics();
  const metricStyles = useWidgetFormMetricStyles();
  const { updateMetricStyle } = useWidgetFormActions();

  const configSchema = widgetRegistry.getConfigSchema(type);
  const metricStylesSchema = configSchema?.metricStyles || {};
  const hasStyleOptions = Object.keys(metricStylesSchema).length > 0;

  if (!hasStyleOptions) {
    return (
      <Card>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('widgets.styles.noStyles')}
        </p>
      </Card>
    );
  }

  if (metrics.length === 0) {
    return (
      <Card>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('widgets.styles.addMetricsFirst')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          {t('widgets.styles.perMetric')}
        </h3>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const style = metricStyles[index] || {};
            return (
              <MetricStyleFields
                key={metric.id}
                metricIndex={index}
                metricLabel={metric.label || `${t('widgets.metrics.singular')} ${metric.field}`}
                styles={style}
                schema={metricStylesSchema}
                onChange={updateMetricStyle}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
