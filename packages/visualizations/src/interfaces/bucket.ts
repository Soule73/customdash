import type { BucketType, DateInterval } from '../types';
import type { MultiBucketConfig } from './common';

export interface BucketTypeOption {
  value: BucketType;
  label: string;
  description: string;
}

export interface DateIntervalOption {
  value: DateInterval;
  label: string;
}

export interface SortOrderOption {
  value: 'asc' | 'desc';
  label: string;
}

export interface MultiBucketCompatibleConfig {
  buckets?: MultiBucketConfig[];
  metrics?: Array<{ field: string; agg: string }>;
}
