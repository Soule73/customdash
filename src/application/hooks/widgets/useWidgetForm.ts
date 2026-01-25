import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWidgetFormStore } from '@stores/widgetFormStore';
import { useDataSources } from '@hooks/datasource.queries';
import { widgetService } from '@services/widget.service';
import { dataSourceService } from '@services/data-source.service';
import { useNotifications } from '../useNotifications';
import type { WidgetType, WidgetParams } from '@customdash/visualizations';
import type { MetricConfig, BucketConfig, WidgetFormConfig } from '@type/widget-form.types';

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
  const { showSuccess, showError } = useNotifications();
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
        showError('Erreur lors du chargement des donnees');
      }
    },
    [store, showError],
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
      } catch {
        showError('Erreur lors du chargement du widget');
        navigate(-1);
      }
    },
    [store, navigate, showError, loadSourceData],
  );

  useEffect(() => {
    if (widgetId) {
      loadWidget(widgetId);
    } else {
      store.resetForm();
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
        metrics: store.config.metrics.map(m => ({
          field: m.field,
          agg: m.agg,
          label: m.label,
        })),
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
        showSuccess('Widget mis a jour avec succes');
      } else {
        await widgetService.create({
          title: store.widgetTitle,
          type: store.type,
          dataSourceId: store.sourceId,
          description: store.widgetDescription,
          config,
        });
        showSuccess('Widget cree avec succes');
      }

      store.resetForm();
      navigate(dashboardId ? `/dashboards/${dashboardId}` : '/widgets');
    } catch {
      showError('Erreur lors de la sauvegarde du widget');
    } finally {
      setIsSaving(false);
    }
  }, [isEditMode, widgetId, dashboardId, navigate, showSuccess, showError, store]);

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
