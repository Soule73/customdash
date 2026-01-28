import type { Filter, Metric, MultiBucketConfig, TableColumn, ThemeColors } from './common';

export interface TableConfig {
  metrics?: Metric[];
  buckets?: MultiBucketConfig[];
  columns?: TableColumn[];
  globalFilters?: Filter[];
  themeColors?: ThemeColors;
  widgetParams?: {
    title?: string;
    pageSize?: number;
    searchable?: boolean;
    sortable?: boolean;
    striped?: boolean;
    compact?: boolean;
  };
}

export interface TableDataResult {
  columns: TableColumn[];
  displayData: Record<string, unknown>[];
}

export interface TableConfigType {
  hasMetrics: boolean;
  hasMultiBuckets: boolean;
  hasColumns: boolean;
}
