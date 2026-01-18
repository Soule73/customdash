import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CHART_COLORS,
  BUCKET_TYPE_OPTIONS,
  DATE_INTERVAL_OPTIONS,
  SORT_ORDER_OPTIONS,
  AGGREGATION_TYPE_OPTIONS,
  FILTER_OPERATOR_OPTIONS,
  VALID_FILTER_OPERATORS,
  LEGEND_POSITION_OPTIONS,
  CHART_TYPE_OPTIONS,
  FORMAT_TYPE_OPTIONS,
  DEFAULT_FORMAT_CONFIG,
  DEFAULT_WIDGET_PARAMS,
  DEFAULT_KPI_PARAMS,
  DEFAULT_KPI_COLORS,
  CURRENCY_SYMBOL_BEFORE_LOCALES,
  CURRENCY_CODE_AFTER_CURRENCIES,
  CURRENCY_OPTIONS,
  HSL_COLOR_DEFAULTS,
  CHART_DEFAULTS,
  TABLE_DEFAULTS,
} from '../../constants';

describe('constants', () => {
  describe('DEFAULT_CHART_COLORS', () => {
    it('should have at least 10 colors', () => {
      expect(DEFAULT_CHART_COLORS.length).toBeGreaterThanOrEqual(10);
    });

    it('should contain valid hex colors', () => {
      DEFAULT_CHART_COLORS.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('BUCKET_TYPE_OPTIONS', () => {
    it('should have all bucket types defined', () => {
      expect(BUCKET_TYPE_OPTIONS.length).toBeGreaterThan(0);
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'terms')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'histogram')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'date_histogram')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'range')).toBeDefined();
      expect(BUCKET_TYPE_OPTIONS.find(o => o.value === 'split_series')).toBeDefined();
    });

    it('should have label and description for each option', () => {
      BUCKET_TYPE_OPTIONS.forEach(option => {
        expect(option.label).toBeDefined();
        expect(option.label.length).toBeGreaterThan(0);
        expect(option.description && option.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('DATE_INTERVAL_OPTIONS', () => {
    it('should have all date intervals defined', () => {
      expect(DATE_INTERVAL_OPTIONS.length).toBeGreaterThan(0);
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'minute')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'hour')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'day')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'week')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'month')).toBeDefined();
      expect(DATE_INTERVAL_OPTIONS.find(o => o.value === 'year')).toBeDefined();
    });
  });

  describe('SORT_ORDER_OPTIONS', () => {
    it('should have asc and desc options', () => {
      expect(SORT_ORDER_OPTIONS).toHaveLength(2);
      expect(SORT_ORDER_OPTIONS.find(o => o.value === 'asc')).toBeDefined();
      expect(SORT_ORDER_OPTIONS.find(o => o.value === 'desc')).toBeDefined();
    });
  });

  describe('AGGREGATION_TYPE_OPTIONS', () => {
    it('should have all aggregation types', () => {
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'sum')).toBeDefined();
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'avg')).toBeDefined();
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'count')).toBeDefined();
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'min')).toBeDefined();
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'max')).toBeDefined();
      expect(AGGREGATION_TYPE_OPTIONS.find(o => o.value === 'none')).toBeDefined();
    });
  });

  describe('FILTER_OPERATOR_OPTIONS', () => {
    it('should have all filter operators', () => {
      expect(FILTER_OPERATOR_OPTIONS.find(o => o.value === 'equals')).toBeDefined();
      expect(FILTER_OPERATOR_OPTIONS.find(o => o.value === 'not_equals')).toBeDefined();
      expect(FILTER_OPERATOR_OPTIONS.find(o => o.value === 'contains')).toBeDefined();
      expect(FILTER_OPERATOR_OPTIONS.find(o => o.value === 'greater_than')).toBeDefined();
      expect(FILTER_OPERATOR_OPTIONS.find(o => o.value === 'less_than')).toBeDefined();
    });
  });

  describe('VALID_FILTER_OPERATORS', () => {
    it('should contain all valid operators', () => {
      expect(VALID_FILTER_OPERATORS).toContain('equals');
      expect(VALID_FILTER_OPERATORS).toContain('not_equals');
      expect(VALID_FILTER_OPERATORS).toContain('contains');
      expect(VALID_FILTER_OPERATORS).toContain('not_contains');
      expect(VALID_FILTER_OPERATORS).toContain('greater_than');
      expect(VALID_FILTER_OPERATORS).toContain('less_than');
      expect(VALID_FILTER_OPERATORS).toContain('greater_equal');
      expect(VALID_FILTER_OPERATORS).toContain('less_equal');
      expect(VALID_FILTER_OPERATORS).toContain('starts_with');
      expect(VALID_FILTER_OPERATORS).toContain('ends_with');
    });

    it('should match FILTER_OPERATOR_OPTIONS values', () => {
      const optionValues = FILTER_OPERATOR_OPTIONS.map(o => o.value);
      expect(VALID_FILTER_OPERATORS).toEqual(optionValues);
    });
  });

  describe('LEGEND_POSITION_OPTIONS', () => {
    it('should have all position options', () => {
      expect(LEGEND_POSITION_OPTIONS.find(o => o.value === 'top')).toBeDefined();
      expect(LEGEND_POSITION_OPTIONS.find(o => o.value === 'bottom')).toBeDefined();
      expect(LEGEND_POSITION_OPTIONS.find(o => o.value === 'left')).toBeDefined();
      expect(LEGEND_POSITION_OPTIONS.find(o => o.value === 'right')).toBeDefined();
    });
  });

  describe('CHART_TYPE_OPTIONS', () => {
    it('should have all chart types', () => {
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'bar')).toBeDefined();
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'line')).toBeDefined();
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'pie')).toBeDefined();
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'scatter')).toBeDefined();
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'bubble')).toBeDefined();
      expect(CHART_TYPE_OPTIONS.find(o => o.value === 'radar')).toBeDefined();
    });

    it('should have descriptions for each chart type', () => {
      CHART_TYPE_OPTIONS.forEach(option => {
        expect(option.description).toBeDefined();
        expect(option.description?.length).toBeGreaterThan(0);
      });
    });
  });

  describe('FORMAT_TYPE_OPTIONS', () => {
    it('should have all format types', () => {
      expect(FORMAT_TYPE_OPTIONS.find(o => o.value === 'number')).toBeDefined();
      expect(FORMAT_TYPE_OPTIONS.find(o => o.value === 'currency')).toBeDefined();
      expect(FORMAT_TYPE_OPTIONS.find(o => o.value === 'percent')).toBeDefined();
      expect(FORMAT_TYPE_OPTIONS.find(o => o.value === 'date')).toBeDefined();
      expect(FORMAT_TYPE_OPTIONS.find(o => o.value === 'text')).toBeDefined();
    });
  });

  describe('DEFAULT_FORMAT_CONFIG', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_FORMAT_CONFIG.locale).toBe('en-US');
      expect(DEFAULT_FORMAT_CONFIG.currency).toBe('USD');
      expect(DEFAULT_FORMAT_CONFIG.decimals).toBe(2);
      expect(DEFAULT_FORMAT_CONFIG.nullValue).toBe('-');
    });
  });

  describe('DEFAULT_WIDGET_PARAMS', () => {
    it('should have all required default values', () => {
      expect(DEFAULT_WIDGET_PARAMS.title).toBe('');
      expect(DEFAULT_WIDGET_PARAMS.legendPosition).toBe('top');
      expect(DEFAULT_WIDGET_PARAMS.legend).toBe(true);
      expect(DEFAULT_WIDGET_PARAMS.showGrid).toBe(true);
      expect(DEFAULT_WIDGET_PARAMS.stacked).toBe(false);
      expect(DEFAULT_WIDGET_PARAMS.horizontal).toBe(false);
    });

    it('should have numeric defaults', () => {
      expect(DEFAULT_WIDGET_PARAMS.labelFontSize).toBe(12);
      expect(DEFAULT_WIDGET_PARAMS.tension).toBe(0);
      expect(DEFAULT_WIDGET_PARAMS.borderWidth).toBe(1);
      expect(DEFAULT_WIDGET_PARAMS.pointRadius).toBe(3);
    });
  });

  describe('DEFAULT_KPI_PARAMS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_KPI_PARAMS.showTrend).toBe(true);
      expect(DEFAULT_KPI_PARAMS.showValue).toBe(true);
      expect(DEFAULT_KPI_PARAMS.format).toBe('number');
      expect(DEFAULT_KPI_PARAMS.currency).toBe('USD');
      expect(DEFAULT_KPI_PARAMS.decimals).toBe(2);
    });
  });

  describe('DEFAULT_KPI_COLORS', () => {
    it('should have all color properties', () => {
      expect(DEFAULT_KPI_COLORS.icon).toBeDefined();
      expect(DEFAULT_KPI_COLORS.value).toBeDefined();
      expect(DEFAULT_KPI_COLORS.description).toBeDefined();
      expect(DEFAULT_KPI_COLORS.trendUp).toBeDefined();
      expect(DEFAULT_KPI_COLORS.trendDown).toBeDefined();
    });

    it('should have valid hex colors for icon, value, description', () => {
      expect(DEFAULT_KPI_COLORS.icon).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(DEFAULT_KPI_COLORS.value).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(DEFAULT_KPI_COLORS.description).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('CURRENCY_SYMBOL_BEFORE_LOCALES', () => {
    it('should include common English locales', () => {
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('en-US');
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('en-GB');
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('en-AU');
    });

    it('should include Asian locales', () => {
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('ja-JP');
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('zh-CN');
      expect(CURRENCY_SYMBOL_BEFORE_LOCALES).toContain('ko-KR');
    });
  });

  describe('CURRENCY_CODE_AFTER_CURRENCIES', () => {
    it('should include European currencies', () => {
      expect(CURRENCY_CODE_AFTER_CURRENCIES).toContain('EUR');
      expect(CURRENCY_CODE_AFTER_CURRENCIES).toContain('CHF');
      expect(CURRENCY_CODE_AFTER_CURRENCIES).toContain('SEK');
      expect(CURRENCY_CODE_AFTER_CURRENCIES).toContain('NOK');
    });
  });

  describe('CURRENCY_OPTIONS', () => {
    it('should have common currencies', () => {
      expect(CURRENCY_OPTIONS.find(o => o.value === 'USD')).toBeDefined();
      expect(CURRENCY_OPTIONS.find(o => o.value === 'EUR')).toBeDefined();
      expect(CURRENCY_OPTIONS.find(o => o.value === 'GBP')).toBeDefined();
    });

    it('should have labels with currency symbols or names', () => {
      CURRENCY_OPTIONS.forEach(option => {
        expect(option.label).toBeDefined();
        expect(option.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('HSL_COLOR_DEFAULTS', () => {
    it('should have valid HSL defaults', () => {
      expect(HSL_COLOR_DEFAULTS.saturation).toBe(70);
      expect(HSL_COLOR_DEFAULTS.lightness).toBe(60);
      expect(HSL_COLOR_DEFAULTS.hueStep).toBe(60);
    });
  });

  describe('CHART_DEFAULTS', () => {
    it('should have valid chart defaults', () => {
      expect(CHART_DEFAULTS.maxDataPoints).toBe(100);
      expect(CHART_DEFAULTS.minBucketSize).toBe(1);
      expect(CHART_DEFAULTS.defaultBucketSize).toBe(10);
      expect(CHART_DEFAULTS.animationDuration).toBe(300);
    });
  });

  describe('TABLE_DEFAULTS', () => {
    it('should have valid table defaults', () => {
      expect(TABLE_DEFAULTS.pageSize).toBe(10);
      expect(TABLE_DEFAULTS.defaultSortOrder).toBe('asc');
    });

    it('should have valid page size options', () => {
      expect(TABLE_DEFAULTS.pageSizeOptions).toContain(10);
      expect(TABLE_DEFAULTS.pageSizeOptions).toContain(25);
      expect(TABLE_DEFAULTS.pageSizeOptions).toContain(50);
      expect(TABLE_DEFAULTS.pageSizeOptions).toContain(100);
    });
  });
});
