import { describe, it, expect } from 'vitest';
import {
  generateScatterMetricLabel,
  validateScatterMetric,
  validateScatterConfiguration,
  convertToScatterData,
  processScatterMetrics,
  calculateScatterScales,
} from '../scatterChartUtils';
import type { ScatterMetricConfig, Filter } from '../../interfaces';

function createScatterMetric(
  overrides: Partial<ScatterMetricConfig> & { x: string; y: string },
): ScatterMetricConfig {
  return {
    field: overrides.field ?? overrides.x,
    agg: overrides.agg ?? 'sum',
    ...overrides,
  };
}

describe('scatterChartUtils', () => {
  describe('generateScatterMetricLabel', () => {
    it('should return custom label when provided', () => {
      const metric = createScatterMetric({ x: 'xField', y: 'yField', label: 'Custom' });
      expect(generateScatterMetricLabel(metric)).toBe('Custom');
    });

    it('should generate label from x and y fields', () => {
      const metric = createScatterMetric({ x: 'xField', y: 'yField' });
      const result = generateScatterMetricLabel(metric);
      expect(result).toContain('X: xField');
      expect(result).toContain('Y: yField');
    });

    it('should return default label when no fields', () => {
      const metric = {} as ScatterMetricConfig;
      expect(generateScatterMetricLabel(metric)).toBe('Scatter Dataset');
    });
  });

  describe('validateScatterMetric', () => {
    it('should return valid for complete metric', () => {
      const metric = createScatterMetric({ x: 'xField', y: 'yField' });
      const result = validateScatterMetric(metric);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when x is missing', () => {
      const metric = createScatterMetric({ x: '', y: 'yField' });
      const result = validateScatterMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('X'))).toBe(true);
    });

    it('should return invalid when y is missing', () => {
      const metric = createScatterMetric({ x: 'xField', y: '' });
      const result = validateScatterMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Y'))).toBe(true);
    });
  });

  describe('validateScatterConfiguration', () => {
    it('should return invalid for empty metrics array', () => {
      const result = validateScatterConfiguration([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one dataset must be configured');
    });

    it('should return valid for valid metrics', () => {
      const metrics = [createScatterMetric({ x: 'xField', y: 'yField' })];
      const result = validateScatterConfiguration(metrics);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid with dataset-specific errors', () => {
      const metrics = [createScatterMetric({ x: '', y: 'yField' })];
      const result = validateScatterConfiguration(metrics);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Dataset 1'))).toBe(true);
    });
  });

  describe('convertToScatterData', () => {
    const testData = [
      { xVal: 10, yVal: 20 },
      { xVal: 30, yVal: 40 },
      { xVal: 50, yVal: 60 },
    ];

    it('should convert data to scatter points', () => {
      const metric = createScatterMetric({ x: 'xVal', y: 'yVal' });
      const result = convertToScatterData(testData, metric);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ x: 10, y: 20 });
      expect(result[1]).toEqual({ x: 30, y: 40 });
    });

    it('should return empty array for empty data', () => {
      const metric = createScatterMetric({ x: 'xVal', y: 'yVal' });
      const result = convertToScatterData([], metric);
      expect(result).toEqual([]);
    });

    it('should return empty array when x field is missing', () => {
      const metric = createScatterMetric({ x: '', y: 'yVal' });
      const result = convertToScatterData(testData, metric);
      expect(result).toEqual([]);
    });

    it('should return empty array when y field is missing', () => {
      const metric = createScatterMetric({ x: 'xVal', y: '' });
      const result = convertToScatterData(testData, metric);
      expect(result).toEqual([]);
    });

    it('should handle non-numeric values', () => {
      const dataWithStrings = [
        { xVal: 'invalid', yVal: 20 },
        { xVal: 30, yVal: 40 },
      ];
      const metric = createScatterMetric({ x: 'xVal', y: 'yVal' });
      const result = convertToScatterData(dataWithStrings, metric);
      expect(result).toHaveLength(2);
    });
  });

  describe('processScatterMetrics', () => {
    const testData = [
      { x: 10, y: 20, category: 'A' },
      { x: 30, y: 40, category: 'A' },
      { x: 50, y: 60, category: 'B' },
    ];

    it('should process multiple metrics', () => {
      const metrics = [
        createScatterMetric({ x: 'x', y: 'y', label: 'Dataset 1' }),
        createScatterMetric({ x: 'x', y: 'y', label: 'Dataset 2' }),
      ];
      const result = processScatterMetrics(testData, metrics);
      expect(result).toHaveLength(2);
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(1);
    });

    it('should apply global filters', () => {
      const metrics = [createScatterMetric({ x: 'x', y: 'y' })];
      const globalFilters: Filter[] = [{ field: 'category', operator: 'equals', value: 'A' }];
      const result = processScatterMetrics(testData, metrics, globalFilters);
      expect(result[0].scatterData).toHaveLength(2);
    });

    it('should apply dataset filters', () => {
      const datasetFilters: Filter[] = [{ field: 'category', operator: 'equals', value: 'B' }];
      const metrics = [createScatterMetric({ x: 'x', y: 'y', datasetFilters })];
      const result = processScatterMetrics(testData, metrics);
      expect(result[0].scatterData).toHaveLength(1);
    });
  });

  describe('calculateScatterScales', () => {
    const testData = [
      { xVal: 10, yVal: 20 },
      { xVal: 50, yVal: 80 },
    ];

    it('should calculate scales from data', () => {
      const metrics = [createScatterMetric({ x: 'xVal', y: 'yVal' })];
      const scales = calculateScatterScales(testData, metrics);

      expect(scales.xMin).toBeLessThan(10);
      expect(scales.xMax).toBeGreaterThan(50);
      expect(scales.yMin).toBeLessThan(20);
      expect(scales.yMax).toBeGreaterThan(80);
    });

    it('should add 10% margin to scales', () => {
      const data = [
        { xVal: 0, yVal: 0 },
        { xVal: 100, yVal: 100 },
      ];
      const metrics = [createScatterMetric({ x: 'xVal', y: 'yVal' })];
      const scales = calculateScatterScales(data, metrics);

      expect(scales.xMin).toBe(-10);
      expect(scales.xMax).toBe(110);
    });

    it('should return default scales for empty data', () => {
      const metrics = [createScatterMetric({ x: 'xVal', y: 'yVal' })];
      const scales = calculateScatterScales([], metrics);

      expect(scales).toEqual({
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
      });
    });

    it('should return default scales for empty metrics', () => {
      const scales = calculateScatterScales(testData, []);
      expect(scales.xMin).toBe(0);
      expect(scales.xMax).toBe(100);
    });
  });
});
