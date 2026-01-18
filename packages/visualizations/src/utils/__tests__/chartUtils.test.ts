import { describe, it, expect } from 'vitest';
import {
  aggregate,
  getLabels,
  getColors,
  isIsoTimestamp,
  allSameDay,
  formatXTicksLabel,
  formatTooltipValue,
} from '../chartUtils';

describe('chartUtils', () => {
  describe('aggregate', () => {
    const rows = [
      { id: 1, value: 10 },
      { id: 2, value: 20 },
      { id: 3, value: 30 },
    ];

    it('should calculate sum', () => {
      expect(aggregate(rows, 'sum', 'value')).toBe(60);
    });

    it('should calculate avg', () => {
      expect(aggregate(rows, 'avg', 'value')).toBe(20);
    });

    it('should calculate min', () => {
      expect(aggregate(rows, 'min', 'value')).toBe(10);
    });

    it('should calculate max', () => {
      expect(aggregate(rows, 'max', 'value')).toBe(30);
    });

    it('should calculate count', () => {
      expect(aggregate(rows, 'count', 'value')).toBe(3);
    });

    it('should handle none aggregation', () => {
      const singleRow = [{ value: 42 }];
      expect(aggregate(singleRow, 'none', 'value')).toBe(42);
    });

    it('should return 0 for empty data', () => {
      expect(aggregate([], 'sum', 'value')).toBe(0);
    });
  });

  describe('getLabels', () => {
    const data = [
      { category: 'A', value: 1 },
      { category: 'B', value: 2 },
      { category: 'A', value: 3 },
      { category: 'C', value: 4 },
    ];

    it('should extract unique labels from field', () => {
      const labels = getLabels(data, 'category');
      expect(labels).toHaveLength(3);
      expect(labels).toContain('A');
      expect(labels).toContain('B');
      expect(labels).toContain('C');
    });

    it('should return empty array for empty data', () => {
      expect(getLabels([], 'category')).toEqual([]);
    });

    it('should handle undefined values', () => {
      const dataWithUndefined = [{ category: undefined }, { category: 'A' }];
      const labels = getLabels(dataWithUndefined, 'category');
      expect(labels).toContain('');
      expect(labels).toContain('A');
    });
  });

  describe('getColors', () => {
    it('should return default colors when no custom colors provided', () => {
      const labels = ['A', 'B', 'C'];
      const colors = getColors(labels);
      expect(colors).toHaveLength(3);
      colors.forEach(color => expect(color).toMatch(/^#[0-9a-fA-F]{6}$/));
    });

    it('should return custom colors when provided', () => {
      const labels = ['A', 'B'];
      const customColors = ['#ff0000', '#00ff00'];
      const colors = getColors(labels, customColors);
      expect(colors).toEqual(['#ff0000', '#00ff00']);
    });

    it('should cycle through custom colors if not enough', () => {
      const labels = ['A', 'B', 'C'];
      const customColors = ['#ff0000', '#00ff00'];
      const colors = getColors(labels, customColors);
      expect(colors).toEqual(['#ff0000', '#00ff00', '#ff0000']);
    });
  });

  describe('isIsoTimestamp', () => {
    it('should return true for ISO datetime', () => {
      expect(isIsoTimestamp('2024-01-15T10:30:00Z')).toBe(true);
    });

    it('should return true for ISO date', () => {
      expect(isIsoTimestamp('2024-01-15')).toBe(true);
    });

    it('should return true for year-month', () => {
      expect(isIsoTimestamp('2024-01')).toBe(true);
    });

    it('should return true for week format', () => {
      expect(isIsoTimestamp('2024-W03')).toBe(true);
    });

    it('should return false for non-timestamp strings', () => {
      expect(isIsoTimestamp('hello')).toBe(false);
      expect(isIsoTimestamp('123')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isIsoTimestamp(123)).toBe(false);
      expect(isIsoTimestamp(null)).toBe(false);
    });
  });

  describe('allSameDay', () => {
    it('should return true when all timestamps are same day', () => {
      const labels = ['2024-01-15T10:00:00Z', '2024-01-15T14:30:00Z', '2024-01-15T20:00:00Z'];
      expect(allSameDay(labels)).toBe(true);
    });

    it('should return false when timestamps are different days', () => {
      const labels = ['2024-01-15T10:00:00Z', '2024-01-16T14:30:00Z'];
      expect(allSameDay(labels)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(allSameDay([])).toBe(false);
    });

    it('should return false for non-datetime formats', () => {
      expect(allSameDay(['2024-01-15', '2024-01-15'])).toBe(false);
    });
  });

  describe('formatXTicksLabel', () => {
    it('should format ISO datetime correctly', () => {
      const result = formatXTicksLabel('2024-01-15T10:30:00Z');
      expect(result).toContain('15');
    });

    it('should format date only correctly', () => {
      const result = formatXTicksLabel('2024-01-15');
      expect(result).toContain('15');
    });

    it('should format year-month correctly', () => {
      const result = formatXTicksLabel('2024-01');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format week correctly', () => {
      const result = formatXTicksLabel('2024-W03');
      expect(result).toMatch(/^S0?3$/);
    });

    it('should return original string for non-date strings', () => {
      expect(formatXTicksLabel('hello')).toBe('hello');
    });

    it('should return time only when onlyTimeIfSameDay is true', () => {
      const result = formatXTicksLabel('2024-01-15T10:30:00Z', true);
      expect(result).toContain(':');
    });
  });

  describe('formatTooltipValue', () => {
    it('should format ISO datetime for tooltip', () => {
      const result = formatTooltipValue('2024-01-15T10:30:00Z');
      expect(result).toContain('2024');
    });

    it('should format date for tooltip', () => {
      const result = formatTooltipValue('2024-01-15');
      expect(result).toContain('2024');
    });

    it('should return string representation for non-date values', () => {
      expect(formatTooltipValue(123)).toBe('123');
      expect(formatTooltipValue('hello')).toBe('hello');
    });
  });

  describe('formatXTicksLabel edge cases', () => {
    it('should format year-week pattern correctly', () => {
      const result = formatXTicksLabel('2024-W15');
      expect(result).toMatch(/^S\d+$/);
    });

    it('should return raw value when week pattern match is null', () => {
      const result = formatXTicksLabel('invalid-week');
      expect(result).toBe('invalid-week');
    });
  });
});
