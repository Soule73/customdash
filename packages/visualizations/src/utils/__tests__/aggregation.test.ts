import { describe, it, expect } from 'vitest';
import {
  aggregateNumericValues,
  extractNumericValues,
  aggregateFromRecords,
  validateChartMetrics,
  calculateXYScales,
  convertToXYPoints,
  generateAxisMetricLabel,
} from '../aggregation';

describe('aggregation', () => {
  describe('aggregateNumericValues', () => {
    const values = [10, 20, 30, 40, 50];

    it('should calculate sum correctly', () => {
      expect(aggregateNumericValues(values, 'sum')).toBe(150);
    });

    it('should calculate average correctly', () => {
      expect(aggregateNumericValues(values, 'avg')).toBe(30);
    });

    it('should calculate min correctly', () => {
      expect(aggregateNumericValues(values, 'min')).toBe(10);
    });

    it('should calculate max correctly', () => {
      expect(aggregateNumericValues(values, 'max')).toBe(50);
    });

    it('should calculate count correctly', () => {
      expect(aggregateNumericValues(values, 'count')).toBe(5);
    });

    it('should return first value for none aggregation', () => {
      expect(aggregateNumericValues(values, 'none')).toBe(10);
    });

    it('should return 0 for empty array', () => {
      expect(aggregateNumericValues([], 'sum')).toBe(0);
    });

    it('should filter out NaN values', () => {
      const valuesWithNaN = [10, NaN, 30, Infinity, 50];
      expect(aggregateNumericValues(valuesWithNaN, 'sum')).toBe(90);
    });
  });

  describe('extractNumericValues', () => {
    const data = [
      { value: 10, name: 'A' },
      { value: 20, name: 'B' },
      { value: 'invalid', name: 'C' },
      { value: 40, name: 'D' },
    ];

    it('should extract numeric values from field', () => {
      const result = extractNumericValues(data, 'value');
      expect(result).toEqual([10, 20, 40]);
    });

    it('should return empty array for non-existent field', () => {
      const result = extractNumericValues(data, 'nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('aggregateFromRecords', () => {
    const data = [
      { id: 1, amount: 100 },
      { id: 2, amount: 200 },
      { id: 3, amount: 300 },
    ];

    it('should aggregate sum from records', () => {
      expect(aggregateFromRecords(data, 'sum', 'amount')).toBe(600);
    });

    it('should aggregate avg from records', () => {
      expect(aggregateFromRecords(data, 'avg', 'amount')).toBe(200);
    });

    it('should return count for count aggregation', () => {
      expect(aggregateFromRecords(data, 'count', 'amount')).toBe(3);
    });

    it('should handle none aggregation with single row', () => {
      const singleRow = [{ id: 1, amount: 100 }];
      expect(aggregateFromRecords(singleRow, 'none', 'amount')).toBe(100);
    });

    it('should handle none aggregation with multiple rows', () => {
      expect(aggregateFromRecords(data, 'none', 'amount')).toBe(100);
    });

    it('should return 0 for none aggregation with single row when value is non-numeric', () => {
      const singleRow = [{ id: 1, amount: 'not-a-number' }];
      expect(aggregateFromRecords(singleRow, 'none', 'amount')).toBe(0);
    });

    it('should return 0 for none aggregation when no valid value found', () => {
      const rowsWithNullValues = [
        { id: 1, amount: undefined },
        { id: 2, amount: null },
      ];
      expect(aggregateFromRecords(rowsWithNullValues, 'none', 'amount')).toBe(0);
    });

    it('should return 0 for none aggregation when field value is NaN after conversion', () => {
      const rowsWithInvalidValues = [{ id: 1, amount: 'abc' }];
      expect(aggregateFromRecords(rowsWithInvalidValues, 'none', 'amount')).toBe(0);
    });
  });

  describe('validateChartMetrics', () => {
    it('should return invalid for empty metrics array', () => {
      const result = validateChartMetrics({ metrics: [], chartType: 'scatter' });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one dataset must be configured');
    });

    describe('scatter validation', () => {
      it('should validate scatter metrics with x and y', () => {
        const result = validateChartMetrics({
          metrics: [{ x: 'xField', y: 'yField' }],
          chartType: 'scatter',
        });
        expect(result.isValid).toBe(true);
      });

      it('should return invalid when x is missing', () => {
        const result = validateChartMetrics({
          metrics: [{ x: '', y: 'yField' }],
          chartType: 'scatter',
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('X field'))).toBe(true);
      });
    });

    describe('bubble validation', () => {
      it('should validate bubble metrics with x, y and r', () => {
        const result = validateChartMetrics({
          metrics: [{ x: 'xField', y: 'yField', r: 'rField' }],
          chartType: 'bubble',
        });
        expect(result.isValid).toBe(true);
      });

      it('should return invalid when r is missing', () => {
        const result = validateChartMetrics({
          metrics: [{ x: 'xField', y: 'yField', r: '' }],
          chartType: 'bubble',
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('R field'))).toBe(true);
      });
    });

    describe('radar validation', () => {
      it('should validate radar metrics with fields and agg', () => {
        const result = validateChartMetrics({
          metrics: [{ fields: ['field1', 'field2'], agg: 'sum' }],
          chartType: 'radar',
        });
        expect(result.isValid).toBe(true);
      });

      it('should return invalid when fields is empty', () => {
        const result = validateChartMetrics({
          metrics: [{ fields: [], agg: 'sum' }],
          chartType: 'radar',
        });
        expect(result.isValid).toBe(false);
      });

      it('should return invalid when agg is missing', () => {
        const result = validateChartMetrics({
          metrics: [{ fields: ['field1'], agg: '' }],
          chartType: 'radar',
        });
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('calculateXYScales', () => {
    it('should calculate scales from points', () => {
      const points = [
        { x: 10, y: 20 },
        { x: 50, y: 80 },
        { x: 30, y: 40 },
      ];
      const result = calculateXYScales(points);

      expect(result.xMin).toBeLessThan(10);
      expect(result.xMax).toBeGreaterThan(50);
      expect(result.yMin).toBeLessThan(20);
      expect(result.yMax).toBeGreaterThan(80);
    });

    it('should return default scales for empty points', () => {
      const result = calculateXYScales([]);
      expect(result).toEqual({ xMin: 0, xMax: 100, yMin: 0, yMax: 100 });
    });

    it('should add 10% margin to scales', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
      ];
      const result = calculateXYScales(points);

      expect(result.xMin).toBe(-10);
      expect(result.xMax).toBe(110);
    });
  });

  describe('convertToXYPoints', () => {
    const data = [
      { xVal: 10, yVal: 20 },
      { xVal: 30, yVal: 40 },
      { xVal: 'invalid', yVal: 50 },
    ];

    it('should convert records to XY points', () => {
      const result = convertToXYPoints(data, 'xVal', 'yVal');
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ x: 10, y: 20 });
    });

    it('should return empty array for empty data', () => {
      const result = convertToXYPoints([], 'xVal', 'yVal');
      expect(result).toEqual([]);
    });

    it('should return empty array when fields are missing', () => {
      const result = convertToXYPoints(data, '', 'yVal');
      expect(result).toEqual([]);
    });
  });

  describe('generateAxisMetricLabel', () => {
    it('should return custom label when provided', () => {
      const metric = { label: 'Custom Label', x: 'xField', y: 'yField' };
      expect(generateAxisMetricLabel(metric)).toBe('Custom Label');
    });

    it('should generate label from x and y fields', () => {
      const metric = { x: 'xField', y: 'yField' };
      expect(generateAxisMetricLabel(metric)).toBe('X: xField, Y: yField');
    });

    it('should include r field for bubble', () => {
      const metric = { x: 'xField', y: 'yField', r: 'rField' };
      expect(generateAxisMetricLabel(metric)).toBe('X: xField, Y: yField, R: rField');
    });

    it('should return default label when no fields', () => {
      expect(generateAxisMetricLabel({})).toBe('Dataset');
      expect(generateAxisMetricLabel({}, 'My Default')).toBe('My Default');
    });
  });

  describe('aggregateNumericValues edge cases', () => {
    it('should return first value for default/unknown aggregation type', () => {
      const values = [10, 20, 30];
      expect(
        aggregateNumericValues(values, 'unknown' as import('../../types').AggregationType),
      ).toBe(10);
    });

    it('should return 0 for none aggregation with empty valid values', () => {
      const values = [NaN, Infinity];
      expect(aggregateNumericValues(values, 'none')).toBe(0);
    });
  });
});
