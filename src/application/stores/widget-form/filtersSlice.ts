/**
 * Filters Slice - Widget Form Store
 *
 * @description Gère les filtres globaux du widget
 * @module stores/widget-form/filtersSlice
 */
import { widgetFormService } from '@core/widgets';
import type { GlobalFilter } from '@type/widget-form.types';
import type { SliceCreator, FiltersSlice } from './types';

/**
 * Creates the filters slice for widget form store
 */
export const createFiltersSlice: SliceCreator<FiltersSlice> = (set, _get) => ({
  addGlobalFilter: () => {
    set(state => ({
      config: {
        ...state.config,
        globalFilters: [...state.config.globalFilters, widgetFormService.createFilter()],
      },
      isDirty: true,
    }));
  },

  updateGlobalFilter: (index: number, updates: Partial<GlobalFilter>) => {
    set(state => {
      const globalFilters = [...state.config.globalFilters];
      if (globalFilters[index]) {
        globalFilters[index] = { ...globalFilters[index], ...updates };
      }
      return { config: { ...state.config, globalFilters }, isDirty: true };
    });
  },

  removeGlobalFilter: (index: number) => {
    set(state => {
      const globalFilters = state.config.globalFilters.filter((_, i) => i !== index);
      return { config: { ...state.config, globalFilters }, isDirty: true };
    });
  },
});
