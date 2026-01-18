import { DEFAULT_CURRENCY, DEFAULT_LOCALE, DEFAULT_NULL_VALUE } from '../constants';

/**
 * Returns the provided locale or the default locale if none is provided.
 * @param locale - The locale string to use.
 * @returns The provided locale or the default locale.
 *
 * @example
 * getLocal('fr-FR'); // Returns 'fr-FR'
 * getLocal(); // Returns the default locale 'en-US'
 */
export function getLocal(locale?: string): string {
  return locale || DEFAULT_LOCALE;
}

/**
 * Returns the provided currency or the default currency if none is provided.
 * @param currency - The currency code to use.
 * @returns The provided currency or the default currency.
 *
 * @example
 * getCurrency('EUR'); // Returns 'EUR'
 * getCurrency(); // Returns the default currency 'USD'
 */
export function getCurrency(currency?: string): string {
  return currency || DEFAULT_CURRENCY;
}

/**
 * Returns the provided null value representation or the default if none is provided.
 * @param nullValue - The string to represent null or undefined values.
 * @returns The provided null value representation or the default.
 *
 * @example
 * getNullValue('N/A'); // Returns 'N/A'
 * getNullValue(); // Returns the default null value '-'
 */
export function getNullValue(nullValue?: string): string {
  return nullValue || DEFAULT_NULL_VALUE;
}
