/**
 * Metrics Slice - Widget Form Store
 *
 * @description Gère les métriques et leurs styles
 * @module stores/widget-form/metricsSlice
 */
import { widgetFormService } from '@core/widgets';
import type { MetricStyle } from '@customdash/visualizations';
import type { MetricConfig } from '@type/widget-form.types';
import type { SliceCreator, MetricsSlice } from './types';

/**
 * Creates the metrics slice for widget form store
 */
export const createMetricsSlice: SliceCreator<MetricsSlice> = (set, get) => ({
  addMetric: () => {
    const state = get();
    const dataConfig = widgetFormService.getDataConfig(state.type);

    const newMetric = widgetFormService.createMetric({
      columns: state.columns,
      datasetType: dataConfig?.datasetType,
    });

    set({
      config: {
        ...state.config,
        metrics: [...state.config.metrics, newMetric],
        metricStyles: [...state.config.metricStyles, widgetFormService.createMetricStyle()],
      },
      isDirty: true,
    });
  },

  updateMetric: (index: number, updates: Partial<MetricConfig>) => {
    set(state => {
      const metrics = [...state.config.metrics];
      if (metrics[index]) {
        metrics[index] = { ...metrics[index], ...updates };
        // Auto-set label from field if not provided
        if (updates.field && !metrics[index].label) {
          metrics[index].label = updates.field;
        }
      }
      return { config: { ...state.config, metrics }, isDirty: true };
    });
  },

  removeMetric: (index: number) => {
    set(state => {
      // Ensure at least one metric remains
      if (state.config.metrics.length <= 1) return state;

      const metrics = state.config.metrics.filter((_, i) => i !== index);
      const metricStyles = state.config.metricStyles.filter((_, i) => i !== index);
      return { config: { ...state.config, metrics, metricStyles }, isDirty: true };
    });
  },

  moveMetric: (fromIndex: number, toIndex: number) => {
    set(state => {
      const metrics = [...state.config.metrics];
      const metricStyles = [...state.config.metricStyles];

      const [movedMetric] = metrics.splice(fromIndex, 1);
      const [movedStyle] = metricStyles.splice(fromIndex, 1);

      metrics.splice(toIndex, 0, movedMetric);
      metricStyles.splice(toIndex, 0, movedStyle);

      return { config: { ...state.config, metrics, metricStyles }, isDirty: true };
    });
  },

  updateMetricStyle: (index: number, updates: Partial<MetricStyle>) => {
    set(state => {
      const metricStyles = [...state.config.metricStyles];
      if (metricStyles[index]) {
        metricStyles[index] = { ...metricStyles[index], ...updates };
      }
      return { config: { ...state.config, metricStyles }, isDirty: true };
    });
  },
});
