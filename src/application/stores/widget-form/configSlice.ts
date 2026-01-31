/**
 * Config Slice - Widget Form Store
 *
 * @description Gère la configuration générale du widget et les paramètres
 * @module stores/widget-form/configSlice
 */
import { widgetFormService } from '@core/widgets';
import type { WidgetParams } from '@customdash/visualizations';
import type { WidgetFormConfig } from '@type/widget-form.types';
import type { SliceCreator, ConfigSlice } from './types';

/**
 * Creates initial widget form config
 */
export function createInitialConfig(): WidgetFormConfig {
  return widgetFormService.createFormConfig({ type: 'bar' });
}

export const INITIAL_CONFIG_STATE = {
  config: createInitialConfig(),
};

/**
 * Creates the config slice for widget form store
 */
export const createConfigSlice: SliceCreator<ConfigSlice> = (set, _get) => ({
  ...INITIAL_CONFIG_STATE,

  setConfig: (config: WidgetFormConfig) => {
    set({ config });
  },

  updateConfig: <K extends keyof WidgetFormConfig>(key: K, value: WidgetFormConfig[K]) => {
    set(state => ({
      config: { ...state.config, [key]: value },
      isDirty: true,
    }));
  },

  updateWidgetParam: (key: string, value: unknown) => {
    set(state => {
      const newParams = widgetFormService.setNestedParam(
        state.config.widgetParams as WidgetParams,
        key,
        value,
      );
      return {
        config: { ...state.config, widgetParams: newParams },
        isDirty: true,
      };
    });
  },
});
