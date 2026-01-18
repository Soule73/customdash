import { describe, it, expect } from 'vitest';
import { createDefaultDataset, createBaseOptions, createPieOptions } from '../chartConfigUtils';
import type { WidgetParams } from '../../interfaces';

describe('chartConfigUtils', () => {
  describe('createDefaultDataset', () => {
    const baseDataset = {
      label: 'Test Dataset',
      data: [1, 2, 3],
      backgroundColor: '#ff0000',
      borderColor: '#000000',
      borderWidth: 1,
    };

    it('should add bar-specific properties for bar chart', () => {
      const result = createDefaultDataset('bar', baseDataset);
      expect(result.borderSkipped).toBe(false);
      expect(result.borderRadius).toBe(0);
    });

    it('should add line-specific properties for line chart', () => {
      const result = createDefaultDataset('line', baseDataset);
      expect(result.fill).toBe(false);
      expect(result.tension).toBe(0);
      expect(result.pointRadius).toBe(3);
      expect(result.pointHoverRadius).toBe(5);
    });

    it('should add pie-specific properties for pie chart', () => {
      const result = createDefaultDataset('pie', baseDataset);
      expect(result.hoverOffset).toBe(4);
      expect(result.borderAlign).toBe('inner');
      expect(result.cutout).toBe('0%');
    });

    it('should add scatter-specific properties for scatter chart', () => {
      const result = createDefaultDataset('scatter', baseDataset);
      expect(result.showLine).toBe(false);
      expect(result.pointRadius).toBe(5);
    });

    it('should add bubble-specific properties for bubble chart', () => {
      const result = createDefaultDataset('bubble', baseDataset);
      expect(result.pointRadius).toBe(5);
      expect(result.pointHoverRadius).toBe(7);
    });

    it('should add radar-specific properties for radar chart', () => {
      const result = createDefaultDataset('radar', baseDataset);
      expect(result.fill).toBe(true);
      expect(result.pointRadius).toBe(4);
      expect(result.tension).toBe(0.1);
    });

    it('should preserve custom values from baseDataset', () => {
      const customDataset = {
        ...baseDataset,
        tension: 0.5,
        fill: true,
      };
      const result = createDefaultDataset('line', customDataset);
      expect(result.tension).toBe(0.5);
      expect(result.fill).toBe(true);
    });
  });

  describe('createBaseOptions', () => {
    const defaultParams: WidgetParams = {};

    it('should create responsive options', () => {
      const options = createBaseOptions('bar', defaultParams, ['A', 'B']);
      expect(options.responsive).toBe(true);
      expect(options.maintainAspectRatio).toBe(false);
    });

    it('should show legend by default', () => {
      const options = createBaseOptions('bar', defaultParams, []);
      expect(options.plugins?.legend?.display).toBe(true);
    });

    it('should hide legend when legend is false', () => {
      const params: WidgetParams = { legend: false };
      const options = createBaseOptions('bar', params, []);
      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('should set legend position', () => {
      const params: WidgetParams = { legendPosition: 'bottom' };
      const options = createBaseOptions('bar', params, []);
      expect(options.plugins?.legend?.position).toBe('bottom');
    });

    it('should show title when provided', () => {
      const params: WidgetParams = { title: 'My Chart' };
      const options = createBaseOptions('bar', params, []);
      expect(options.plugins?.title?.display).toBe(true);
      expect(options.plugins?.title?.text).toBe('My Chart');
    });

    it('should hide title when not provided', () => {
      const options = createBaseOptions('bar', defaultParams, []);
      expect(options.plugins?.title?.display).toBe(false);
    });

    it('should add scales for bar chart', () => {
      const options = createBaseOptions('bar', defaultParams, []);
      expect(options.scales).toBeDefined();
      expect(options.scales?.x).toBeDefined();
      expect(options.scales?.y).toBeDefined();
    });

    it('should add scales for line chart', () => {
      const options = createBaseOptions('line', defaultParams, []);
      expect(options.scales?.x).toBeDefined();
      expect(options.scales?.y).toBeDefined();
    });

    it('should add linear scales for scatter chart', () => {
      const options = createBaseOptions('scatter', defaultParams, []);
      expect(options.scales?.x?.type).toBe('linear');
    });

    it('should add linear scales for bubble chart', () => {
      const options = createBaseOptions('bubble', defaultParams, []);
      expect(options.scales?.x?.type).toBe('linear');
    });

    it('should set stacked scales when stacked is true', () => {
      const params: WidgetParams = { stacked: true };
      const options = createBaseOptions('bar', params, []);
      const scales = options.scales as Record<string, Record<string, unknown>>;
      expect(scales?.x?.stacked).toBe(true);
      expect(scales?.y?.stacked).toBe(true);
    });

    it('should set horizontal indexAxis when horizontal is true', () => {
      const params: WidgetParams = { horizontal: true };
      const options = createBaseOptions('bar', params, []);
      expect(options.indexAxis).toBe('y');
    });

    it('should show grid by default', () => {
      const options = createBaseOptions('bar', defaultParams, []);
      expect(options.scales?.x?.grid?.display).toBe(true);
      expect(options.scales?.y?.grid?.display).toBe(true);
    });

    it('should hide grid when showGrid is false', () => {
      const params: WidgetParams = { showGrid: false };
      const options = createBaseOptions('bar', params, []);
      expect(options.scales?.x?.grid?.display).toBe(false);
      expect(options.scales?.y?.grid?.display).toBe(false);
    });

    it('should set axis labels', () => {
      const params: WidgetParams = { xLabel: 'X Axis', yLabel: 'Y Axis' };
      const options = createBaseOptions('bar', params, []);
      const scales = options.scales as Record<string, Record<string, Record<string, unknown>>>;
      expect(scales?.x?.title?.display).toBe(true);
      expect(scales?.x?.title?.text).toBe('X Axis');
      expect(scales?.y?.title?.display).toBe(true);
      expect(scales?.y?.title?.text).toBe('Y Axis');
    });

    it('should format ISO timestamps on x axis', () => {
      const labels = ['2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z'];
      const options = createBaseOptions('bar', defaultParams, labels);
      expect(options.scales?.x?.ticks).toBeDefined();
    });
  });

  describe('createPieOptions', () => {
    it('should create responsive pie options', () => {
      const params: WidgetParams = {};
      const options = createPieOptions(params);
      expect(options.responsive).toBe(true);
      expect(options.maintainAspectRatio).toBe(false);
    });

    it('should show legend by default at right position', () => {
      const params: WidgetParams = {};
      const options = createPieOptions(params);
      expect(options.plugins?.legend?.display).toBe(true);
      expect(options.plugins?.legend?.position).toBe('right');
    });

    it('should hide legend when legend is false', () => {
      const params: WidgetParams = { legend: false };
      const options = createPieOptions(params);
      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('should set custom legend position', () => {
      const params: WidgetParams = { legendPosition: 'bottom' };
      const options = createPieOptions(params);
      expect(options.plugins?.legend?.position).toBe('bottom');
    });

    it('should show title when provided', () => {
      const params: WidgetParams = { title: 'Pie Chart' };
      const options = createPieOptions(params);
      expect(options.plugins?.title?.display).toBe(true);
      expect(options.plugins?.title?.text).toBe('Pie Chart');
    });

    it('should have tooltip with percentage', () => {
      const params: WidgetParams = {};
      const options = createPieOptions(params);
      expect(options.plugins?.tooltip?.callbacks?.label).toBeDefined();
    });
  });

  describe('createBaseOptions edge cases', () => {
    it('should format time series x-axis ticks', () => {
      const params: WidgetParams = {};
      const labels = ['2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z'];
      const options = createBaseOptions('bar', params, labels);
      expect(options.scales?.x?.ticks).toBeDefined();
    });

    it('should handle horizontal bar chart', () => {
      const params: WidgetParams = { horizontal: true };
      const options = createBaseOptions('bar', params, ['A', 'B']);
      expect(options.indexAxis).toBe('y');
    });

    it('should configure scatter chart scales', () => {
      const params: WidgetParams = { xLabel: 'X Axis', yLabel: 'Y Axis' };
      const options = createBaseOptions('scatter', params, []);
      expect((options.scales?.x as { type?: string })?.type).toBe('linear');
    });

    it('should configure bubble chart scales', () => {
      const params: WidgetParams = { showGrid: false };
      const options = createBaseOptions('bubble', params, []);
      expect(options.scales?.x).toBeDefined();
      expect(options.scales?.y).toBeDefined();
    });

    it('should format tooltip with custom format', () => {
      const params: WidgetParams = { tooltipFormat: 'Value: {value}' };
      const options = createBaseOptions('bar', params, ['A']);
      const tooltipCallback = options.plugins?.tooltip?.callbacks?.label;
      expect(tooltipCallback).toBeDefined();
    });
  });

  describe('createPieOptions edge cases', () => {
    it('should format pie tooltip with custom label format', () => {
      const params: WidgetParams = { labelFormat: '{label} = {value}' };
      const options = createPieOptions(params);
      const tooltipCallback = options.plugins?.tooltip?.callbacks?.label;
      expect(tooltipCallback).toBeDefined();
    });

    it('should execute pie tooltip callback correctly', () => {
      const params: WidgetParams = {};
      const options = createPieOptions(params);
      const callback = options.plugins?.tooltip?.callbacks?.label;

      const mockContext = {
        label: 'Category A',
        parsed: 25,
        dataset: { data: [25, 25, 50] },
      };

      const result = (callback as (context: typeof mockContext) => string)?.call({}, mockContext);
      expect(result).toContain('Category A');
      expect(result).toContain('25');
    });
  });

  describe('createBaseOptions tooltip callback', () => {
    it('should execute bar/line tooltip callback correctly', () => {
      const params: WidgetParams = { tooltipFormat: '{label}: {value}' };
      const options = createBaseOptions('bar', params, ['A']);
      const callback = options.plugins?.tooltip?.callbacks?.label;

      const mockContext = {
        parsed: { y: 100 },
        dataset: { label: 'Sales' },
      };

      const result = (callback as (context: typeof mockContext) => string)?.call({}, mockContext);
      expect(result).toContain('Sales');
      expect(result).toContain('100');
    });

    it('should handle parsed value when y is undefined', () => {
      const params: WidgetParams = {};
      const options = createBaseOptions('bar', params, ['A']);
      const callback = options.plugins?.tooltip?.callbacks?.label;

      const mockContext = {
        parsed: 50,
        dataset: { label: 'Data' },
      };

      const result = (callback as (context: typeof mockContext) => string)?.call({}, mockContext);
      expect(result).toContain('50');
    });

    it('should execute time series ticks callback correctly', () => {
      const params: WidgetParams = {};
      const labels = ['2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z'];
      const options = createBaseOptions('bar', params, labels);
      const ticksCallback = (options.scales?.x?.ticks as Record<string, unknown>)?.callback;

      const result = (ticksCallback as (value: unknown, index: number) => string)?.call(
        {},
        null,
        0,
      );
      expect(result).toBeDefined();
    });
  });
});
