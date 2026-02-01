import { describe, it, expect } from 'vitest';
import {
  formatValue,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  getCurrencyDisplayByLocale,
} from '../valueFormatter';

describe('valueFormatter', () => {
  describe('getCurrencyDisplayByLocale', () => {
    it('should return symbol for US locale with USD', () => {
      expect(getCurrencyDisplayByLocale('en-US', 'USD')).toBe('symbol');
    });

    it('should return symbol for UK locale with GBP', () => {
      expect(getCurrencyDisplayByLocale('en-GB', 'GBP')).toBe('symbol');
    });

    it('should return symbol for EUR currency', () => {
      expect(getCurrencyDisplayByLocale('fr-FR', 'EUR')).toBe('symbol');
    });

    it('should return symbol for CHF currency', () => {
      expect(getCurrencyDisplayByLocale('de-CH', 'CHF')).toBe('symbol');
    });

    it('should return symbol for Japanese locale with JPY', () => {
      expect(getCurrencyDisplayByLocale('ja-JP', 'JPY')).toBe('symbol');
    });

    it('should return symbol for EUR even with en-US locale', () => {
      expect(getCurrencyDisplayByLocale('en-US', 'EUR')).toBe('symbol');
    });

    it('should use defaults when no arguments provided', () => {
      expect(getCurrencyDisplayByLocale()).toBe('symbol');
    });

    it('should return symbol for unknown locale with non-code currency', () => {
      expect(getCurrencyDisplayByLocale('unknown', 'GBP')).toBe('symbol');
    });
  });

  describe('formatNumber', () => {
    it('should format number with default locale', () => {
      const result = formatNumber(1234.567);
      expect(result).toContain('1');
      expect(result).toContain('234');
    });

    it('should format number with specified decimals', () => {
      const result = formatNumber(1234.567, 'en-US', 2);
      expect(result).toBe('1,234.57');
    });

    it('should format number with French locale', () => {
      const result = formatNumber(1234.567, 'fr-FR', 2);
      expect(result).toMatch(/1[\s\u202F]?234,57/);
    });

    it('should handle zero decimals', () => {
      const result = formatNumber(1234.567, 'en-US', 0);
      expect(result).toBe('1,235');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(-1234.56, 'en-US', 2);
      expect(result).toBe('-1,234.56');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      const result = formatCurrency(1234.56, 'en-US', 'USD', 2);
      expect(result).toContain('1,234.56');
      expect(result).toContain('$');
    });

    it('should format EUR currency with French locale', () => {
      const result = formatCurrency(1234.56, 'fr-FR', 'EUR', 2);
      expect(result).toMatch(/1[\s\u202F]?234,56/);
      expect(result).toContain('€');
    });

    it('should use default values', () => {
      const result = formatCurrency(100);
      expect(result).toContain('$');
      expect(result).toContain('100');
    });

    it('should handle zero value', () => {
      const result = formatCurrency(0, 'en-US', 'USD', 2);
      expect(result).toContain('0');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-500, 'en-US', 'USD', 2);
      expect(result).toContain('500');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      const result = formatPercent(0.1234);
      expect(result).toBe('12.3%');
    });

    it('should format percentage with specified decimals', () => {
      const result = formatPercent(0.1234, 2);
      expect(result).toBe('12.34%');
    });

    it('should format 100%', () => {
      const result = formatPercent(1, 0);
      expect(result).toBe('100%');
    });

    it('should handle zero', () => {
      const result = formatPercent(0, 0);
      expect(result).toBe('0%');
    });

    it('should handle values over 100%', () => {
      const result = formatPercent(1.5, 0);
      expect(result).toBe('150%');
    });

    it('should handle negative percentages', () => {
      const result = formatPercent(-0.25, 0);
      expect(result).toBe('-25%');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
      expect(result).toMatch(/janv|Jan/i);
    });

    it('should format date with time', () => {
      const result = formatDate('2024-01-15T14:30:00');
      expect(result).toContain('2024');
    });

    it('should return original string for invalid date', () => {
      const result = formatDate('not-a-date');
      expect(result).toBe('not-a-date');
    });

    it('should format with custom locale', () => {
      const result = formatDate('2024-01-15', 'en-US');
      expect(result).toContain('2024');
    });

    it('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });
  });

  describe('formatValue', () => {
    describe('number formatting', () => {
      it('should format number type', () => {
        const result = formatValue(1234.56, 'number', { decimals: 2, locale: 'en-US' });
        expect(result).toBe('1,234.56');
      });

      it('should return string representation for non-number values', () => {
        const result = formatValue('text', 'number');
        expect(result).toBe('text');
      });
    });

    describe('currency formatting', () => {
      it('should format currency type', () => {
        const result = formatValue(1234.56, 'currency', {
          currency: 'USD',
          locale: 'en-US',
          decimals: 2,
        });
        expect(result).toContain('$');
        expect(result).toContain('1,234.56');
      });

      it('should use default currency', () => {
        const result = formatValue(100, 'currency', { locale: 'en-US' });
        expect(result).toContain('$');
      });

      it('should return string for non-number', () => {
        const result = formatValue('text', 'currency');
        expect(result).toBe('text');
      });
    });

    describe('percent formatting', () => {
      it('should format percent type', () => {
        const result = formatValue(0.1234, 'percent', { decimals: 1 });
        expect(result).toBe('12.3%');
      });

      it('should return string for non-number', () => {
        const result = formatValue('text', 'percent');
        expect(result).toBe('text');
      });
    });

    describe('date formatting', () => {
      it('should format date type', () => {
        const result = formatValue('2024-01-15', 'date');
        expect(result).toContain('2024');
      });

      it('should return string for non-string dates', () => {
        const result = formatValue(12345, 'date');
        expect(result).toBe('12345');
      });
    });

    describe('text formatting', () => {
      it('should convert any value to string', () => {
        expect(formatValue('hello', 'text')).toBe('hello');
        expect(formatValue(123, 'text')).toBe('123');
        expect(formatValue(true, 'text')).toBe('true');
      });
    });

    describe('null/undefined handling', () => {
      it('should return default null value for null', () => {
        const result = formatValue(null, 'number');
        expect(result).toBe('-');
      });

      it('should return default null value for undefined', () => {
        const result = formatValue(undefined, 'number');
        expect(result).toBe('-');
      });

      it('should use custom null value', () => {
        const result = formatValue(null, 'number', { nullValue: 'N/A' });
        expect(result).toBe('N/A');
      });
    });

    describe('default format type', () => {
      it('should default to text format', () => {
        const result = formatValue('test');
        expect(result).toBe('test');
      });

      it('should handle unknown format as text', () => {
        const result = formatValue(123);
        expect(result).toBe('123');
      });
    });

    describe('options defaults', () => {
      it('should use default locale', () => {
        const result = formatValue(1000, 'number');
        expect(result).toContain('1');
      });

      it('should use default currency', () => {
        const result = formatValue(100, 'currency');
        expect(result).toContain('$');
      });
    });
  });
});
