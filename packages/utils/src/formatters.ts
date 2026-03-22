import { formatConfigProvider } from './formatConfigProvider';

/**
 * Default fallback values if config is not yet initialized
 */
const FALLBACK_LOCALE = 'fr-FR';
const FALLBACK_CURRENCY = 'EUR';
const FALLBACK_DECIMALS = 2;
const FALLBACK_DATE_FORMAT = 'medium';
const FALLBACK_NULL_VALUE = '-';
const FALLBACK_INCLUDE_TIME = false;

interface NumberFormatOptions {
  locale?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  decimals?: number;
}

interface DateFormatOptions {
  locale?: string;
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
}

export function formatNumber(value: number, options: NumberFormatOptions = {}): string {
  const config = formatConfigProvider.getConfig();
  const {
    locale = config.locale || FALLBACK_LOCALE,
    decimals = config.decimals ?? FALLBACK_DECIMALS,
    prefix = '',
    suffix = '',
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${prefix}${formatted}${suffix}`;
}

export function formatCurrency(value: number, options: CurrencyFormatOptions = {}): string {
  const config = formatConfigProvider.getConfig();
  const {
    locale = config.locale || FALLBACK_LOCALE,
    currency = config.currency || FALLBACK_CURRENCY,
    decimals = config.decimals ?? FALLBACK_DECIMALS,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals?: number): string {
  const dec = decimals ?? 1;
  return `${value.toFixed(dec)}%`;
}

export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const config = formatConfigProvider.getConfig();
  const nullValue = config.nullValue || FALLBACK_NULL_VALUE;
  const {
    locale = config.locale || FALLBACK_LOCALE,
    format = config.dateFormat || FALLBACK_DATE_FORMAT,
    includeTime = config.includeTime ?? FALLBACK_INCLUDE_TIME,
  } = options;

  if (date === null || date === undefined || date === '') {
    return nullValue;
  }

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return nullValue;
  }

  const dateStyleMap: Record<string, Intl.DateTimeFormatOptions['dateStyle']> = {
    short: 'short',
    medium: 'medium',
    long: 'long',
    full: 'full',
  };

  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: dateStyleMap[format],
  };

  if (includeTime) {
    formatOptions.timeStyle = 'short';
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

export function formatRelativeDate(date: Date | string | number, locale?: string): string {
  const config = formatConfigProvider.getConfig();
  const loc = locale ?? config.locale ?? FALLBACK_LOCALE;
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}
