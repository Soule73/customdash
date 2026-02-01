import { formatConfigProvider } from '@customdash/utils';
import type { FormatType } from '../types';
import type { FormatOptions } from '../interfaces';

/**
 * Gets the current locale from the config provider
 */
function getLocale(): string {
  return formatConfigProvider.locale;
}

/**
 * Gets the current currency from the config provider
 */
function getCurrency(): string {
  return formatConfigProvider.currency;
}

/**
 * Gets the current decimals from the config provider
 */
function getDecimals(): number {
  return formatConfigProvider.decimals;
}

/**
 * Gets the null value representation from the config provider
 */
function getNullValue(): string {
  return formatConfigProvider.nullValue;
}

/**
 * Determines the currency display style based on locale and currency code.
 * Always returns 'symbol' to display currency symbols (€, $, £) instead of codes (EUR, USD, GBP).
 * @param locale - The locale string (e.g., 'en-US', 'fr-FR')
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @returns The currency display style: always 'symbol'
 *
 * @example
 * getCurrencyDisplayByLocale('en-US', 'USD'); // 'symbol' -> $1,234.56
 * getCurrencyDisplayByLocale('fr-FR', 'EUR'); // 'symbol' -> 1 234,56 €
 * getCurrencyDisplayByLocale('de-DE', 'EUR'); // 'symbol' -> 1.234,56 €
 * getCurrencyDisplayByLocale('en-GB', 'GBP'); // 'symbol' -> £1,234.56
 * getCurrencyDisplayByLocale('ja-JP', 'JPY'); // 'symbol' -> ¥1,235
 */
export function getCurrencyDisplayByLocale(
  _locale?: string,
  _currency?: string,
): 'symbol' | 'code' | 'narrowSymbol' {
  return 'symbol';
}

/**
 * Formats a date string for display in the specified locale
 * @param dateStr - The date string to format
 * @param locale - The locale for formatting (uses config provider default if not specified)
 * @returns The formatted date string
 *
 * @example
 * formatDate('2024-01-15'); // '15 janv. 2024' (with fr-FR locale)
 * formatDate('2024-01-15T14:30:00'); // '15 janv. 2024'
 * formatDate('invalid date'); // 'invalid date'
 */
export function formatDate(dateStr: string, locale?: string): string {
  const loc = locale ?? getLocale();
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString(loc, {
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
 * @param locale - The locale for formatting (uses config provider default if not specified)
 * @param decimals - The number of decimal places (min and max)
 * @returns The formatted number string
 *
 * @example
 * formatNumber(1234.567, 'en-US', 2); // '1,234.57'
 * formatNumber(1234.567, 'fr-FR', 2); // '1 234,57'
 */
export function formatNumber(value: number, locale?: string, decimals?: number): string {
  const loc = locale ?? getLocale();
  const dec = decimals ?? getDecimals();
  return value.toLocaleString(loc, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

/**
 * Formats a numeric value as currency with locale-specific formatting
 * @param value - The numeric value to format
 * @param locale - The locale for formatting (uses config provider default if not specified)
 * @param currency - The currency code (uses config provider default if not specified)
 * @param decimals - The number of decimal places (uses config provider default if not specified)
 * @returns The formatted currency string
 *
 * @example
 * formatCurrency(1234.56); // '1 234,56 €' (with fr-FR locale and EUR currency)
 * formatCurrency(1234.56, 'en-US', 'USD', 2); // '$1,234.56'
 */
export function formatCurrency(
  value: number,
  locale?: string,
  currency?: string,
  decimals?: number,
): string {
  const loc = locale ?? getLocale();
  const cur = currency ?? getCurrency();
  const dec = decimals ?? getDecimals();
  const currencyDisplay = getCurrencyDisplayByLocale(loc, cur);

  return value.toLocaleString(loc, {
    style: 'currency',
    currency: cur,
    currencyDisplay,
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
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
 * Uses the formatConfigProvider for default values
 * @param value - The value to format (can be any type)
 * @param formatType - The type of formatting to apply
 * @param options - Additional formatting options (overrides config provider defaults)
 * @returns The formatted value as a string
 *
 * @example
 * formatValue(1234.56, 'number', { decimals: 2 }); // '1 234,56' (with fr-FR locale)
 * formatValue(1234.56, 'currency'); // '1 234,56 €' (with fr-FR and EUR)
 * formatValue(0.1234, 'percent', { decimals: 1 }); // '12.3%'
 * formatValue('2024-01-15', 'date'); // '15 janv. 2024'
 * formatValue(null, 'number'); // '-'
 */
export function formatValue(
  value: unknown,
  formatType: FormatType = 'text',
  options: FormatOptions = {},
): string {
  const {
    decimals,
    currency = getCurrency(),
    locale = getLocale(),
    nullValue = getNullValue(),
  } = options;

  if (value === null || value === undefined) {
    return nullValue;
  }

  switch (formatType) {
    case 'number':
      return typeof value === 'number' ? formatNumber(value, locale, decimals) : String(value);

    case 'currency':
      return typeof value === 'number'
        ? formatCurrency(value, locale, currency, decimals ?? getDecimals())
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
