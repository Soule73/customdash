import { describe, it, expect } from 'vitest';
import {
  applyKPIFilters,
  calculateKPIValue,
  getKPIValueColor,
  getCardColors,
  calculateKPITrend,
  getKPITrendColor,
  getKPITitle,
  getKPIWidgetParams,
} from '../kpiUtils';
import type { KPIConfig, Metric } from '../../interfaces';

const testData = [
  { id: 1, value: 100, category: 'A' },
  { id: 2, value: 200, category: 'B' },
  { id: 3, value: 300, category: 'A' },
  { id: 4, value: 400, category: 'B' },
];

describe('kpiUtils', () => {
  describe('applyKPIFilters', () => {
    it('should return data without filters', () => {
      const config = {};
      const result = applyKPIFilters(testData, config);
      expect(result).toEqual(testData);
    });

    it('should apply global filters', () => {
      const config = {
        globalFilters: [{ field: 'category', operator: 'equals' as const, value: 'A' }],
      };
      const result = applyKPIFilters(testData, config);
      expect(result).toHaveLength(2);
    });

    it('should apply metric-specific filters', () => {
      const config = {
        metrics: [
          {
            field: 'value',
            agg: 'sum' as const,
            label: 'Total',
            filters: [{ field: 'value', operator: 'greater_than' as const, value: 200 }],
          },
        ],
      };
      const result = applyKPIFilters(testData, config);
      expect(result).toHaveLength(2);
    });
  });

  describe('calculateKPIValue', () => {
    const metric: Metric = { field: 'value', agg: 'sum', label: 'Total' };

    it('should calculate sum correctly', () => {
      const result = calculateKPIValue(metric, testData);
      expect(result).toBe(1000);
    });

    it('should calculate avg correctly', () => {
      const avgMetric: Metric = { field: 'value', agg: 'avg', label: 'Average' };
      const result = calculateKPIValue(avgMetric, testData);
      expect(result).toBe(250);
    });

    it('should return 0 for empty data', () => {
      const result = calculateKPIValue(metric, []);
      expect(result).toBe(0);
    });

    it('should return 0 for undefined metric', () => {
      const result = calculateKPIValue(undefined, testData);
      expect(result).toBe(0);
    });
  });

  describe('getKPIValueColor', () => {
    it('should return default color when not configured', () => {
      const result = getKPIValueColor({});
      expect(result).toBe('#2563eb');
    });

    it('should return custom color when configured', () => {
      const config = { widgetParams: { valueColor: '#ff0000' } };
      const result = getKPIValueColor(config);
      expect(result).toBe('#ff0000');
    });

    it('should return custom default color', () => {
      const result = getKPIValueColor({}, '#00ff00');
      expect(result).toBe('#00ff00');
    });
  });

  describe('getCardColors', () => {
    it('should return default colors when not configured', () => {
      const result = getCardColors({ metrics: [] });
      expect(result.iconColor).toBe('#6366f1');
      expect(result.valueColor).toBe('#2563eb');
      expect(result.descriptionColor).toBe('#6b7280');
    });

    it('should return custom colors when configured', () => {
      const config = {
        metrics: [],
        widgetParams: {
          iconColor: '#ff0000',
          valueColor: '#00ff00',
          descriptionColor: '#0000ff',
        },
      };
      const result = getCardColors(config);
      expect(result.iconColor).toBe('#ff0000');
      expect(result.valueColor).toBe('#00ff00');
      expect(result.descriptionColor).toBe('#0000ff');
    });
  });

  describe('calculateKPITrend', () => {
    const metric: Metric = { field: 'value', agg: 'sum', label: 'Test' };

    it('should calculate upward trend', () => {
      const data = [{ value: 100 }, { value: 150 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBe('up');
      expect(result.trendValue).toBe(50);
      expect(result.trendPercent).toBe(50);
    });

    it('should calculate downward trend', () => {
      const data = [{ value: 200 }, { value: 100 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBe('down');
      expect(result.trendValue).toBe(-100);
    });

    it('should return null trend when showTrend is false', () => {
      const data = [{ value: 100 }, { value: 150 }];
      const result = calculateKPITrend(metric, data, false);
      expect(result.trend).toBeNull();
    });

    it('should return null trend with single data point', () => {
      const data = [{ value: 100 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBeNull();
    });
  });

  describe('getKPITrendColor', () => {
    it('should return green for up trend', () => {
      const result = getKPITrendColor('up', 10);
      expect(result).toContain('green');
    });

    it('should return red for down trend', () => {
      const result = getKPITrendColor('down', 10);
      expect(result).toContain('red');
    });

    it('should return empty string for null trend', () => {
      const result = getKPITrendColor(null, 0);
      expect(result).toBe('');
    });

    it('should use darker color when exceeding threshold', () => {
      const result = getKPITrendColor('up', 20, 10);
      expect(result).toContain('700');
    });
  });

  describe('getKPITitle', () => {
    it('should return title from widgetParams', () => {
      const config = { widgetParams: { title: 'Custom Title' } };
      const result = getKPITitle(config, undefined);
      expect(result).toBe('Custom Title');
    });

    it('should return metric label when no title', () => {
      const metric: Metric = { field: 'value', agg: 'sum', label: 'Total Value' };
      const result = getKPITitle({}, metric);
      expect(result).toBe('Total Value');
    });

    it('should return default title when nothing available', () => {
      const result = getKPITitle({}, undefined);
      expect(result).toBe('KPI');
    });
  });

  describe('getKPIWidgetParams', () => {
    it('should return default params when not configured', () => {
      const result = getKPIWidgetParams({});
      expect(result.showTrend).toBe(true);
      expect(result.showValue).toBe(true);
      expect(result.format).toBe('number');
      expect(result.currency).toBe('USD');
      expect(result.decimals).toBe(2);
    });

    it('should return custom params when configured', () => {
      const config: KPIConfig = {
        widgetParams: {
          showTrend: false,
          format: 'currency',
          currency: 'USD',
          decimals: 0,
        },
      };
      const result = getKPIWidgetParams(config);
      expect(result.showTrend).toBe(false);
      expect(result.format).toBe('currency');
      expect(result.currency).toBe('USD');
      expect(result.decimals).toBe(0);
    });
  });

  describe('calculateKPIValue edge cases', () => {
    it('should return 0 for undefined metric', () => {
      const result = calculateKPIValue(undefined, [{ value: 10 }]);
      expect(result).toBe(0);
    });

    it('should return 0 for empty data array', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const result = calculateKPIValue(metric, []);
      expect(result).toBe(0);
    });
  });

  describe('calculateKPITrend edge cases', () => {
    it('should return null trend when showTrend is false', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 10 }, { value: 20 }];
      const result = calculateKPITrend(metric, data, false);
      expect(result.trend).toBeNull();
    });

    it('should return null trend when data has less than 2 items', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 10 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBeNull();
    });

    it('should calculate positive trend correctly', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 10 }, { value: 20 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBe('up');
      expect(result.trendValue).toBe(10);
      expect(result.trendPercent).toBe(100);
    });

    it('should calculate negative trend correctly', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 20 }, { value: 10 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBe('down');
      expect(result.trendValue).toBe(-10);
    });

    it('should return null trend when no difference', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 10 }, { value: 10 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBeNull();
    });

    it('should handle zero previous value', () => {
      const metric: Metric = { field: 'value', agg: 'sum' };
      const data = [{ value: 0 }, { value: 10 }];
      const result = calculateKPITrend(metric, data, true);
      expect(result.trend).toBe('up');
      expect(result.trendPercent).toBe(0);
    });
  });

  describe('getKPITrendColor edge cases', () => {
    it('should return empty string for null trend', () => {
      const result = getKPITrendColor(null, 0);
      expect(result).toBe('');
    });

    it('should return darker colors when threshold exceeded', () => {
      const upResult = getKPITrendColor('up', 50, 10);
      expect(upResult).toBe('text-green-700');

      const downResult = getKPITrendColor('down', -50, 10);
      expect(downResult).toBe('text-red-700');
    });
  });

  describe('getKPITitle edge cases', () => {
    it('should use metric field as fallback', () => {
      const metric: Metric = { field: 'revenue', agg: 'sum' };
      const result = getKPITitle({}, metric);
      expect(result).toBe('revenue');
    });
  });
});
