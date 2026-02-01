import { formatConfigProvider } from '@customdash/utils';

/**
 * Returns the provided locale or the locale from config provider if none is provided.
 * @param locale - The locale string to use.
 * @returns The provided locale or the config provider locale.
 *
 * @example
 * getLocal('fr-FR'); // Returns 'fr-FR'
 * getLocal(); // Returns the config provider locale (e.g., 'fr-FR')
 */
export function getLocal(locale?: string): string {
  return locale || formatConfigProvider.locale;
}

/**
 * Returns the provided currency or the currency from config provider if none is provided.
 * @param currency - The currency code to use.
 * @returns The provided currency or the config provider currency.
 *
 * @example
 * getCurrency('EUR'); // Returns 'EUR'
 * getCurrency(); // Returns the config provider currency (e.g., 'EUR')
 */
export function getCurrency(currency?: string): string {
  return currency || formatConfigProvider.currency;
}

/**
 * Returns the provided null value representation or the one from config provider if none is provided.
 * @param nullValue - The string to represent null or undefined values.
 * @returns The provided null value representation or the config provider value.
 *
 * @example
 * getNullValue('N/A'); // Returns 'N/A'
 * getNullValue(); // Returns the config provider null value (e.g., '-')
 */
export function getNullValue(nullValue?: string): string {
  return nullValue || formatConfigProvider.nullValue;
}
