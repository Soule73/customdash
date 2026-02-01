import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWidgetFormStore } from '@stores';
import { widgetService } from '@services/widget.service';
import { dataSourceService } from '@services/data-source.service';
import type { WidgetType, WidgetParams } from '@customdash/visualizations';
import type { MetricConfig, BucketConfig, WidgetFormConfig } from '@type/widget-form.types';
import { useNotifications, useErrorHandler, useAppTranslation } from '../common';
import { useDataSources } from '../queries';

interface UseWidgetFormOptions {
  widgetId?: string;
  dashboardId?: string;
  initialSourceId?: string;
  initialType?: WidgetType;
}

interface UseWidgetFormReturn {
  sources: Array<{ value: string; label: string }>;
  isSaving: boolean;
  isEditMode: boolean;
  actions: {
    setSourceId: (sourceId: string) => Promise<void>;
    save: () => Promise<void>;
    cancel: () => void;
  };
}

/**
 * Custom hook for managing the widget form initialization and save actions
 */
export function useWidgetForm(options: UseWidgetFormOptions = {}): UseWidgetFormReturn {
  const { widgetId, dashboardId, initialSourceId, initialType } = options;
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const { handleApiError } = useErrorHandler();
  const { t } = useAppTranslation();
  const { data: dataSources } = useDataSources();
  const [isSaving, setIsSaving] = useState(false);

  const store = useWidgetFormStore();
  const isEditMode = Boolean(widgetId);

  const sources = useMemo(() => {
    const list = dataSources || [];
    return list.map(ds => ({
      value: ds.id,
      label: ds.name,
    }));
  }, [dataSources]);

  const loadSourceData = useCallback(
    async (sourceId: string) => {
      if (!sourceId) return;
      try {
        const data = await dataSourceService.getData(sourceId);
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        const columnTypes = columns.reduce(
          (acc, col) => {
            const sample = data.find(
              (row: Record<string, unknown>) => row[col] !== null && row[col] !== undefined,
            );
            acc[col] = sample ? typeof sample[col] : 'string';
            return acc;
          },
          {} as Record<string, string>,
        );
        store.loadSourceData(sourceId, data, columns, columnTypes);
      } catch (error) {
        console.error('Erreur loadSourceData:', error);
        handleApiError(error, 'fetch');
      }
    },
    [store, handleApiError],
  );

  const loadWidget = useCallback(
    async (id: string) => {
      try {
        const widget = await widgetService.getById(id);
        const widgetConfig = widget.config;
        const mappedConfig = {
          metrics: widgetConfig.metrics?.map((m, i) => ({
            id: `metric-${i}`,
            field: m.field,
            agg: m.agg as MetricConfig['agg'],
            label: m.label || '',
            x: (m as Record<string, unknown>).x as string | undefined,
            y: (m as Record<string, unknown>).y as string | undefined,
            r: (m as Record<string, unknown>).r as string | undefined,
            fields: (m as Record<string, unknown>).fields as string[] | undefined,
          })),
          buckets: widgetConfig.buckets?.map((b, i) => ({
            id: `bucket-${i}`,
            field: b.field,
            type: b.type as BucketConfig['type'],
            label: b.label,
            size: b.size,
            interval: b.interval,
          })),
          globalFilters: widgetConfig.globalFilters,
          metricStyles: widgetConfig.metricStyles,
          widgetParams: widgetConfig.widgetParams as WidgetParams,
        };
        store.initializeForm({
          type: widget.type as WidgetType,
          sourceId: widget.dataSourceId,
          existingConfig: mappedConfig as Partial<WidgetFormConfig>,
          widgetTitle: widget.title,
          widgetDescription: widget.description || '',
        });
        await loadSourceData(widget.dataSourceId);
      } catch (error) {
        handleApiError(error, 'load');
        navigate(-1);
      }
    },
    [store, navigate, handleApiError, loadSourceData],
  );

  useEffect(() => {
    store.resetForm();

    if (widgetId) {
      loadWidget(widgetId);
    } else {
      if (initialType) {
        store.setType(initialType);
      }
      if (initialSourceId) {
        store.setSourceId(initialSourceId);
        loadSourceData(initialSourceId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId, initialSourceId, initialType]);

  const setSourceId = useCallback(
    async (sourceId: string) => {
      store.setSourceId(sourceId);
      await loadSourceData(sourceId);
    },
    [store, loadSourceData],
  );

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const config = {
        metrics: store.config.metrics.map((m, index) => {
          const metricStyle = store.config.metricStyles[index] || {};
          return {
            field: m.field,
            agg: m.agg,
            label: m.label,
            x: m.x,
            y: m.y,
            r: m.r,
            fields: m.fields,
            width: metricStyle.width || m.width,
            align: metricStyle.align || m.align,
            format: metricStyle.format || m.format,
          };
        }),
        buckets: store.config.buckets.map(b => ({
          field: b.field,
          type: b.type,
          label: b.label,
          size: b.size,
          interval: b.interval,
        })),
        globalFilters: store.config.globalFilters.map(f => ({
          field: f.field,
          operator: f.operator,
          value: f.value,
        })),
        widgetParams: store.config.widgetParams as Record<string, unknown>,
        metricStyles: store.config.metricStyles as Array<Record<string, unknown>>,
      };

      if (isEditMode && widgetId) {
        await widgetService.update(widgetId, {
          title: store.widgetTitle,
          description: store.widgetDescription,
          config,
        });
        showSuccess(t('widgets.notifications.updateSuccess'));
      } else {
        await widgetService.create({
          title: store.widgetTitle,
          type: store.type,
          dataSourceId: store.sourceId,
          description: store.widgetDescription,
          config,
        });
        showSuccess(t('widgets.notifications.createSuccess'));
      }

      store.resetForm();
      navigate(dashboardId ? `/dashboards/${dashboardId}` : '/widgets');
    } catch (error) {
      handleApiError(error, 'save');
    } finally {
      setIsSaving(false);
    }
  }, [isEditMode, widgetId, dashboardId, navigate, showSuccess, handleApiError, store, t]);

  const cancel = useCallback(() => {
    store.resetForm();
    navigate(-1);
  }, [navigate, store]);

  return {
    sources,
    isSaving,
    isEditMode,
    actions: {
      setSourceId,
      save,
      cancel,
    },
  };
}
