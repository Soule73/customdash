/**
 * Form Actions Slice - Widget Form Store
 *
 * @description Gère les actions principales du formulaire (init, load, reset)
 * @module stores/widget-form/formActionsSlice
 */
import { widgetFormService } from '@core/widgets';
import type { InitializeFormParams } from '@type/widget-form.types';
import type { SliceCreator, FormActionsSlice } from './types';
import { INITIAL_BASE_STATE } from './baseSlice';
import { createInitialConfig } from './configSlice';

/**
 * Creates the form actions slice for widget form store
 */
export const createFormActionsSlice: SliceCreator<FormActionsSlice> = (set, get) => ({
  initializeForm: (params: InitializeFormParams) => {
    const {
      type,
      sourceId = '',
      existingConfig,
      widgetTitle = '',
      widgetDescription = '',
    } = params;

    const config = widgetFormService.createFormConfig({ type, existingConfig });

    set({
      type,
      sourceId,
      config,
      widgetTitle,
      widgetDescription,
      activeTab: 'data',
      isDirty: false,
      errors: {},
    });
  },

  loadSourceData: (
    sourceId: string,
    data: Record<string, unknown>[],
    columns: string[],
    columnTypes: Record<string, string>,
  ) => {
    const state = get();
    const dataConfig = widgetFormService.getDataConfig(state.type);

    const result = widgetFormService.applySourceData({
      columns,
      datasetType: dataConfig?.datasetType,
      currentMetrics: state.config.metrics,
      currentBuckets: state.config.buckets,
    });

    set({
      sourceId,
      dataPreview: data.slice(0, 100),
      columns,
      columnTypes,
      config: {
        ...state.config,
        metrics: result.metrics,
        buckets: result.buckets,
      },
      isDirty: true,
    });
  },

  resetForm: () => {
    set({
      ...INITIAL_BASE_STATE,
      config: createInitialConfig(),
    });
  },
});
