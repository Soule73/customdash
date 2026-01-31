/**
 * Buckets Slice - Widget Form Store
 *
 * @description Gère les buckets (dimensions/groupements)
 * @module stores/widget-form/bucketsSlice
 */
import { widgetFormService } from '@core/widgets';
import type { BucketConfig } from '@type/widget-form.types';
import type { SliceCreator, BucketsSlice } from './types';

/**
 * Creates the buckets slice for widget form store
 */
export const createBucketsSlice: SliceCreator<BucketsSlice> = (set, _get) => ({
  addBucket: () => {
    set(state => ({
      config: {
        ...state.config,
        buckets: [...state.config.buckets, widgetFormService.createBucket()],
      },
      isDirty: true,
    }));
  },

  updateBucket: (index: number, updates: Partial<BucketConfig>) => {
    set(state => {
      const buckets = [...state.config.buckets];
      if (buckets[index]) {
        buckets[index] = { ...buckets[index], ...updates };
      }
      return { config: { ...state.config, buckets }, isDirty: true };
    });
  },

  removeBucket: (index: number) => {
    set(state => {
      // Ensure at least one bucket remains
      if (state.config.buckets.length <= 1) return state;

      const buckets = state.config.buckets.filter((_, i) => i !== index);
      return { config: { ...state.config, buckets }, isDirty: true };
    });
  },

  moveBucket: (fromIndex: number, toIndex: number) => {
    set(state => {
      const buckets = [...state.config.buckets];
      const [movedBucket] = buckets.splice(fromIndex, 1);
      buckets.splice(toIndex, 0, movedBucket);
      return { config: { ...state.config, buckets }, isDirty: true };
    });
  },
});
