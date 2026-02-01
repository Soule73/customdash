import type {
  TableWidgetConfig,
  TableColumn,
  Filter,
  TableConfigType,
  TableDataContext,
  TablePaginationParams,
  TableProcessedData,
  TableWidgetInput,
  ChartValidationResult,
} from '../../interfaces';
import {
  detectTableConfigType,
  processRawData,
  generateTableTitle,
  validateTableConfig,
  applyTableFilters,
  sortTableData,
  searchTableData,
  paginateTableData,
  createBucketColumns,
  createMetricColumns,
} from '../../utils/tableUtils';

/**
 * Service for processing Table widget data and configuration
 * Handles filtering, sorting, searching and pagination
 */
export class TableWidgetService {
  /**
   * Validate table configuration
   */
  static validateConfig(
    config: TableWidgetConfig,
    data: Record<string, unknown>[],
  ): ChartValidationResult {
    const isValid = validateTableConfig(config, data);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isValid) {
      errors.push('Invalid table configuration');
    }

    if (!data || data.length === 0) {
      warnings.push('No data available');
    }

    return {
      isValid,
      errors,
      warnings,
    };
  }

  /**
   * Apply global filters to data
   */
  static applyFilters(
    data: Record<string, unknown>[],
    filters: Filter[] | undefined,
  ): Record<string, unknown>[] {
    return applyTableFilters(data, filters);
  }

  /**
   * Detect configuration type
   */
  static detectConfigType(config: TableWidgetConfig): TableConfigType {
    return detectTableConfigType(config);
  }

  /**
   * Process raw data to extract columns and display data
   */
  static processData(
    data: Record<string, unknown>[],
    config: TableWidgetConfig,
  ): {
    columns: TableColumn[];
    displayData: Record<string, unknown>[];
  } {
    const safeData = Array.isArray(data) ? data : [];
    const configType = this.detectConfigType(config);

    if (configType.hasMetrics) {
      const bucketColumns = configType.hasMultiBuckets
        ? createBucketColumns(config.buckets ?? [])
        : [];

      // Merge metricStyles with metrics before creating columns
      const metricsWithStyles = (config.metrics ?? []).map((metric, index) => {
        const style = config.metricStyles?.[index] || {};
        return {
          ...metric,
          width: style.width ?? metric.width,
          align: style.align ?? metric.align,
          format: style.format ?? metric.format,
        };
      });

      const metricColumns = createMetricColumns(metricsWithStyles);

      // Merge columns and deduplicate by key
      const allColumns = [...bucketColumns, ...metricColumns];
      const seenKeys = new Set<string>();
      const columns = allColumns.filter(col => {
        if (seenKeys.has(col.key)) {
          return false;
        }
        seenKeys.add(col.key);
        return true;
      });

      // Filter data to only include configured columns
      const filteredData = safeData.map(row => {
        const filteredRow: Record<string, unknown> = {};
        columns.forEach(col => {
          filteredRow[col.key] = row[col.key];
        });
        return filteredRow;
      });

      return { columns, displayData: filteredData };
    }

    return processRawData(safeData);
  }

  /**
   * Generate table title based on configuration
   */
  static generateTitle(config: TableWidgetConfig, configType: TableConfigType): string {
    return generateTableTitle(config, configType);
  }

  /**
   * Extract page size from config
   */
  static extractPageSize(config: TableWidgetConfig): number {
    return config.widgetParams?.pageSize ?? 10;
  }

  /**
   * Create data context for table processing
   */
  static createDataContext(input: TableWidgetInput): TableDataContext {
    const filteredData = this.applyFilters(input.data, input.config.globalFilters);
    const configType = this.detectConfigType(input.config);
    const { columns, displayData } = this.processData(filteredData, input.config);
    const tableTitle = this.generateTitle(input.config, configType);
    const isValid = validateTableConfig(input.config, input.data);
    const pageSize = this.extractPageSize(input.config);

    return {
      filteredData,
      configType,
      columns,
      displayData,
      tableTitle,
      isValid,
      pageSize,
    };
  }

  /**
   * Search data based on search term
   */
  static searchData(
    data: Record<string, unknown>[],
    searchTerm: string,
    columns: TableColumn[],
  ): Record<string, unknown>[] {
    return searchTableData(data, searchTerm, columns);
  }

  /**
   * Sort data by key and direction
   */
  static sortData(
    data: Record<string, unknown>[],
    sortKey: string | null,
    sortDirection: 'asc' | 'desc',
  ): Record<string, unknown>[] {
    if (!sortKey) return data;
    return sortTableData(data, sortKey, sortDirection);
  }

  /**
   * Paginate data
   */
  static paginateData(
    data: Record<string, unknown>[],
    currentPage: number,
    pageSize: number,
  ): Record<string, unknown>[] {
    return paginateTableData(data, currentPage, pageSize);
  }

  /**
   * Process data with pagination params
   */
  static processWithPagination(
    context: TableDataContext,
    params: TablePaginationParams,
  ): TableProcessedData {
    const searchedData = this.searchData(context.displayData, params.searchTerm, context.columns);
    const sortedData = this.sortData(searchedData, params.sortKey, params.sortDirection);
    const totalRows = sortedData.length;
    const totalPages = Math.ceil(totalRows / params.pageSize);
    const paginatedData = this.paginateData(sortedData, params.currentPage, params.pageSize);

    return {
      searchedData,
      sortedData,
      paginatedData,
      totalRows,
      totalPages,
    };
  }
}
