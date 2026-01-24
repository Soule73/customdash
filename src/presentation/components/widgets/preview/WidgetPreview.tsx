import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Spinner } from '@customdash/ui';
import type {
  WidgetType,
  Metric,
  MultiBucketConfig,
  Filter,
  WidgetParams,
} from '@customdash/visualizations';
import { WIDGET_COMPONENTS } from '@core/config';
import {
  useWidgetFormType,
  useWidgetFormData,
  useWidgetFormConfig,
  useWidgetFormMetrics,
} from '@stores/widgetFormStore';

interface WidgetPreviewProps {
  isLoading?: boolean;
}

interface PreviewChartConfig {
  metrics: Metric[];
  buckets: MultiBucketConfig[];
  globalFilters: Filter[];
  metricStyles: Record<string, unknown>[];
  widgetParams: WidgetParams;
}

function useChartConfig(): PreviewChartConfig {
  const config = useWidgetFormConfig();
  const type = useWidgetFormType();

  return useMemo(() => {
    const isDatasetChart = type === 'scatter' || type === 'bubble' || type === 'radar';

    const metrics: Metric[] = config.metrics
      .filter(m => {
        if (isDatasetChart) {
          if (type === 'scatter') return m.x && m.y;
          if (type === 'bubble') return m.x && m.y && m.r;
          if (type === 'radar') return m.fields && m.fields.length > 0;
        }
        return m.field;
      })
      .map(m => ({
        field: m.field,
        agg: m.agg,
        label: m.label || m.field,
        x: m.x,
        y: m.y,
        r: m.r,
        fields: m.fields,
      }));

    const buckets: MultiBucketConfig[] = config.buckets
      .filter(b => b.field)
      .map(b => ({
        field: b.field,
        type: b.type || 'terms',
        label: b.label || b.field,
        size: b.size,
        interval: b.interval,
      }));

    const globalFilters: Filter[] = config.globalFilters
      .filter(f => f.field && f.value !== undefined)
      .map(f => ({
        field: f.field,
        operator: f.operator,
        value: f.value,
      }));

    const metricStyles = config.metricStyles.map(s => ({ ...s }));

    return {
      metrics,
      buckets,
      globalFilters,
      metricStyles,
      widgetParams: config.widgetParams || {},
    };
  }, [config, type]);
}

/**
 * WidgetPreview component for live preview of widget configuration
 */
export function WidgetPreview({ isLoading = false }: WidgetPreviewProps) {
  const { t } = useTranslation();
  const type = useWidgetFormType();
  const data = useWidgetFormData();
  const metrics = useWidgetFormMetrics();
  const chartConfig = useChartConfig();

  const hasRequiredConfig = useMemo(() => {
    if (metrics.length === 0) return false;

    const isDatasetChart = type === 'scatter' || type === 'bubble' || type === 'radar';
    if (isDatasetChart) {
      return metrics.some(m => {
        if (type === 'scatter') return m.x && m.y;
        if (type === 'bubble') return m.x && m.y && m.r;
        if (type === 'radar') return m.fields && m.fields.length > 0;
        return false;
      });
    }

    return metrics.some(m => m.field);
  }, [metrics, type]);

  if (isLoading) {
    return (
      <Card className="flex h-full min-h-100 items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-2 text-sm text-gray-500">{t('widgets.loadingData')}</p>
        </div>
      </Card>
    );
  }

  if (!hasRequiredConfig) {
    return (
      <Card className="flex h-full min-h-100 items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-sm">{t('widgets.configureMetrics')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-100 overflow-hidden">
      <WidgetRenderer type={type} data={data} config={chartConfig} />
    </Card>
  );
}

interface WidgetRendererProps {
  type: WidgetType;
  data: Record<string, unknown>[];
  config: PreviewChartConfig;
}

function WidgetRenderer({ type, data, config }: WidgetRendererProps) {
  const { t } = useTranslation();
  const WidgetComponent = WIDGET_COMPONENTS[type];

  if (!WidgetComponent) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        {t('widgets.unsupportedType')}: {type}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <WidgetComponent data={data} config={config} />
    </div>
  );
}
