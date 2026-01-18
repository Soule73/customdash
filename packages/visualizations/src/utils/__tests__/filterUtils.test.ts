import { describe, it, expect } from 'vitest';
import {
  applyFilter,
  applyGlobalFilters,
  applyAllFilters,
  validateFilter,
  createDefaultFilter,
} from '../filterUtils';
import type { Filter } from '../../interfaces';

const testData: Record<string, unknown>[] = [
  { id: 1, name: 'Alice', age: 25, city: 'Paris', score: 85 },
  { id: 2, name: 'Bob', age: 30, city: 'Lyon', score: 90 },
  { id: 3, name: 'Charlie', age: 35, city: 'Paris', score: 75 },
  { id: 4, name: 'Diana', age: 28, city: 'Marseille', score: 95 },
  { id: 5, name: 'Eve', age: 22, city: 'Paris', score: 88 },
];

describe('filterUtils', () => {
  describe('applyFilter', () => {
    it('should return all data when filter field is empty', () => {
      const filter: Filter = { field: '', operator: 'equals', value: 'test' };
      const result = applyFilter(testData, filter);
      expect(result).toEqual(testData);
    });

    it('should return all data when filter value is empty', () => {
      const filter: Filter = { field: 'name', operator: 'equals', value: '' };
      const result = applyFilter(testData, filter);
      expect(result).toEqual(testData);
    });

    it('should filter with equals operator', () => {
      const filter: Filter = { field: 'city', operator: 'equals', value: 'Paris' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(3);
      expect(result.every(r => r.city === 'Paris')).toBe(true);
    });

    it('should filter with not_equals operator', () => {
      const filter: Filter = { field: 'city', operator: 'not_equals', value: 'Paris' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(r => r.city !== 'Paris')).toBe(true);
    });

    it('should filter with contains operator (case insensitive)', () => {
      const filter: Filter = { field: 'name', operator: 'contains', value: 'li' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toContain('Alice');
      expect(result.map(r => r.name)).toContain('Charlie');
    });

    it('should filter with not_contains operator', () => {
      const filter: Filter = { field: 'name', operator: 'not_contains', value: 'li' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(3);
    });

    it('should filter with greater_than operator', () => {
      const filter: Filter = { field: 'age', operator: 'greater_than', value: 28 };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(r => (r.age as number) > 28)).toBe(true);
    });

    it('should filter with less_than operator', () => {
      const filter: Filter = { field: 'age', operator: 'less_than', value: 28 };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(2);
      expect(result.every(r => (r.age as number) < 28)).toBe(true);
    });

    it('should filter with greater_equal operator', () => {
      const filter: Filter = { field: 'age', operator: 'greater_equal', value: 28 };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(3);
    });

    it('should filter with less_equal operator', () => {
      const filter: Filter = { field: 'age', operator: 'less_equal', value: 28 };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(3);
    });

    it('should filter with starts_with operator', () => {
      const filter: Filter = { field: 'name', operator: 'starts_with', value: 'a' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should filter with ends_with operator', () => {
      const filter: Filter = { field: 'name', operator: 'ends_with', value: 'e' };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(3);
    });

    it('should exclude rows with null/undefined field values', () => {
      const dataWithNull = [...testData, { id: 6, name: null, age: 40, city: 'Nice', score: 70 }];
      const filter: Filter = { field: 'name', operator: 'contains', value: 'a' };
      const result = applyFilter(dataWithNull, filter);
      expect(result.every(r => r.name !== null)).toBe(true);
    });
  });

  describe('applyGlobalFilters', () => {
    it('should return all data when filters array is empty', () => {
      const result = applyGlobalFilters(testData, []);
      expect(result).toEqual(testData);
    });

    it('should apply multiple filters in sequence', () => {
      const filters: Filter[] = [
        { field: 'city', operator: 'equals', value: 'Paris' },
        { field: 'age', operator: 'less_than', value: 30 },
      ];
      const result = applyGlobalFilters(testData, filters);
      expect(result).toHaveLength(2);
      expect(result.every(r => r.city === 'Paris' && (r.age as number) < 30)).toBe(true);
    });
  });

  describe('applyAllFilters', () => {
    it('should apply both global and dataset filters', () => {
      const globalFilters: Filter[] = [{ field: 'city', operator: 'equals', value: 'Paris' }];
      const datasetFilters: Filter[] = [{ field: 'score', operator: 'greater_than', value: 80 }];

      const result = applyAllFilters(testData, globalFilters, datasetFilters);
      expect(result).toHaveLength(2);
    });

    it('should handle undefined filters gracefully', () => {
      const result = applyAllFilters(testData, undefined, undefined);
      expect(result).toEqual(testData);
    });

    it('should handle empty filter arrays', () => {
      const result = applyAllFilters(testData, [], []);
      expect(result).toEqual(testData);
    });
  });

  describe('validateFilter', () => {
    it('should return valid for complete filter', () => {
      const filter: Filter = { field: 'name', operator: 'equals', value: 'test' };
      const result = validateFilter(filter);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when field is empty', () => {
      const filter: Filter = { field: '', operator: 'equals', value: 'test' };
      const result = validateFilter(filter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The filter field must be specified');
    });

    it('should return invalid when value is empty', () => {
      const filter: Filter = { field: 'name', operator: 'equals', value: '' };
      const result = validateFilter(filter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The filter value must be specified');
    });

    it('should return invalid for unknown operator', () => {
      const filter: Filter = {
        field: 'name',
        operator: 'invalid_operator' as Filter['operator'],
        value: 'test',
      };
      const result = validateFilter(filter);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid operator'))).toBe(true);
    });
  });

  describe('createDefaultFilter', () => {
    it('should create filter with default values', () => {
      const filter = createDefaultFilter();
      expect(filter).toEqual({
        field: '',
        operator: 'equals',
        value: '',
      });
    });

    it('should create filter with specified field', () => {
      const filter = createDefaultFilter('customField');
      expect(filter.field).toBe('customField');
      expect(filter.operator).toBe('equals');
    });
  });

  describe('applyFilter edge cases', () => {
    it('should fallback to string equality for unknown operator', () => {
      const filter: Filter = {
        field: 'name',
        operator: 'unknown_op' as Filter['operator'],
        value: 'Alice',
      };
      const result = applyFilter(testData, filter);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });
  });
});
