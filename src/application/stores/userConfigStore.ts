import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatConfigProvider } from '@customdash/utils';
import { STORAGE_KEYS } from '@/core/constants';
import type {
  FormatConfig,
  FormatConfigUpdate,
  DateFormatStyle,
  CurrencyCode,
  LocaleCode,
} from '@type/format-config.types';
import { DEFAULT_FORMAT_CONFIG } from '@type/format-config.types';

/**
 * User configuration store state
 */
interface UserConfigState extends FormatConfig {
  /** Whether the config has been initialized from storage */
  isInitialized: boolean;
}

/**
 * User configuration store actions
 */
interface UserConfigActions {
  /** Set the locale for number and date formatting */
  setLocale: (locale: LocaleCode) => void;

  /** Set the default currency */
  setCurrency: (currency: CurrencyCode) => void;

  /** Set the number of decimal places */
  setDecimals: (decimals: number) => void;

  /** Set the date format style */
  setDateFormat: (format: DateFormatStyle) => void;

  /** Set the null value representation */
  setNullValue: (nullValue: string) => void;

  /** Set whether to include time in date formatting */
  setIncludeTime: (includeTime: boolean) => void;

  /** Update multiple config values at once */
  updateConfig: (config: FormatConfigUpdate) => void;

  /** Reset to default configuration */
  reset: () => void;

  /** Initialize the store and sync with formatConfigProvider */
  initialize: () => void;
}

/**
 * User configuration store type
 */
export interface UserConfigStore extends UserConfigState, UserConfigActions {}

/**
 * Sync the store state with the formatConfigProvider
 * This ensures packages without React access get the updated config
 */
function syncWithProvider(state: FormatConfig): void {
  formatConfigProvider.setConfig({
    locale: state.locale,
    currency: state.currency,
    decimals: state.decimals,
    dateFormat: state.dateFormat,
    nullValue: state.nullValue,
    includeTime: state.includeTime,
  });
}

/**
 * User configuration store
 *
 * Manages user formatting preferences and syncs them with the
 * formatConfigProvider singleton for use in non-React packages.
 *
 * @example
 * // In a React component
 * const { locale, currency, setLocale, setCurrency } = useUserConfigStore();
 *
 * // Change locale
 * setLocale('en-US');
 *
 * // Change currency
 * setCurrency('USD');
 */
export const useUserConfigStore = create<UserConfigStore>()(
  persist(
    (set, get) => ({
      // Initial state from defaults
      ...DEFAULT_FORMAT_CONFIG,
      isInitialized: false,

      setLocale: (locale: LocaleCode) => {
        set({ locale });
        syncWithProvider(get());
      },

      setCurrency: (currency: CurrencyCode) => {
        set({ currency });
        syncWithProvider(get());
      },

      setDecimals: (decimals: number) => {
        set({ decimals: Math.max(0, Math.min(10, decimals)) });
        syncWithProvider(get());
      },

      setDateFormat: (dateFormat: DateFormatStyle) => {
        set({ dateFormat });
        syncWithProvider(get());
      },

      setNullValue: (nullValue: string) => {
        set({ nullValue });
        syncWithProvider(get());
      },

      setIncludeTime: (includeTime: boolean) => {
        set({ includeTime });
        syncWithProvider(get());
      },

      updateConfig: (config: FormatConfigUpdate) => {
        set(state => ({ ...state, ...config }));
        syncWithProvider(get());
      },

      reset: () => {
        set({ ...DEFAULT_FORMAT_CONFIG });
        syncWithProvider(get());
      },

      initialize: () => {
        const state = get();
        if (!state.isInitialized) {
          // Sync current state with provider on first load
          syncWithProvider(state);
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER_CONFIG || 'customdash-user-config',
      partialize: state => ({
        locale: state.locale,
        currency: state.currency,
        decimals: state.decimals,
        dateFormat: state.dateFormat,
        nullValue: state.nullValue,
        includeTime: state.includeTime,
      }),
      onRehydrateStorage: () => state => {
        // Sync with provider after rehydration from localStorage
        if (state) {
          syncWithProvider(state);
          state.isInitialized = true;
        }
      },
    },
  ),
);

/**
 * Selector to get the full format config
 */
export const selectFormatConfig = (state: UserConfigStore): FormatConfig => ({
  locale: state.locale,
  currency: state.currency,
  decimals: state.decimals,
  dateFormat: state.dateFormat,
  nullValue: state.nullValue,
  includeTime: state.includeTime,
});
