/**
 * Color Contrast Utils Tests
 * @module core/utils/colorContrast.test
 */
import { describe, it, expect } from 'vitest';
import {
  getLuminance,
  isDarkColor,
  isLightColor,
  getContrastRatio,
  hasGoodContrast,
  hasGoodContrastLargeText,
  getContrastTextColor,
  getContrastMutedColor,
  getContrastGridColor,
  getContrastBorderColor,
  generateAccessibleColors,
  extractDominantColorFromGradient,
  getEffectiveBackgroundColor,
} from './colorContrast';

describe('colorContrast', () => {
  describe('getLuminance', () => {
    it('should return 0 for black', () => {
      expect(getLuminance('#000000')).toBe(0);
    });

    it('should return 1 for white', () => {
      expect(getLuminance('#ffffff')).toBe(1);
    });

    it('should return ~0.5 for default when color is invalid', () => {
      expect(getLuminance('')).toBe(0.5);
      expect(getLuminance('invalid')).toBe(0.5);
    });

    it('should handle 3-character hex colors', () => {
      expect(getLuminance('#fff')).toBe(1);
      expect(getLuminance('#000')).toBe(0);
    });

    it('should handle rgb() format', () => {
      expect(getLuminance('rgb(255, 255, 255)')).toBe(1);
      expect(getLuminance('rgb(0, 0, 0)')).toBe(0);
    });

    it('should handle rgba() format', () => {
      expect(getLuminance('rgba(255, 255, 255, 1)')).toBe(1);
      expect(getLuminance('rgba(0, 0, 0, 0.5)')).toBe(0);
    });
  });

  describe('isDarkColor', () => {
    it('should return true for dark colors', () => {
      expect(isDarkColor('#000000')).toBe(true);
      expect(isDarkColor('#1a1a1a')).toBe(true);
      expect(isDarkColor('#333333')).toBe(true);
    });

    it('should return false for light colors', () => {
      expect(isDarkColor('#ffffff')).toBe(false);
      expect(isDarkColor('#f0f0f0')).toBe(false);
    });
  });

  describe('isLightColor', () => {
    it('should return true for light colors', () => {
      expect(isLightColor('#ffffff')).toBe(true);
      expect(isLightColor('#f0f0f0')).toBe(true);
    });

    it('should return false for dark colors', () => {
      expect(isLightColor('#000000')).toBe(false);
      expect(isLightColor('#1a1a1a')).toBe(false);
    });
  });

  describe('getContrastRatio', () => {
    it('should return 21 for black on white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 1 for same colors', () => {
      expect(getContrastRatio('#ffffff', '#ffffff')).toBe(1);
      expect(getContrastRatio('#000000', '#000000')).toBe(1);
    });

    it('should return same value regardless of order', () => {
      const ratio1 = getContrastRatio('#000000', '#ffffff');
      const ratio2 = getContrastRatio('#ffffff', '#000000');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('hasGoodContrast', () => {
    it('should return true for black on white (high contrast)', () => {
      expect(hasGoodContrast('#000000', '#ffffff')).toBe(true);
    });

    it('should return false for similar colors (low contrast)', () => {
      expect(hasGoodContrast('#777777', '#888888')).toBe(false);
    });
  });

  describe('hasGoodContrastLargeText', () => {
    it('should return true for black on white', () => {
      expect(hasGoodContrastLargeText('#000000', '#ffffff')).toBe(true);
    });

    it('should be more lenient than hasGoodContrast', () => {
      // Some color pairs pass large text but fail normal text
      const textColor = '#767676';
      const bgColor = '#ffffff';
      expect(hasGoodContrastLargeText(textColor, bgColor)).toBe(true);
    });
  });

  describe('getContrastTextColor', () => {
    it('should return white for dark backgrounds', () => {
      expect(getContrastTextColor('#000000')).toBe('#ffffff');
      expect(getContrastTextColor('#1a1a1a')).toBe('#ffffff');
    });

    it('should return dark color for light backgrounds', () => {
      expect(getContrastTextColor('#ffffff')).toBe('#111827');
      expect(getContrastTextColor('#f0f0f0')).toBe('#111827');
    });
  });

  describe('getContrastMutedColor', () => {
    it('should return light muted for dark backgrounds', () => {
      expect(getContrastMutedColor('#000000')).toBe('rgba(255, 255, 255, 0.7)');
    });

    it('should return dark muted for light backgrounds', () => {
      expect(getContrastMutedColor('#ffffff')).toBe('rgba(0, 0, 0, 0.6)');
    });
  });

  describe('getContrastGridColor', () => {
    it('should return light grid for dark backgrounds', () => {
      expect(getContrastGridColor('#000000')).toBe('rgba(255, 255, 255, 0.1)');
    });

    it('should return dark grid for light backgrounds', () => {
      expect(getContrastGridColor('#ffffff')).toBe('rgba(0, 0, 0, 0.1)');
    });
  });

  describe('getContrastBorderColor', () => {
    it('should return light border for dark backgrounds', () => {
      expect(getContrastBorderColor('#000000')).toBe('rgba(255, 255, 255, 0.2)');
    });

    it('should return dark border for light backgrounds', () => {
      expect(getContrastBorderColor('#ffffff')).toBe('rgba(0, 0, 0, 0.15)');
    });
  });

  describe('generateAccessibleColors', () => {
    it('should generate dark theme colors for dark background', () => {
      const colors = generateAccessibleColors('#1a1a1a');
      expect(colors.textColor).toBe('#f9fafb');
      expect(colors.mutedTextColor).toBe('rgba(255, 255, 255, 0.7)');
      expect(colors.gridColor).toBe('rgba(255, 255, 255, 0.1)');
      expect(colors.borderColor).toBe('rgba(255, 255, 255, 0.2)');
      expect(colors.tooltipBackground).toBe('rgba(255, 255, 255, 0.95)');
      expect(colors.tooltipTextColor).toBe('#111827');
    });

    it('should generate light theme colors for light background', () => {
      const colors = generateAccessibleColors('#ffffff');
      expect(colors.textColor).toBe('#111827');
      expect(colors.mutedTextColor).toBe('rgba(0, 0, 0, 0.6)');
      expect(colors.gridColor).toBe('rgba(0, 0, 0, 0.1)');
      expect(colors.borderColor).toBe('rgba(0, 0, 0, 0.15)');
      expect(colors.tooltipBackground).toBe('rgba(0, 0, 0, 0.8)');
      expect(colors.tooltipTextColor).toBe('#f9fafb');
    });
  });

  describe('extractDominantColorFromGradient', () => {
    it('should extract first hex color from gradient', () => {
      const gradient = 'linear-gradient(to right, #ff0000, #00ff00)';
      expect(extractDominantColorFromGradient(gradient)).toBe('#ff0000');
    });

    it('should extract rgba color from gradient', () => {
      const gradient = 'linear-gradient(to right, rgba(255, 0, 0, 1), blue)';
      expect(extractDominantColorFromGradient(gradient)).toBe('rgba(255, 0, 0, 1)');
    });

    it('should return null for empty gradient', () => {
      expect(extractDominantColorFromGradient('')).toBe(null);
    });

    it('should return null for invalid gradient', () => {
      expect(extractDominantColorFromGradient('not a gradient')).toBe(null);
    });
  });

  describe('getEffectiveBackgroundColor', () => {
    it('should return gradient color when gradient is provided', () => {
      const result = getEffectiveBackgroundColor('#ffffff', 'linear-gradient(#ff0000, #00ff00)');
      expect(result).toBe('#ff0000');
    });

    it('should return background color when no gradient', () => {
      expect(getEffectiveBackgroundColor('#ff0000')).toBe('#ff0000');
    });

    it('should return white as default', () => {
      expect(getEffectiveBackgroundColor()).toBe('#ffffff');
    });

    it('should fallback to background if gradient is invalid', () => {
      expect(getEffectiveBackgroundColor('#ff0000', 'invalid')).toBe('#ff0000');
    });
  });
});
