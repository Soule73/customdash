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
  const { locale = 'fr-FR', decimals = 0, prefix = '', suffix = '' } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${prefix}${formatted}${suffix}`;
}

export function formatCurrency(value: number, options: CurrencyFormatOptions = {}): string {
  const { locale = 'fr-FR', currency = 'EUR', decimals = 2 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const { locale = 'fr-FR', format = 'medium', includeTime = false } = options;

  if (date === null || date === undefined || date === '') {
    return '-';
  }

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '-';
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

export function formatRelativeDate(date: Date | string | number, locale = 'fr-FR'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

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
