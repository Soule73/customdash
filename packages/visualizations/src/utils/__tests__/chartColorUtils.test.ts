import { describe, it, expect } from 'vitest';
import {
  generateHSLColor,
  getDatasetColor,
  generateColorsForLabels,
  generateBorderColors,
  addTransparency,
  getDefaultBackgroundColor,
  getDefaultBorderColor,
} from '../chartColorUtils';

describe('chartColorUtils', () => {
  describe('generateHSLColor', () => {
    it('should generate HSL color based on index', () => {
      const color = generateHSLColor(0);
      expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
    });

    it('should generate different colors for different indices', () => {
      const color1 = generateHSLColor(0);
      const color2 = generateHSLColor(1);
      expect(color1).not.toBe(color2);
    });

    it('should use custom saturation and lightness', () => {
      const color = generateHSLColor(0, 50, 40);
      expect(color).toBe('hsl(0, 50%, 40%)');
    });

    it('should include alpha when provided', () => {
      const color = generateHSLColor(0, 70, 60, 0.5);
      expect(color).toBe('hsl(0, 70%, 60%, 0.5)');
    });

    it('should cycle hue every 360 degrees', () => {
      const color1 = generateHSLColor(0);
      const color2 = generateHSLColor(6);
      expect(color1).toBe(color2);
    });
  });

  describe('getDatasetColor', () => {
    it('should return style color when provided', () => {
      const style = { color: '#ff0000' };
      const result = getDatasetColor('bar', 0, style);
      expect(result).toBe('#ff0000');
    });

    it('should return color from palette for pie chart', () => {
      const result = getDatasetColor('pie', 0, undefined, ['#aabbcc', '#ddeeff']);
      expect(result).toBe('#aabbcc');
    });

    it('should generate HSL color for non-pie charts without style', () => {
      const result = getDatasetColor('bar', 0);
      expect(result).toMatch(/^hsl\(/);
    });

    it('should cycle through colors array for pie charts', () => {
      const colors = ['#111111', '#222222'];
      expect(getDatasetColor('pie', 0, undefined, colors)).toBe('#111111');
      expect(getDatasetColor('pie', 1, undefined, colors)).toBe('#222222');
      expect(getDatasetColor('pie', 2, undefined, colors)).toBe('#111111');
    });
  });

  describe('generateColorsForLabels', () => {
    it('should generate colors for each label', () => {
      const labels = ['A', 'B', 'C'];
      const colors = generateColorsForLabels(labels);
      expect(colors).toHaveLength(3);
    });

    it('should use custom colors when provided', () => {
      const labels = ['A', 'B'];
      const customColors = ['#ff0000', '#00ff00'];
      const colors = generateColorsForLabels(labels, customColors);
      expect(colors).toEqual(['#ff0000', '#00ff00']);
    });

    it('should cycle through custom colors if not enough', () => {
      const labels = ['A', 'B', 'C'];
      const customColors = ['#ff0000', '#00ff00'];
      const colors = generateColorsForLabels(labels, customColors);
      expect(colors).toEqual(['#ff0000', '#00ff00', '#ff0000']);
    });
  });

  describe('generateBorderColors', () => {
    it('should return border color for all when provided', () => {
      const bgColors = ['#ff0000', '#00ff00'];
      const result = generateBorderColors(bgColors, '#000000');
      expect(result).toEqual(['#000000', '#000000']);
    });

    it('should darken HSL colors when no border color provided', () => {
      const bgColors = ['hsl(0, 70%, 60%)'];
      const result = generateBorderColors(bgColors);
      expect(result[0]).toMatch(/hsl\(0, 70%, \d+%\)/);
    });

    it('should return original color for non-HSL colors', () => {
      const bgColors = ['#ff0000'];
      const result = generateBorderColors(bgColors);
      expect(result[0]).toBe('#ff0000');
    });
  });

  describe('addTransparency', () => {
    it('should convert hex color to rgba', () => {
      const result = addTransparency('#ff0000', 0.5);
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should convert hsl to hsla', () => {
      const result = addTransparency('hsl(0, 70%, 60%)', 0.5);
      expect(result).toBe('hsla(0, 70%, 60%, 0.5)');
    });

    it('should convert rgb to rgba', () => {
      const result = addTransparency('rgb(255, 0, 0)', 0.5);
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should return original color for unknown format', () => {
      const result = addTransparency('red', 0.5);
      expect(result).toBe('red');
    });
  });

  describe('getDefaultBackgroundColor', () => {
    it('should return transparent color for line chart', () => {
      const result = getDefaultBackgroundColor('line', 0);
      expect(result).toMatch(/hsla?\(/);
    });

    it('should return transparent color for radar chart', () => {
      const result = getDefaultBackgroundColor('radar', 0);
      expect(result).toMatch(/hsla?\(/);
    });

    it('should return solid color for bar chart', () => {
      const result = getDefaultBackgroundColor('bar', 0);
      expect(result).toMatch(/^hsl\(/);
    });
  });

  describe('getDefaultBorderColor', () => {
    it('should return white for pie chart', () => {
      const result = getDefaultBorderColor('pie', 0);
      expect(result).toBe('#ffffff');
    });

    it('should return HSL color with darker lightness for other charts', () => {
      const result = getDefaultBorderColor('bar', 0);
      expect(result).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('getDatasetColor edge cases', () => {
    it('should use pie palette when chartType is pie', () => {
      const result = getDatasetColor('pie', 0);
      expect(result).toBeDefined();
    });

    it('should use custom colors from palette when available', () => {
      const customColors = ['#custom1', '#custom2'];
      const result = getDatasetColor('pie', 0, {}, customColors);
      expect(result).toBe('#custom1');
    });

    it('should cycle palette when index out of bounds', () => {
      const customColors = ['#color1', '#color2'];
      const result = getDatasetColor('pie', 10, {}, customColors);
      expect(result).toBe('#color1');
    });
  });

  describe('generateColorsForLabels edge cases', () => {
    it('should fallback to HSL color when index exceeds palette', () => {
      const labels = Array(25).fill('label');
      const colors = generateColorsForLabels(labels);
      expect(colors).toHaveLength(25);
    });
  });
});
