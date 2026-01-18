import type { Filter, Metric, MultiBucketConfig, TableColumn } from '../interfaces';
import type { TableConfig, TableDataResult, TableConfigType } from '../interfaces';
import { applyAllFilters } from './filterUtils';

/**
 * Detects the type of table configuration
 * @param config - The table configuration
 * @returns An object indicating the presence of metrics, multi-buckets, and columns
 *
 * @example
 * const config: TableConfig = {
 *   metrics: [{ field: 'sales', agg: 'sum' }],
 *   buckets: [{ field: 'region' }],
 * };
 * const configType = detectTableConfigType(config);
 * // Result: { hasMetrics: true, hasMultiBuckets: true, hasColumns: false }
 */
export function detectTableConfigType(config: TableConfig): TableConfigType {
  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;
  const hasColumns = Array.isArray(config.columns) && config.columns.length > 0;

  return { hasMetrics, hasMultiBuckets, hasColumns };
}

/**
 * Creates columns from bucket configuration
 * @param buckets - An array of multi-bucket configurations
 * @returns An array of table columns derived from the bucket configurations
 *
 * @example
 * const buckets: MultiBucketConfig[] = [
 *   { field: 'region', label: 'Region' },
 *   { field: 'category' },
 * ];
 * const columns = createBucketColumns(buckets);
 * // Result: [
 * //   { key: 'region', label: 'Region', sortable: true },
 * //   { key: 'category', label: 'Category', sortable: true },
 * // ]
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
 * @param metrics - An array of metric configurations
 * @returns An array of table columns derived from the metric configurations
 *
 * @example
 * const metrics: Metric[] = [
 *   { field: 'sales', label: 'Total Sales' },
 *   { field: 'profit' },
 * ];
 * const columns = createMetricColumns(metrics);
 * // Result: [
 * //   { key: 'sales', label: 'Total Sales', sortable: true, align: 'right', format: 'number' },
 * //   { key: 'profit', label: 'Profit', sortable: true, align: 'right', format: 'number' },
 * // ]
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
 * @param data - An array of data records
 * @returns An array of table columns derived from the data keys
 *
 * @example
 * const data: Record<string, unknown>[] = [
 *   { region: 'North', sales: 1000, date: '2023-01-01' },
 *   { region: 'South', sales: 1500, date: '2023-01-02' },
 * ];
 * const columns = createAutoColumns(data);
 * // Result: [
 * //   { key: 'region', label: 'Region', sortable: true, format: 'text' },
 * //   { key: 'sales', label: 'Sales', sortable: true, format: 'number' },
 * //   { key: 'date', label: 'Date', sortable: true, format: 'date' },
 * // ]
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
 * @param value - A sample value from the column
 * @returns The detected format: 'number', 'date', or 'text'
 *
 * @example
 * detectColumnFormat(123); // 'number'
 * detectColumnFormat('2023-01-01'); // 'date'
 * detectColumnFormat('Sample Text'); // 'text'
 */
function detectColumnFormat(value: unknown): TableColumn['format'] {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string' && isDateString(value)) return 'date';
  return 'text';
}

/**
 * Checks if a string appears to be a date
 * @param value - The string to check
 * @returns `true` if the string matches common date patterns, `false` otherwise
 *
 * @example
 * isDateString('2023-01-01'); // true
 * isDateString('15/01/2023'); // true
 * isDateString('Not a date'); // false
 */
function isDateString(value: string): boolean {
  const datePatterns = [/^\d{4}-\d{2}-\d{2}$/, /^\d{4}-\d{2}-\d{2}T/, /^\d{2}\/\d{2}\/\d{4}$/];
  return datePatterns.some(pattern => pattern.test(value));
}

/**
 * Capitalizes first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 *
 * @example
 * capitalizeFirst('hello_world'); // 'Hello world'
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
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
      return `Table grouped by ${bucketLabels}`;
    }
    return `Count by ${bucketLabels}`;
  }

  if (hasMetrics) {
    return 'Metrics table';
  }

  return 'Data table';
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
