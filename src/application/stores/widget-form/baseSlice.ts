/**
 * Base Slice - Widget Form Store
 *
 * @description Gère l'état de base du formulaire widget (type, source, titre, etc.)
 * @module stores/widget-form/baseSlice
 */
import type { WidgetType } from '@customdash/visualizations';
import type { WidgetFormTab } from '@type/widget-form.types';
import type { SliceCreator, BaseSlice } from './types';

export const INITIAL_BASE_STATE = {
  type: 'bar' as WidgetType,
  sourceId: '',
  columns: [] as string[],
  columnTypes: {} as Record<string, string>,
  dataPreview: [] as Record<string, unknown>[],
  activeTab: 'data' as WidgetFormTab,
  widgetTitle: '',
  widgetDescription: '',
  visibility: 'private' as const,
  isLoading: false,
  isDirty: false,
  errors: {} as Record<string, string>,
};

/**
 * Creates the base slice for widget form store
 */
export const createBaseSlice: SliceCreator<BaseSlice> = (set, _get) => ({
  ...INITIAL_BASE_STATE,

  setType: (type: WidgetType) => {
    set({ type, isDirty: true });
  },

  setSourceId: (sourceId: string) => {
    set({ sourceId, isDirty: true });
  },

  setActiveTab: (tab: WidgetFormTab) => {
    set({ activeTab: tab });
  },

  setWidgetTitle: (title: string) => {
    set({ widgetTitle: title, isDirty: true });
  },

  setWidgetDescription: (description: string) => {
    set({ widgetDescription: description, isDirty: true });
  },

  setVisibility: (visibility: 'public' | 'private') => {
    set({ visibility, isDirty: true });
  },

  setErrors: (errors: Record<string, string>) => {
    set({ errors });
  },

  setIsDirty: (isDirty: boolean) => {
    set({ isDirty });
  },
});
