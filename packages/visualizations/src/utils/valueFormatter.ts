import type { FormatType } from '../types';
import type { FormatOptions } from '../interfaces';
import {
  CURRENCY_SYMBOL_BEFORE_LOCALES,
  CURRENCY_CODE_AFTER_CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_NULL_VALUE,
} from '../constants';

/**
 * Determines the currency display style based on locale and currency code.
 * Returns 'symbol' for locales that typically place the symbol before the amount,
 * and 'code' for currencies that are typically displayed with the code after the amount.
 * @param locale - The locale string (e.g., 'en-US', 'fr-FR')
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @returns The currency display style: 'symbol', 'code', or 'narrowSymbol'
 *
 * @example
 * getCurrencyDisplayByLocale('en-US', 'USD'); // 'symbol' -> $1,234.56
 * getCurrencyDisplayByLocale('fr-FR', 'EUR'); // 'symbol' -> 1 234,56 EUR
 * getCurrencyDisplayByLocale('de-DE', 'EUR'); // 'symbol' -> 1.234,56 EUR
 */
export function getCurrencyDisplayByLocale(
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY,
): 'symbol' | 'code' | 'narrowSymbol' {
  if (
    CURRENCY_SYMBOL_BEFORE_LOCALES.includes(locale) &&
    !CURRENCY_CODE_AFTER_CURRENCIES.includes(currency)
  ) {
    return 'symbol';
  }

  if (CURRENCY_CODE_AFTER_CURRENCIES.includes(currency)) {
    return 'code';
  }

  return 'symbol';
}

/**
 * Formats a date string for display in the specified locale
 * @param dateStr - The date string to format
 * @param locale - The locale for formatting (default is 'en-US')
 * @returns The formatted date string
 *
 * @example
 * formatDate('2024-01-15'); // 'Jan 15, 2024'
 * formatDate('2024-01-15T14:30:00'); // 'Jan 15, 2024'
 * formatDate('invalid date'); // 'invalid date'
 */
export function formatDate(dateStr: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats a numeric value as a number with locale-specific formatting
 * @param value - The numeric value to format
 * @param locale - The locale for formatting
 * @param decimals - The number of decimal places (min and max)
 * @returns The formatted number string
 *
 * @example
 * formatNumber(1234.567, 'en-US', 2); // '1,234.57'
 * formatNumber(1234.567, 'fr-FR', 2); // '1 234,57'
 */
export function formatNumber(
  value: number,
  locale: string = DEFAULT_LOCALE,
  decimals?: number,
): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  });
}

/**
 * Formats a numeric value as currency with locale-specific formatting
 * @param value - The numeric value to format
 * @param locale - The locale for formatting
 * @param currency - The currency code
 * @param decimals - The number of decimal places
 * @returns The formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'en-US', 'USD', 2); // '$1,234.56'
 * formatCurrency(1234.56, 'fr-FR', 'EUR', 2); // '1 234,56 EUR'
 */
export function formatCurrency(
  value: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY,
  decimals: number = 2,
): string {
  const currencyDisplay = getCurrencyDisplayByLocale(locale, currency);

  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a numeric value as a percentage
 * @param value - The numeric value to format (0.1 = 10%)
 * @param decimals - The number of decimal places
 * @returns The formatted percentage string
 *
 * @example
 * formatPercent(0.1234, 1); // '12.3%'
 * formatPercent(0.5, 0); // '50%'
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Unified value formatter that handles all format types
 * @param value - The value to format (can be any type)
 * @param formatType - The type of formatting to apply
 * @param options - Additional formatting options
 * @returns The formatted value as a string
 *
 * @example
 * formatValue(1234.56, 'number', { decimals: 2, locale: 'en-US' }); // '1,234.56'
 * formatValue(1234.56, 'currency', { currency: 'EUR', locale: 'en-US' }); // '$1,234.56'
 * formatValue(0.1234, 'percent', { decimals: 1 }); // '12.3%'
 * formatValue('2024-01-15', 'date'); // 'Jan 15, 2024'
 * formatValue(null, 'number'); // '-'
 */
export function formatValue(
  value: unknown,
  formatType: FormatType = 'text',
  options: FormatOptions = {},
): string {
  const {
    decimals,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    nullValue = DEFAULT_NULL_VALUE,
  } = options;

  if (value === null || value === undefined) {
    return nullValue;
  }

  switch (formatType) {
    case 'number':
      return typeof value === 'number' ? formatNumber(value, locale, decimals) : String(value);

    case 'currency':
      return typeof value === 'number'
        ? formatCurrency(value, locale, currency, decimals ?? 2)
        : String(value);

    case 'percent':
      return typeof value === 'number' ? formatPercent(value, decimals ?? 1) : String(value);

    case 'date':
      return typeof value === 'string' ? formatDate(value, locale) : String(value);

    case 'text':
    default:
      return String(value);
  }
}
