import { describe, it, expect } from 'vitest';
import {
  generateBubbleMetricLabel,
  validateBubbleMetric,
  validateBubbleConfiguration,
  convertToBubbleData,
  processBubbleMetrics,
  calculateBubbleScales,
} from '../bubbleChartUtils';
import type { BubbleMetricConfig, Filter } from '../../interfaces';

function createBubbleMetric(
  overrides: Partial<BubbleMetricConfig> & { x: string; y: string; r: string },
): BubbleMetricConfig {
  return {
    field: overrides.field ?? overrides.x,
    agg: overrides.agg ?? 'sum',
    ...overrides,
  };
}

describe('bubbleChartUtils', () => {
  describe('generateBubbleMetricLabel', () => {
    it('should return custom label when provided', () => {
      const metric = createBubbleMetric({ x: 'xField', y: 'yField', r: 'rField', label: 'Custom' });
      expect(generateBubbleMetricLabel(metric)).toBe('Custom');
    });

    it('should generate label from x, y, r fields', () => {
      const metric = createBubbleMetric({ x: 'xField', y: 'yField', r: 'rField' });
      const result = generateBubbleMetricLabel(metric);
      expect(result).toContain('X: xField');
      expect(result).toContain('Y: yField');
      expect(result).toContain('R: rField');
    });

    it('should return default label when no fields', () => {
      const metric = {} as BubbleMetricConfig;
      expect(generateBubbleMetricLabel(metric)).toBe('Bubble Dataset');
    });
  });

  describe('validateBubbleMetric', () => {
    it('should return valid for complete metric', () => {
      const metric = createBubbleMetric({ x: 'xField', y: 'yField', r: 'rField' });
      const result = validateBubbleMetric(metric);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when x is missing', () => {
      const metric = createBubbleMetric({ x: '', y: 'yField', r: 'rField' });
      const result = validateBubbleMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('X'))).toBe(true);
    });

    it('should return invalid when y is missing', () => {
      const metric = createBubbleMetric({ x: 'xField', y: '', r: 'rField' });
      const result = validateBubbleMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Y'))).toBe(true);
    });

    it('should return invalid when r is missing', () => {
      const metric = createBubbleMetric({ x: 'xField', y: 'yField', r: '' });
      const result = validateBubbleMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('R'))).toBe(true);
    });
  });

  describe('validateBubbleConfiguration', () => {
    it('should return invalid for empty metrics array', () => {
      const result = validateBubbleConfiguration([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one dataset must be configured');
    });

    it('should return valid for valid metrics', () => {
      const metrics = [createBubbleMetric({ x: 'xField', y: 'yField', r: 'rField' })];
      const result = validateBubbleConfiguration(metrics);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid with dataset-specific errors', () => {
      const metrics = [createBubbleMetric({ x: '', y: 'yField', r: 'rField' })];
      const result = validateBubbleConfiguration(metrics);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Dataset 1'))).toBe(true);
    });
  });

  describe('convertToBubbleData', () => {
    const testData = [
      { xVal: 10, yVal: 20, rVal: 5 },
      { xVal: 30, yVal: 40, rVal: 8 },
      { xVal: 50, yVal: 60, rVal: 3 },
    ];

    it('should convert data to bubble points', () => {
      const metric = createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData(testData, metric);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ x: 10, y: 20, r: 5 });
      expect(result[1]).toEqual({ x: 30, y: 40, r: 8 });
    });

    it('should return empty array for empty data', () => {
      const metric = createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData([], metric);
      expect(result).toEqual([]);
    });

    it('should return empty array when fields are missing', () => {
      const metric = createBubbleMetric({ x: '', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData(testData, metric);
      expect(result).toEqual([]);
    });

    it('should filter out points with negative radius', () => {
      const dataWithInvalidR = [
        { xVal: 10, yVal: 20, rVal: 5 },
        { xVal: 30, yVal: 40, rVal: -1 },
      ];
      const metric = createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData(dataWithInvalidR, metric);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ x: 10, y: 20, r: 5 });
    });

    it('should default zero radius to 1', () => {
      const dataWithZeroR = [{ xVal: 10, yVal: 20, rVal: 0 }];
      const metric = createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData(dataWithZeroR, metric);
      expect(result).toHaveLength(1);
      expect(result[0].r).toBe(1);
    });

    it('should handle non-numeric values', () => {
      const dataWithStrings = [
        { xVal: 'invalid', yVal: 20, rVal: 5 },
        { xVal: 30, yVal: 40, rVal: 8 },
      ];
      const metric = createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' });
      const result = convertToBubbleData(dataWithStrings, metric);
      expect(result).toHaveLength(2);
    });
  });

  describe('processBubbleMetrics', () => {
    const testData = [
      { x: 10, y: 20, r: 5, category: 'A' },
      { x: 30, y: 40, r: 8, category: 'A' },
      { x: 50, y: 60, r: 3, category: 'B' },
    ];

    it('should process multiple metrics', () => {
      const metrics = [
        createBubbleMetric({ x: 'x', y: 'y', r: 'r', label: 'Dataset 1' }),
        createBubbleMetric({ x: 'x', y: 'y', r: 'r', label: 'Dataset 2' }),
      ];
      const result = processBubbleMetrics(testData, metrics);
      expect(result).toHaveLength(2);
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(1);
    });

    it('should apply global filters', () => {
      const metrics = [createBubbleMetric({ x: 'x', y: 'y', r: 'r' })];
      const globalFilters: Filter[] = [{ field: 'category', operator: 'equals', value: 'A' }];
      const result = processBubbleMetrics(testData, metrics, globalFilters);
      expect(result[0].bubbleData).toHaveLength(2);
    });

    it('should apply dataset filters', () => {
      const datasetFilters: Filter[] = [{ field: 'category', operator: 'equals', value: 'B' }];
      const metrics = [createBubbleMetric({ x: 'x', y: 'y', r: 'r', datasetFilters })];
      const result = processBubbleMetrics(testData, metrics);
      expect(result[0].bubbleData).toHaveLength(1);
    });
  });

  describe('calculateBubbleScales', () => {
    const testData = [
      { xVal: 10, yVal: 20, rVal: 5 },
      { xVal: 50, yVal: 80, rVal: 15 },
    ];

    it('should calculate scales from data', () => {
      const metrics = [createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' })];
      const scales = calculateBubbleScales(testData, metrics);

      expect(scales.xMin).toBeLessThan(10);
      expect(scales.xMax).toBeGreaterThan(50);
      expect(scales.yMin).toBeLessThan(20);
      expect(scales.yMax).toBeGreaterThan(80);
      expect(scales.rMin).toBe(5);
      expect(scales.rMax).toBe(15);
    });

    it('should return default scales for empty data', () => {
      const metrics = [createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' })];
      const scales = calculateBubbleScales([], metrics);

      expect(scales).toEqual({
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
        rMin: 1,
        rMax: 10,
      });
    });

    it('should return default scales for empty metrics', () => {
      const scales = calculateBubbleScales(testData, []);
      expect(scales.xMin).toBe(0);
      expect(scales.xMax).toBe(100);
    });

    it('should handle data with no valid bubble points', () => {
      const invalidData = [{ xVal: 'a', yVal: 'b', rVal: 'c' }];
      const metrics = [createBubbleMetric({ x: 'xVal', y: 'yVal', r: 'rVal' })];
      const scales = calculateBubbleScales(invalidData, metrics);

      expect(scales.rMin).toBe(1);
      expect(scales.rMax).toBeGreaterThanOrEqual(1);
    });
  });

  describe('convertToBubbleData edge cases', () => {
    it('should return empty array when x field is missing', () => {
      const metric = createBubbleMetric({ x: '', y: 'y', r: 'r' });
      const result = convertToBubbleData([{ y: 10, r: 5 }], metric);
      expect(result).toEqual([]);
    });

    it('should return empty array when y field is missing', () => {
      const metric = createBubbleMetric({ x: 'x', y: '', r: 'r' });
      const result = convertToBubbleData([{ x: 10, r: 5 }], metric);
      expect(result).toEqual([]);
    });

    it('should return empty array when r field is missing', () => {
      const metric = createBubbleMetric({ x: 'x', y: 'y', r: '' });
      const result = convertToBubbleData([{ x: 10, y: 20 }], metric);
      expect(result).toEqual([]);
    });

    it('should include points with zero radius as default value 1', () => {
      const metric = createBubbleMetric({ x: 'x', y: 'y', r: 'r' });
      const data = [
        { x: 10, y: 20, r: 0 },
        { x: 20, y: 30, r: 5 },
      ];
      const result = convertToBubbleData(data, metric);
      expect(result).toHaveLength(2);
      expect(result[0].r).toBe(1);
      expect(result[1].r).toBe(5);
    });
  });
});
