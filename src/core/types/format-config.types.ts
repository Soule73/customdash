/**
 * Format configuration types for centralized user preferences
 *
 * This module defines the types for formatting configuration that can be
 * shared across the application and injected into packages like
 * @customdash/utils and @customdash/visualizations.
 */

/**
 * Supported date format styles
 */
export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full';

/**
 * Supported number format types
 */
export type NumberFormatType = 'number' | 'currency' | 'percent';

/**
 * Common currency codes
 */
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | string;

/**
 * Common locale codes
 */
export type LocaleCode = 'fr-FR' | 'en-US' | 'en-GB' | 'de-DE' | 'es-ES' | 'it-IT' | string;

/**
 * Format configuration for all formatting utilities
 * This is the central configuration that all formatters should use
 */
export interface FormatConfig {
  /**
   * Locale for number and date formatting (e.g., 'fr-FR', 'en-US')
   * @default 'fr-FR'
   */
  locale: LocaleCode;

  /**
   * Default currency code (e.g., 'EUR', 'USD')
   * @default 'EUR'
   */
  currency: CurrencyCode;

  /**
   * Default number of decimal places
   * @default 2
   */
  decimals: number;

  /**
   * Date format style
   * @default 'medium'
   */
  dateFormat: DateFormatStyle;

  /**
   * String to display for null/undefined values
   * @default '-'
   */
  nullValue: string;

  /**
   * Whether to include time in date formatting
   * @default false
   */
  includeTime: boolean;
}

/**
 * Partial format config for updates
 */
export type FormatConfigUpdate = Partial<FormatConfig>;

/**
 * Default format configuration values
 * These are the application defaults, aligned with French locale
 */
export const DEFAULT_FORMAT_CONFIG: FormatConfig = {
  locale: 'fr-FR',
  currency: 'EUR',
  decimals: 2,
  dateFormat: 'medium',
  nullValue: '-',
  includeTime: false,
} as const;

/**
 * Available locale options for user selection
 */
export const LOCALE_OPTIONS = [
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
] as const;

/**
 * Available currency options for user selection
 */
export const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
] as const;

/**
 * Available date format options for user selection
 */
export const DATE_FORMAT_OPTIONS = [
  { value: 'short', label: 'Court (01/02/26)' },
  { value: 'medium', label: 'Moyen (1 févr. 2026)' },
  { value: 'long', label: 'Long (1 février 2026)' },
  { value: 'full', label: 'Complet (samedi 1 février 2026)' },
] as const;
