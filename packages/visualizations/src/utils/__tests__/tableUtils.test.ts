import { describe, it, expect } from 'vitest';
import {
  detectTableConfigType,
  createBucketColumns,
  createMetricColumns,
  createAutoColumns,
  processRawData,
  generateTableTitle,
  validateTableConfig,
  applyTableFilters,
  sortTableData,
  searchTableData,
  paginateTableData,
} from '../tableUtils';

const testData = [
  { id: 1, name: 'Alice', age: 25, salary: 50000, date: '2024-01-15' },
  { id: 2, name: 'Bob', age: 30, salary: 60000, date: '2024-02-20' },
  { id: 3, name: 'Charlie', age: 35, salary: 70000, date: '2024-03-25' },
  { id: 4, name: 'Diana', age: 28, salary: 55000, date: '2024-04-10' },
  { id: 5, name: 'Eve', age: 22, salary: 45000, date: '2024-05-05' },
];

describe('tableUtils', () => {
  describe('detectTableConfigType', () => {
    it('should detect metrics configuration', () => {
      const result = detectTableConfigType({
        metrics: [{ field: 'salary', agg: 'sum', label: 'Total' }],
      });
      expect(result.hasMetrics).toBe(true);
      expect(result.hasMultiBuckets).toBe(false);
    });

    it('should detect buckets configuration', () => {
      const result = detectTableConfigType({
        buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
      });
      expect(result.hasMultiBuckets).toBe(true);
    });

    it('should detect columns configuration', () => {
      const result = detectTableConfigType({
        columns: [{ key: 'name', label: 'Name' }],
      });
      expect(result.hasColumns).toBe(true);
    });
  });

  describe('createBucketColumns', () => {
    it('should create columns from buckets', () => {
      const buckets = [
        { field: 'category', type: 'terms' as const, label: 'Category' },
        { field: 'region', type: 'terms' as const, label: '' },
      ];
      const columns = createBucketColumns(buckets);
      expect(columns).toHaveLength(2);
      expect(columns[0].key).toBe('category');
      expect(columns[0].label).toBe('Category');
      expect(columns[1].label).toBe('Region');
    });
  });

  describe('createMetricColumns', () => {
    it('should create columns from metrics', () => {
      const metrics = [
        { field: 'salary', agg: 'sum' as const, label: 'Total Salary' },
        { field: 'age', agg: 'avg' as const, label: '' },
      ];
      const columns = createMetricColumns(metrics);
      expect(columns).toHaveLength(2);
      expect(columns[0].label).toBe('Total Salary');
      expect(columns[0].align).toBe('right');
      expect(columns[1].label).toBe('Age');
    });
  });

  describe('createAutoColumns', () => {
    it('should auto-generate columns from data', () => {
      const columns = createAutoColumns(testData);
      expect(columns.length).toBeGreaterThan(0);
      expect(columns.find(c => c.key === 'name')).toBeDefined();
      expect(columns.find(c => c.key === 'age')?.format).toBe('number');
    });

    it('should return empty array for empty data', () => {
      const columns = createAutoColumns([]);
      expect(columns).toEqual([]);
    });

    it('should detect date columns', () => {
      const columns = createAutoColumns(testData);
      const dateColumn = columns.find(c => c.key === 'date');
      expect(dateColumn?.format).toBe('date');
    });
  });

  describe('processRawData', () => {
    it('should process raw data correctly', () => {
      const result = processRawData(testData);
      expect(result.columns.length).toBeGreaterThan(0);
      expect(result.displayData).toEqual(testData);
    });

    it('should return empty result for empty data', () => {
      const result = processRawData([]);
      expect(result.columns).toEqual([]);
      expect(result.displayData).toEqual([]);
    });
  });

  describe('generateTableTitle', () => {
    it('should return custom title from widgetParams', () => {
      const config = { widgetParams: { title: 'Custom Table' } };
      const result = generateTableTitle(config, {
        hasMetrics: false,
        hasMultiBuckets: false,
        hasColumns: false,
      });
      expect(result).toBe('Custom Table');
    });

    it('should generate title for buckets with metrics', () => {
      const config = {
        buckets: [{ field: 'category', label: 'Category', type: 'terms' as const }],
        metrics: [{ field: 'value', agg: 'sum' as const, label: 'Total' }],
      };
      const result = generateTableTitle(config, {
        hasMetrics: true,
        hasMultiBuckets: true,
        hasColumns: false,
      });
      expect(result).toContain('Category');
    });

    it('should return default title', () => {
      const result = generateTableTitle(
        {},
        { hasMetrics: false, hasMultiBuckets: false, hasColumns: false },
      );
      expect(result).toBe('Data table');
    });
  });

  describe('validateTableConfig', () => {
    it('should return true for valid data', () => {
      expect(validateTableConfig({}, testData)).toBe(true);
    });

    it('should return false for empty data', () => {
      expect(validateTableConfig({}, [])).toBe(false);
    });
  });

  describe('applyTableFilters', () => {
    it('should apply global filters', () => {
      const filters = [{ field: 'age', operator: 'greater_than' as const, value: 25 }];
      const result = applyTableFilters(testData, filters);
      expect(result.length).toBeLessThan(testData.length);
    });

    it('should return all data without filters', () => {
      const result = applyTableFilters(testData, undefined);
      expect(result).toEqual(testData);
    });
  });

  describe('sortTableData', () => {
    it('should sort by numeric field ascending', () => {
      const result = sortTableData(testData, 'age', 'asc');
      expect((result[0] as { age: number }).age).toBe(22);
      expect((result[result.length - 1] as { age: number }).age).toBe(35);
    });

    it('should sort by numeric field descending', () => {
      const result = sortTableData(testData, 'age', 'desc');
      expect((result[0] as { age: number }).age).toBe(35);
    });

    it('should sort by string field', () => {
      const result = sortTableData(testData, 'name', 'asc');
      expect((result[0] as { name: string }).name).toBe('Alice');
    });

    it('should handle null values in sort', () => {
      const dataWithNull = [
        ...testData,
        { id: 6, name: null, age: null, salary: null, date: null },
      ];
      const result = sortTableData(dataWithNull, 'age', 'asc');
      expect(result[result.length - 1].age).toBeNull();
    });
  });

  describe('searchTableData', () => {
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ];

    it('should filter data by search term', () => {
      const result = searchTableData(testData, 'alice', columns);
      expect(result).toHaveLength(1);
      expect((result[0] as { name: string }).name).toBe('Alice');
    });

    it('should be case insensitive', () => {
      const result = searchTableData(testData, 'ALICE', columns);
      expect(result).toHaveLength(1);
    });

    it('should return all data for empty search term', () => {
      const result = searchTableData(testData, '', columns);
      expect(result).toEqual(testData);
    });

    it('should search in numeric fields', () => {
      const result = searchTableData(testData, '25', columns);
      expect(result).toHaveLength(1);
    });
  });

  describe('paginateTableData', () => {
    it('should return correct page of data', () => {
      const result = paginateTableData(testData, 0, 2);
      expect(result).toHaveLength(2);
      expect((result[0] as { id: number }).id).toBe(1);
    });

    it('should return second page correctly', () => {
      const result = paginateTableData(testData, 1, 2);
      expect(result).toHaveLength(2);
      expect((result[0] as { id: number }).id).toBe(3);
    });

    it('should handle last page with fewer items', () => {
      const result = paginateTableData(testData, 2, 2);
      expect(result).toHaveLength(1);
    });

    it('should return empty array for out of bounds page', () => {
      const result = paginateTableData(testData, 10, 2);
      expect(result).toHaveLength(0);
    });
  });

  describe('generateTableTitle edge cases', () => {
    it('should generate count title when hasMultiBuckets but no metrics', () => {
      const config = {
        buckets: [{ field: 'category', type: 'terms' as const }],
      };
      const result = generateTableTitle(config, {
        hasMetrics: false,
        hasMultiBuckets: true,
        hasColumns: false,
      });
      expect(result).toContain('Count');
    });

    it('should return metrics table title when only metrics', () => {
      const config = {
        metrics: [{ field: 'value', agg: 'sum' as const }],
      };
      const result = generateTableTitle(config, {
        hasMetrics: true,
        hasMultiBuckets: false,
        hasColumns: false,
      });
      expect(result).toBe('Metrics table');
    });
  });

  describe('detectTableConfigType edge cases', () => {
    it('should detect empty configuration', () => {
      const result = detectTableConfigType({});
      expect(result.hasMetrics).toBe(false);
      expect(result.hasMultiBuckets).toBe(false);
      expect(result.hasColumns).toBe(false);
    });

    it('should detect single bucket configuration', () => {
      const result = detectTableConfigType({
        buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
      });
      expect(result.hasMultiBuckets).toBe(true);
    });

    it('should detect combined configuration', () => {
      const result = detectTableConfigType({
        metrics: [{ field: 'value', agg: 'sum', label: 'Total' }],
        buckets: [{ field: 'category', type: 'terms', label: 'Category' }],
        columns: [{ key: 'name', label: 'Name' }],
      });
      expect(result.hasMetrics).toBe(true);
      expect(result.hasMultiBuckets).toBe(true);
      expect(result.hasColumns).toBe(true);
    });
  });

  describe('createBucketColumns edge cases', () => {
    it('should handle empty buckets array', () => {
      const columns = createBucketColumns([]);
      expect(columns).toEqual([]);
    });

    it('should capitalize field name when label is empty', () => {
      const buckets = [{ field: 'category', type: 'terms' as const, label: '' }];
      const columns = createBucketColumns(buckets);
      expect(columns[0].label).toBe('Category');
    });
  });

  describe('createMetricColumns edge cases', () => {
    it('should handle empty metrics array', () => {
      const columns = createMetricColumns([]);
      expect(columns).toEqual([]);
    });

    it('should generate label from field and aggregation', () => {
      const metrics = [{ field: 'amount', agg: 'sum' as const, label: '' }];
      const columns = createMetricColumns(metrics);
      expect(columns[0].label).toBeTruthy();
    });
  });

  describe('sortTableData edge cases', () => {
    it('should return original data when sortBy is undefined', () => {
      const result = sortTableData(testData, undefined as unknown as string, 'asc');
      expect(result).toEqual(testData);
    });

    it('should handle empty data array', () => {
      const result = sortTableData([], 'age', 'asc');
      expect(result).toEqual([]);
    });

    it('should handle sorting with mixed data types', () => {
      const mixedData = [{ value: 10 }, { value: '5' }, { value: 20 }];
      const result = sortTableData(mixedData, 'value', 'asc');
      expect(result).toHaveLength(3);
    });
  });

  describe('applyTableFilters edge cases', () => {
    it('should handle empty filters array', () => {
      const result = applyTableFilters(testData, []);
      expect(result).toEqual(testData);
    });

    it('should filter with equals operator', () => {
      const filters = [{ field: 'name', operator: 'equals' as const, value: 'Alice' }];
      const result = applyTableFilters(testData, filters);
      expect(result).toHaveLength(1);
      expect((result[0] as { name: string }).name).toBe('Alice');
    });

    it('should filter with less_than operator', () => {
      const filters = [{ field: 'age', operator: 'less_than' as const, value: 26 }];
      const result = applyTableFilters(testData, filters);
      expect(result.every(row => ((row as Record<string, unknown>).age as number) < 26)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filters = [
        { field: 'age', operator: 'greater_than' as const, value: 25 },
        { field: 'salary', operator: 'less_than' as const, value: 65000 },
      ];
      const result = applyTableFilters(testData, filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(testData.length);
    });
  });

  describe('searchTableData edge cases', () => {
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ];

    it('should return empty array when no matches found', () => {
      const result = searchTableData(testData, 'xyz123', columns);
      expect(result).toHaveLength(0);
    });

    it('should handle search with special characters', () => {
      const result = searchTableData(testData, 'Alice', columns);
      expect(result).toHaveLength(1);
    });

    it('should search across multiple fields', () => {
      const result = searchTableData(testData, '30', columns);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('paginateTableData edge cases', () => {
    it('should handle page 0', () => {
      const result = paginateTableData(testData, 0, 10);
      expect(result).toEqual(testData);
    });

    it('should handle pageSize larger than data', () => {
      const result = paginateTableData(testData, 0, 100);
      expect(result).toEqual(testData);
    });

    it('should handle empty data', () => {
      const result = paginateTableData([], 0, 10);
      expect(result).toEqual([]);
    });

    it('should handle negative page', () => {
      const result = paginateTableData(testData, -1, 2);
      expect(result).toHaveLength(0);
    });
  });

  describe('processRawData edge cases', () => {
    it('should handle data with nested objects', () => {
      const nestedData = [{ id: 1, name: 'Test', nested: { value: 100 } }];
      const result = processRawData(nestedData);
      expect(result.columns.length).toBeGreaterThan(0);
    });

    it('should handle data with arrays', () => {
      const arrayData = [{ id: 1, tags: ['tag1', 'tag2'] }];
      const result = processRawData(arrayData);
      expect(result.displayData).toEqual(arrayData);
    });
  });

  describe('validateTableConfig edge cases', () => {
    it('should return false for null data', () => {
      expect(validateTableConfig({}, null as unknown as Record<string, unknown>[])).toBe(false);
    });

    it('should return false for undefined data', () => {
      expect(validateTableConfig({}, undefined as unknown as Record<string, unknown>[])).toBe(
        false,
      );
    });

    it('should return true for data with single row', () => {
      expect(validateTableConfig({}, [{ id: 1 }])).toBe(true);
    });
  });
});
