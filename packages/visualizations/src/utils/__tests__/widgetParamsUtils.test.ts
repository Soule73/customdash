import { describe, it, expect } from 'vitest';
import { mergeWidgetParams, validateWidgetParams } from '../widgetParamsUtils';
import { DEFAULT_WIDGET_PARAMS } from '..';

describe('widgetParamsUtils', () => {
  describe('DEFAULT_WIDGET_PARAMS', () => {
    it('should have all default values defined', () => {
      expect(DEFAULT_WIDGET_PARAMS.title).toBe('');
      expect(DEFAULT_WIDGET_PARAMS.legendPosition).toBe('top');
      expect(DEFAULT_WIDGET_PARAMS.legend).toBe(true);
      expect(DEFAULT_WIDGET_PARAMS.showGrid).toBe(true);
      expect(DEFAULT_WIDGET_PARAMS.stacked).toBe(false);
      expect(DEFAULT_WIDGET_PARAMS.horizontal).toBe(false);
      expect(DEFAULT_WIDGET_PARAMS.showPoints).toBe(true);
      expect(DEFAULT_WIDGET_PARAMS.tension).toBe(0);
      expect(DEFAULT_WIDGET_PARAMS.borderWidth).toBe(1);
      expect(DEFAULT_WIDGET_PARAMS.borderRadius).toBe(0);
      expect(DEFAULT_WIDGET_PARAMS.pointRadius).toBe(3);
    });
  });

  describe('mergeWidgetParams', () => {
    it('should return default params when no user params', () => {
      const result = mergeWidgetParams();
      expect(result).toEqual(DEFAULT_WIDGET_PARAMS);
    });

    it('should return default params when undefined', () => {
      const result = mergeWidgetParams(undefined);
      expect(result).toEqual(DEFAULT_WIDGET_PARAMS);
    });

    it('should merge user params with defaults', () => {
      const userParams = { title: 'My Chart', stacked: true };
      const result = mergeWidgetParams(userParams);
      expect(result.title).toBe('My Chart');
      expect(result.stacked).toBe(true);
      expect(result.legendPosition).toBe('top');
    });

    it('should override default values', () => {
      const userParams = { legendPosition: 'bottom' as const, showGrid: false };
      const result = mergeWidgetParams(userParams);
      expect(result.legendPosition).toBe('bottom');
      expect(result.showGrid).toBe(false);
    });
  });

  describe('validateWidgetParams', () => {
    it('should return valid params with defaults', () => {
      const result = validateWidgetParams({});
      expect(result.legendPosition).toBe('top');
      expect(result.titleAlign).toBe('center');
    });

    it('should validate legendPosition', () => {
      const result = validateWidgetParams({ legendPosition: 'invalid' as unknown as 'top' });
      expect(result.legendPosition).toBe('top');
    });

    it('should accept valid legendPosition values', () => {
      expect(validateWidgetParams({ legendPosition: 'top' }).legendPosition).toBe('top');
      expect(validateWidgetParams({ legendPosition: 'bottom' }).legendPosition).toBe('bottom');
      expect(validateWidgetParams({ legendPosition: 'left' }).legendPosition).toBe('left');
      expect(validateWidgetParams({ legendPosition: 'right' }).legendPosition).toBe('right');
    });

    it('should validate titleAlign', () => {
      const result = validateWidgetParams({ titleAlign: 'invalid' as unknown as 'center' });
      expect(result.titleAlign).toBe('center');
    });

    it('should accept valid titleAlign values', () => {
      expect(validateWidgetParams({ titleAlign: 'start' }).titleAlign).toBe('start');
      expect(validateWidgetParams({ titleAlign: 'center' }).titleAlign).toBe('center');
      expect(validateWidgetParams({ titleAlign: 'end' }).titleAlign).toBe('end');
    });

    it('should clamp labelFontSize between 8 and 72', () => {
      expect(validateWidgetParams({ labelFontSize: 4 }).labelFontSize).toBe(8);
      expect(validateWidgetParams({ labelFontSize: 100 }).labelFontSize).toBe(72);
      expect(validateWidgetParams({ labelFontSize: 16 }).labelFontSize).toBe(16);
    });

    it('should clamp tension between 0 and 1', () => {
      expect(validateWidgetParams({ tension: -0.5 }).tension).toBe(0);
      expect(validateWidgetParams({ tension: 1.5 }).tension).toBe(1);
      expect(validateWidgetParams({ tension: 0.5 }).tension).toBe(0.5);
    });

    it('should ensure borderWidth is not negative', () => {
      expect(validateWidgetParams({ borderWidth: -5 }).borderWidth).toBe(0);
      expect(validateWidgetParams({ borderWidth: 3 }).borderWidth).toBe(3);
    });
  });

  describe('validateWidgetParams edge cases', () => {
    it('should use default labelFontSize when not provided', () => {
      const result = validateWidgetParams({});
      expect(result.labelFontSize).toBe(12);
    });

    it('should use default tension when not provided', () => {
      const result = validateWidgetParams({});
      expect(result.tension).toBe(0);
    });

    it('should treat labelFontSize 0 as falsy and use default', () => {
      const result = validateWidgetParams({ labelFontSize: 0 });
      expect(result.labelFontSize).toBe(12);
    });

    it('should correctly handle tension 0 as valid value', () => {
      const result = validateWidgetParams({ tension: 0 });
      expect(result.tension).toBe(0);
    });

    it('should correctly handle explicit undefined values', () => {
      const result = validateWidgetParams({
        labelFontSize: undefined,
        tension: undefined,
      });
      expect(result.labelFontSize).toBe(12);
      expect(result.tension).toBe(0);
    });
  });
});
