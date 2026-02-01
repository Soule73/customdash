import { useCallback, useMemo } from 'react';
import { formatConfigProvider } from '@customdash/utils';
import { useUserConfigStore, selectFormatConfig } from '@stores/userConfigStore';
import type { FormatConfig, FormatConfigUpdate } from '@type/format-config.types';

/**
 * Hook to access and manage format configuration
 *
 * This hook provides access to the user's format preferences and
 * methods to update them. Changes are automatically synced with
 * the formatConfigProvider for use in non-React packages.
 *
 * @example
 * function MyComponent() {
 *   const { locale, currency, setLocale, setCurrency } = useFormatConfig();
 *
 *   return (
 *     <div>
 *       <p>Current locale: {locale}</p>
 *       <button onClick={() => setLocale('en-US')}>Switch to English</button>
 *     </div>
 *   );
 * }
 */
export function useFormatConfig() {
  const store = useUserConfigStore();

  // Get the full config object
  const config = useUserConfigStore(selectFormatConfig);

  // Memoized update function for bulk updates
  const updateConfig = useCallback(
    (updates: FormatConfigUpdate) => {
      store.updateConfig(updates);
    },
    [store],
  );

  return {
    // Config values
    ...config,

    // Individual setters
    setLocale: store.setLocale,
    setCurrency: store.setCurrency,
    setDecimals: store.setDecimals,
    setDateFormat: store.setDateFormat,
    setNullValue: store.setNullValue,
    setIncludeTime: store.setIncludeTime,

    // Bulk update
    updateConfig,

    // Reset
    reset: store.reset,
  };
}

/**
 * Hook to get formatted values using the current user configuration
 *
 * Provides formatting functions that automatically use the user's
 * locale, currency, and decimal preferences.
 *
 * @example
 * function PriceDisplay({ amount }: { amount: number }) {
 *   const { formatCurrency, formatNumber } = useFormattedValue();
 *
 *   return (
 *     <div>
 *       <p>Price: {formatCurrency(amount)}</p>
 *       <p>Quantity: {formatNumber(quantity)}</p>
 *     </div>
 *   );
 * }
 */
export function useFormattedValue() {
  const config = useUserConfigStore(selectFormatConfig);

  const formatNumber = useCallback(
    (value: number, decimals?: number): string => {
      const dec = decimals ?? config.decimals;
      return new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(value);
    },
    [config.locale, config.decimals],
  );

  const formatCurrency = useCallback(
    (value: number, currency?: string, decimals?: number): string => {
      const cur = currency ?? config.currency;
      const dec = decimals ?? config.decimals;
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(value);
    },
    [config.locale, config.currency, config.decimals],
  );

  const formatPercent = useCallback((value: number, decimals: number = 1): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  }, []);

  const formatDate = useCallback(
    (date: Date | string | number, includeTime?: boolean): string => {
      const dateObj = date instanceof Date ? date : new Date(date);

      if (isNaN(dateObj.getTime())) {
        return config.nullValue;
      }

      const dateStyleMap: Record<string, Intl.DateTimeFormatOptions['dateStyle']> = {
        short: 'short',
        medium: 'medium',
        long: 'long',
        full: 'full',
      };

      const options: Intl.DateTimeFormatOptions = {
        dateStyle: dateStyleMap[config.dateFormat],
      };

      if (includeTime ?? config.includeTime) {
        options.timeStyle = 'short';
      }

      return new Intl.DateTimeFormat(config.locale, options).format(dateObj);
    },
    [config.locale, config.dateFormat, config.includeTime, config.nullValue],
  );

  const formatRelativeDate = useCallback(
    (date: Date | string | number): string => {
      const dateObj = date instanceof Date ? date : new Date(date);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      const rtf = new Intl.RelativeTimeFormat(config.locale, { numeric: 'auto' });

      if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return rtf.format(-diffInDays, 'day');

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month');

      const diffInYears = Math.floor(diffInMonths / 12);
      return rtf.format(-diffInYears, 'year');
    },
    [config.locale],
  );

  return useMemo(
    () => ({
      formatNumber,
      formatCurrency,
      formatPercent,
      formatDate,
      formatRelativeDate,
      nullValue: config.nullValue,
    }),
    [formatNumber, formatCurrency, formatPercent, formatDate, formatRelativeDate, config.nullValue],
  );
}

/**
 * Get the current format config synchronously (for non-hook contexts)
 * This reads from the formatConfigProvider singleton
 */
export function getFormatConfig(): FormatConfig {
  return formatConfigProvider.getConfig();
}
