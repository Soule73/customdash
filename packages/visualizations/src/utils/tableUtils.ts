import type { Filter, Metric, MultiBucketConfig, TableColumn } from '../types';
import { applyAllFilters } from './filterUtils';

export interface TableConfig {
  metrics?: Metric[];
  buckets?: MultiBucketConfig[];
  columns?: TableColumn[];
  globalFilters?: Filter[];
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

/**
 * Detects the type of table configuration
 */
export function detectTableConfigType(config: TableConfig): TableConfigType {
  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;
  const hasColumns = Array.isArray(config.columns) && config.columns.length > 0;

  return { hasMetrics, hasMultiBuckets, hasColumns };
}

/**
 * Creates columns from bucket configuration
 */
export function createBucketColumns(buckets: MultiBucketConfig[]): TableColumn[] {
  return buckets.map(bucket => ({
    key: bucket.field,
    label: bucket.label || capitalizeFirst(bucket.field),
    sortable: true,
  }));
}

/**
 * Creates columns from metric configuration
 */
export function createMetricColumns(metrics: Metric[]): TableColumn[] {
  return metrics.map(metric => ({
    key: metric.field,
    label: metric.label || capitalizeFirst(metric.field),
    sortable: true,
    align: 'right' as const,
    format: 'number' as const,
  }));
}

/**
 * Auto-generates columns from data structure
 */
export function createAutoColumns(data: Record<string, unknown>[]): TableColumn[] {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  return keys.map(key => ({
    key,
    label: capitalizeFirst(key),
    sortable: true,
    format: detectColumnFormat(firstRow[key]),
  }));
}

/**
 * Detects the appropriate format for a column based on value type
 */
function detectColumnFormat(value: unknown): TableColumn['format'] {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string' && isDateString(value)) return 'date';
  return 'text';
}

/**
 * Checks if a string appears to be a date
 */
function isDateString(value: string): boolean {
  const datePatterns = [/^\d{4}-\d{2}-\d{2}$/, /^\d{4}-\d{2}-\d{2}T/, /^\d{2}\/\d{2}\/\d{4}$/];
  return datePatterns.some(pattern => pattern.test(value));
}

/**
 * Capitalizes first letter of a string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

/**
 * Formats a date string for display
 */
export function formatDateForDisplay(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats a cell value based on column format
 */
export function formatCellValue(
  value: unknown,
  format?: TableColumn['format'],
  options?: { currency?: string; decimals?: number },
): string {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'number':
      return typeof value === 'number'
        ? value.toLocaleString('fr-FR', {
            minimumFractionDigits: options?.decimals ?? 0,
            maximumFractionDigits: options?.decimals ?? 2,
          })
        : String(value);

    case 'currency':
      return typeof value === 'number'
        ? value.toLocaleString('fr-FR', {
            style: 'currency',
            currency: options?.currency || 'EUR',
          })
        : String(value);

    case 'percent':
      return typeof value === 'number'
        ? `${(value * 100).toFixed(options?.decimals ?? 1)}%`
        : String(value);

    case 'date':
      return typeof value === 'string' ? formatDateForDisplay(value) : String(value);

    default:
      return String(value);
  }
}

/**
 * Processes raw data without specific configuration
 */
export function processRawData(data: Record<string, unknown>[]): TableDataResult {
  if (!data || data.length === 0) {
    return { columns: [], displayData: [] };
  }

  const columns = createAutoColumns(data);
  return { columns, displayData: data };
}

/**
 * Generates a table title based on configuration
 */
export function generateTableTitle(config: TableConfig, configType: TableConfigType): string {
  if (config.widgetParams?.title) {
    return config.widgetParams.title;
  }

  const { hasMetrics, hasMultiBuckets } = configType;

  if (hasMultiBuckets && config.buckets) {
    const bucketLabels = config.buckets.map(bucket => bucket.label || bucket.field).join(', ');

    if (hasMetrics) {
      return `Tableau groupe par ${bucketLabels}`;
    }
    return `Decompte par ${bucketLabels}`;
  }

  if (hasMetrics) {
    return 'Tableau des metriques';
  }

  return 'Tableau des donnees';
}

/**
 * Validates table widget configuration
 */
export function validateTableConfig(
  _config: TableConfig,
  data: Record<string, unknown>[],
): boolean {
  if (!data || data.length === 0) return false;
  return true;
}

/**
 * Applies filters to table data
 */
export function applyTableFilters(
  data: Record<string, unknown>[],
  globalFilters?: Filter[],
): Record<string, unknown>[] {
  if (!globalFilters || globalFilters.length === 0) {
    return data;
  }
  return applyAllFilters(data, globalFilters, []);
}

/**
 * Sorts table data by a column
 */
export function sortTableData(
  data: Record<string, unknown>[],
  sortKey: string,
  sortDirection: 'asc' | 'desc',
): Record<string, unknown>[] {
  return [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortDirection === 'desc' ? -comparison : comparison;
  });
}

/**
 * Filters table data by search term
 */
export function searchTableData(
  data: Record<string, unknown>[],
  searchTerm: string,
  columns: TableColumn[],
): Record<string, unknown>[] {
  if (!searchTerm.trim()) return data;

  const lowerSearch = searchTerm.toLowerCase();
  const searchableKeys = columns.map(c => c.key);

  return data.filter(row => {
    return searchableKeys.some(key => {
      const value = row[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerSearch);
    });
  });
}

/**
 * Paginates table data
 */
export function paginateTableData(
  data: Record<string, unknown>[],
  page: number,
  pageSize: number,
): Record<string, unknown>[] {
  const start = page * pageSize;
  return data.slice(start, start + pageSize);
}
