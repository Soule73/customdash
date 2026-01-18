import { describe, it, expect } from 'vitest';
import {
  createBarChartCustomOptions,
  createLineChartCustomOptions,
  createScatterChartCustomOptions,
  createBubbleChartCustomOptions,
  createRadarChartCustomOptions,
  getCustomChartOptions,
  mergeOptions,
} from '../chartOptionsUtils';
import type { WidgetParams } from '../../interfaces';

describe('chartOptionsUtils', () => {
  describe('createBarChartCustomOptions', () => {
    it('should create options with stacked scales when stacked is true', () => {
      const params: WidgetParams = { stacked: true };
      const options = createBarChartCustomOptions(params);
      expect(options.scales?.x?.stacked).toBe(true);
      expect(options.scales?.y?.stacked).toBe(true);
    });

    it('should create options without stacked when stacked is false', () => {
      const params: WidgetParams = { stacked: false };
      const options = createBarChartCustomOptions(params);
      expect(options.scales?.x?.stacked).toBe(false);
      expect(options.scales?.y?.stacked).toBe(false);
    });

    it('should set horizontal indexAxis when horizontal is true', () => {
      const params: WidgetParams = { horizontal: true };
      const options = createBarChartCustomOptions(params);
      expect(options.indexAxis).toBe('y');
    });

    it('should set vertical indexAxis when horizontal is false', () => {
      const params: WidgetParams = { horizontal: false };
      const options = createBarChartCustomOptions(params);
      expect(options.indexAxis).toBe('x');
    });
  });

  describe('createLineChartCustomOptions', () => {
    it('should create options with stacked scales', () => {
      const params: WidgetParams = { stacked: true };
      const options = createLineChartCustomOptions(params);
      expect(options.scales?.x?.stacked).toBe(true);
      expect(options.scales?.y?.stacked).toBe(true);
    });

    it('should hide points when showPoints is false', () => {
      const params: WidgetParams = { showPoints: false };
      const options = createLineChartCustomOptions(params);
      expect(options.elements?.point?.radius).toBe(0);
    });

    it('should use custom pointRadius when provided', () => {
      const params: WidgetParams = { showPoints: true, pointRadius: 5 };
      const options = createLineChartCustomOptions(params);
      expect(options.elements?.point?.radius).toBe(5);
    });

    it('should use default pointRadius when showPoints is true', () => {
      const params: WidgetParams = { showPoints: true };
      const options = createLineChartCustomOptions(params);
      expect(options.elements?.point?.radius).toBe(3);
    });
  });

  describe('createScatterChartCustomOptions', () => {
    it('should create linear x scale', () => {
      const options = createScatterChartCustomOptions();
      expect(options.scales?.x?.type).toBe('linear');
      expect(options.scales?.x?.position).toBe('bottom');
    });
  });

  describe('createBubbleChartCustomOptions', () => {
    it('should create linear x scale', () => {
      const options = createBubbleChartCustomOptions();
      expect(options.scales?.x?.type).toBe('linear');
      expect(options.scales?.x?.position).toBe('bottom');
    });
  });

  describe('createRadarChartCustomOptions', () => {
    it('should set beginAtZero on r scale', () => {
      const params: WidgetParams = {};
      const options = createRadarChartCustomOptions(params);
      expect(options.scales?.r?.beginAtZero).toBe(true);
    });

    it('should show grid by default', () => {
      const params: WidgetParams = {};
      const options = createRadarChartCustomOptions(params);
      expect(options.scales?.r?.grid?.display).toBe(true);
    });

    it('should hide grid when showGrid is false', () => {
      const params: WidgetParams = { showGrid: false };
      const options = createRadarChartCustomOptions(params);
      expect(options.scales?.r?.grid?.display).toBe(false);
    });

    it('should hide ticks when showTicks is false', () => {
      const params: WidgetParams = { showTicks: false };
      const options = createRadarChartCustomOptions(params);
      expect(options.scales?.r?.ticks?.display).toBe(false);
    });

    it('should use custom pointRadius', () => {
      const params: WidgetParams = { pointRadius: 6 };
      const options = createRadarChartCustomOptions(params);
      expect(options.elements?.point?.radius).toBe(6);
    });

    it('should use custom borderWidth', () => {
      const params: WidgetParams = { borderWidth: 3 };
      const options = createRadarChartCustomOptions(params);
      expect(options.elements?.line?.borderWidth).toBe(3);
    });
  });

  describe('getCustomChartOptions', () => {
    it('should return bar chart options for bar type', () => {
      const options = getCustomChartOptions('bar', { stacked: true });
      expect(options).toHaveProperty('scales');
      expect(options).toHaveProperty('indexAxis');
    });

    it('should return line chart options for line type', () => {
      const options = getCustomChartOptions('line', { showPoints: false });
      expect(options).toHaveProperty('elements');
    });

    it('should return scatter chart options for scatter type', () => {
      const options = getCustomChartOptions('scatter', {});
      expect(options).toHaveProperty('scales');
    });

    it('should return bubble chart options for bubble type', () => {
      const options = getCustomChartOptions('bubble', {});
      expect(options).toHaveProperty('scales');
    });

    it('should return radar chart options for radar type', () => {
      const options = getCustomChartOptions('radar', {});
      expect(options).toHaveProperty('scales');
    });

    it('should return empty object for pie type', () => {
      const options = getCustomChartOptions('pie', {});
      expect(options).toEqual({});
    });
  });

  describe('mergeOptions', () => {
    it('should merge simple objects', () => {
      const base = { a: 1, b: 2 };
      const custom = { b: 3, c: 4 };
      const result = mergeOptions(base, custom as Partial<typeof base>);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should deep merge nested objects', () => {
      const base = { scales: { x: { display: true, title: 'X' } } };
      const custom = { scales: { x: { stacked: true } } };
      const result = mergeOptions(base, custom as unknown as Partial<typeof base>);
      expect(result.scales.x as Record<string, unknown>).toEqual({
        display: true,
        title: 'X',
        stacked: true,
      });
    });

    it('should not merge arrays (replace them)', () => {
      const base = { data: [1, 2, 3] };
      const custom = { data: [4, 5] };
      const result = mergeOptions(base, custom);
      expect(result.data).toEqual([4, 5]);
    });

    it('should handle undefined custom values', () => {
      const base = { a: 1, b: 2 };
      const custom = { a: undefined, c: 3 };
      const result = mergeOptions(base, custom as Partial<typeof base>);
      expect(result.a).toBe(1);
      expect((result as Record<string, unknown>).c).toBe(3);
    });

    it('should handle null values in custom', () => {
      const base = { a: { nested: 1 } };
      const custom = { a: null };
      const result = mergeOptions(base, custom as Record<string, unknown>);
      expect(result.a).toBeNull();
    });
  });

  describe('getCustomChartOptions edge cases', () => {
    it('should handle base options being null in nested merge', () => {
      const base = { scales: { x: null } } as Record<string, unknown>;
      const custom = { scales: { x: { display: true } } };
      const result = mergeOptions(base, custom);
      expect((result.scales as Record<string, unknown>).x).toEqual({ display: true });
    });
  });
});
