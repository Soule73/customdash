import { describe, it, expect } from 'vitest';
import {
  generateRadarMetricLabel,
  getRadarLabels,
  calculateRadarFieldValue,
  calculateRadarMetricValues,
  processRadarMetrics,
  validateRadarMetric,
  validateRadarConfiguration,
} from '../radarChartUtils';
import type { RadarMetricConfig } from '../../interfaces';

describe('radarChartUtils', () => {
  describe('generateRadarMetricLabel', () => {
    it('should return custom label when provided', () => {
      const metric: RadarMetricConfig = { fields: ['a', 'b'], agg: 'sum', label: 'Custom' };
      expect(generateRadarMetricLabel(metric)).toBe('Custom');
    });

    it('should generate label from agg and fields', () => {
      const metric: RadarMetricConfig = { fields: ['field1', 'field2'], agg: 'sum' };
      const result = generateRadarMetricLabel(metric);
      expect(result).toContain('sum');
      expect(result).toContain('field1');
      expect(result).toContain('field2');
    });

    it('should handle empty fields', () => {
      const metric: RadarMetricConfig = { fields: [], agg: 'sum' };
      const result = generateRadarMetricLabel(metric);
      expect(result).toContain('sum');
      expect(result).toContain('fields');
    });
  });

  describe('getRadarLabels', () => {
    it('should extract unique labels from all metrics', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: ['a', 'b'], agg: 'sum' },
        { fields: ['b', 'c'], agg: 'avg' },
      ];
      const labels = getRadarLabels(metrics);
      expect(labels).toHaveLength(3);
      expect(labels).toContain('a');
      expect(labels).toContain('b');
      expect(labels).toContain('c');
    });

    it('should return empty array for empty metrics', () => {
      expect(getRadarLabels([])).toEqual([]);
    });

    it('should handle metrics with no fields', () => {
      const metrics: RadarMetricConfig[] = [{ fields: [], agg: 'sum' }];
      expect(getRadarLabels(metrics)).toEqual([]);
    });

    it('should convert non-string fields to strings', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: ['a', 123 as unknown as string, 'b'], agg: 'sum' },
      ];
      const result = getRadarLabels(metrics);
      expect(result).toContain('a');
      expect(result).toContain('123');
      expect(result).toContain('b');
    });

    it('should handle undefined fields array gracefully', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: undefined as unknown as string[], agg: 'sum' },
      ];
      expect(getRadarLabels(metrics)).toEqual([]);
    });
  });

  describe('calculateRadarFieldValue', () => {
    const testData = [
      { value: 10, count: 1 },
      { value: 20, count: 2 },
      { value: 30, count: 3 },
    ];

    it('should calculate sum correctly', () => {
      const result = calculateRadarFieldValue(testData, 'value', 'sum');
      expect(result).toBe(60);
    });

    it('should calculate avg correctly', () => {
      const result = calculateRadarFieldValue(testData, 'value', 'avg');
      expect(result).toBe(20);
    });

    it('should calculate count correctly', () => {
      const result = calculateRadarFieldValue(testData, 'value', 'count');
      expect(result).toBe(3);
    });

    it('should calculate min correctly', () => {
      const result = calculateRadarFieldValue(testData, 'value', 'min');
      expect(result).toBe(10);
    });

    it('should calculate max correctly', () => {
      const result = calculateRadarFieldValue(testData, 'value', 'max');
      expect(result).toBe(30);
    });

    it('should return 0 for empty data', () => {
      const result = calculateRadarFieldValue([], 'value', 'sum');
      expect(result).toBe(0);
    });
  });

  describe('calculateRadarMetricValues', () => {
    const testData = [
      { a: 10, b: 20, c: 30 },
      { a: 20, b: 30, c: 40 },
    ];

    it('should calculate values for all labels', () => {
      const metric: RadarMetricConfig = { fields: ['a', 'b'], agg: 'sum' };
      const allLabels = ['a', 'b', 'c'];
      const values = calculateRadarMetricValues(testData, metric, allLabels);

      expect(values).toHaveLength(3);
      expect(values[0]).toBe(30);
      expect(values[1]).toBe(50);
      expect(values[2]).toBe(0);
    });

    it('should return 0 for fields not in metric', () => {
      const metric: RadarMetricConfig = { fields: ['a'], agg: 'sum' };
      const allLabels = ['a', 'b', 'c'];
      const values = calculateRadarMetricValues(testData, metric, allLabels);

      expect(values[0]).toBe(30);
      expect(values[1]).toBe(0);
      expect(values[2]).toBe(0);
    });
  });

  describe('processRadarMetrics', () => {
    const testData = [
      { sales: 100, profit: 50, category: 'A' },
      { sales: 200, profit: 80, category: 'A' },
      { sales: 150, profit: 60, category: 'B' },
    ];

    it('should process multiple metrics', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: ['sales', 'profit'], agg: 'sum', label: 'Dataset 1' },
        { fields: ['sales', 'profit'], agg: 'avg', label: 'Dataset 2' },
      ];
      const result = processRadarMetrics(testData, metrics);

      expect(result).toHaveLength(2);
      expect(result[0].index).toBe(0);
      expect(result[1].index).toBe(1);
    });

    it('should calculate correct values', () => {
      const metrics: RadarMetricConfig[] = [{ fields: ['sales', 'profit'], agg: 'sum' }];
      const result = processRadarMetrics(testData, metrics);

      expect(result[0].values).toHaveLength(2);
      expect(result[0].values[0]).toBe(450);
      expect(result[0].values[1]).toBe(190);
    });

    it('should apply global filters', () => {
      const metrics: RadarMetricConfig[] = [{ fields: ['sales', 'profit'], agg: 'sum' }];
      const globalFilters = [{ field: 'category', operator: 'equals' as const, value: 'A' }];
      const result = processRadarMetrics(testData, metrics, globalFilters);

      expect(result[0].values[0]).toBe(300);
      expect(result[0].values[1]).toBe(130);
    });

    it('should apply dataset filters', () => {
      const metrics: RadarMetricConfig[] = [
        {
          fields: ['sales', 'profit'],
          agg: 'sum',
          datasetFilters: [{ field: 'category', operator: 'equals' as const, value: 'B' }],
        },
      ];
      const result = processRadarMetrics(testData, metrics);

      expect(result[0].values[0]).toBe(150);
      expect(result[0].values[1]).toBe(60);
    });
  });

  describe('validateRadarMetric', () => {
    it('should return valid for complete metric', () => {
      const metric: RadarMetricConfig = { fields: ['a', 'b'], agg: 'sum' };
      const result = validateRadarMetric(metric);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when fields is empty', () => {
      const metric: RadarMetricConfig = { fields: [], agg: 'sum' };
      const result = validateRadarMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('field'))).toBe(true);
    });

    it('should return invalid when agg is missing', () => {
      const metric = { fields: ['a', 'b'] } as RadarMetricConfig;
      const result = validateRadarMetric(metric);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('aggregation'))).toBe(true);
    });
  });

  describe('validateRadarConfiguration', () => {
    it('should return invalid for empty metrics array', () => {
      const result = validateRadarConfiguration([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one dataset must be configured');
    });

    it('should return valid for valid metrics', () => {
      const metrics: RadarMetricConfig[] = [{ fields: ['a', 'b'], agg: 'sum' }];
      const result = validateRadarConfiguration(metrics);
      expect(result.isValid).toBe(true);
    });

    it('should return warning for inconsistent fields', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: ['a', 'b'], agg: 'sum' },
        { fields: ['a', 'c'], agg: 'avg' },
      ];
      const result = validateRadarConfiguration(metrics);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should not return warning for consistent fields', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: ['a', 'b'], agg: 'sum' },
        { fields: ['a', 'b'], agg: 'avg' },
      ];
      const result = validateRadarConfiguration(metrics);
      expect(result.warnings).toHaveLength(0);
    });

    it('should accumulate errors from invalid metrics', () => {
      const metrics: RadarMetricConfig[] = [
        { fields: [], agg: 'sum' },
        { fields: ['a'], agg: '' as import('../../types').AggregationType },
      ];
      const result = validateRadarConfiguration(metrics);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
