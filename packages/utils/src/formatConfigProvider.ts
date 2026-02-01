/**
 * Format Configuration Provider
 *
 * A singleton provider that holds the global format configuration.
 * This allows packages like @customdash/utils and @customdash/visualizations
 * to access user preferences without depending on React hooks.
 *
 * Usage:
 * 1. App initializes the provider with user preferences at startup
 * 2. Packages read from the provider instead of using hardcoded defaults
 * 3. When user changes preferences, the app updates the provider
 *
 * @example
 * // In App.tsx (initialization)
 * import { formatConfigProvider } from '@customdash/utils';
 * formatConfigProvider.setConfig({ locale: 'fr-FR', currency: 'EUR' });
 *
 * // In any package (usage)
 * import { formatConfigProvider } from '@customdash/utils';
 * const { locale, currency } = formatConfigProvider.getConfig();
 */

/**
 * Format configuration interface
 * Duplicated here to avoid circular dependencies with main app
 */
export interface FormatConfig {
  locale: string;
  currency: string;
  decimals: number;
  dateFormat: 'short' | 'medium' | 'long' | 'full';
  nullValue: string;
  includeTime: boolean;
}

/**
 * Default format configuration
 * These defaults are aligned with French locale preferences
 */
const DEFAULT_CONFIG: FormatConfig = {
  locale: 'fr-FR',
  currency: 'EUR',
  decimals: 2,
  dateFormat: 'medium',
  nullValue: '-',
  includeTime: false,
};

/**
 * Listeners type for config change notifications
 */
type ConfigListener = (config: FormatConfig) => void;

/**
 * FormatConfigProvider class
 * Singleton that manages the global format configuration
 */
class FormatConfigProvider {
  private static instance: FormatConfigProvider;
  private config: FormatConfig;
  private listeners: Set<ConfigListener> = new Set();

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): FormatConfigProvider {
    if (!FormatConfigProvider.instance) {
      FormatConfigProvider.instance = new FormatConfigProvider();
    }
    return FormatConfigProvider.instance;
  }

  /**
   * Get the current format configuration
   */
  getConfig(): FormatConfig {
    return { ...this.config };
  }

  /**
   * Get a specific config value
   */
  get<K extends keyof FormatConfig>(key: K): FormatConfig[K] {
    return this.config[key];
  }

  /**
   * Set the entire format configuration
   */
  setConfig(config: Partial<FormatConfig>): void {
    this.config = { ...this.config, ...config };
    this.notifyListeners();
  }

  /**
   * Update a specific config value
   */
  set<K extends keyof FormatConfig>(key: K, value: FormatConfig[K]): void {
    this.config[key] = value;
    this.notifyListeners();
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.notifyListeners();
  }

  /**
   * Subscribe to config changes
   * @returns Unsubscribe function
   */
  subscribe(listener: ConfigListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of config changes
   */
  private notifyListeners(): void {
    const config = this.getConfig();
    this.listeners.forEach(listener => listener(config));
  }

  // Convenience getters for common values
  get locale(): string {
    return this.config.locale;
  }

  get currency(): string {
    return this.config.currency;
  }

  get decimals(): number {
    return this.config.decimals;
  }

  get dateFormat(): FormatConfig['dateFormat'] {
    return this.config.dateFormat;
  }

  get nullValue(): string {
    return this.config.nullValue;
  }

  get includeTime(): boolean {
    return this.config.includeTime;
  }
}

/**
 * Singleton instance export
 * Use this in all packages to access format configuration
 */
export const formatConfigProvider = FormatConfigProvider.getInstance();

/**
 * Helper function to get current locale
 */
export function getConfigLocale(): string {
  return formatConfigProvider.locale;
}

/**
 * Helper function to get current currency
 */
export function getConfigCurrency(): string {
  return formatConfigProvider.currency;
}

/**
 * Helper function to get current decimals
 */
export function getConfigDecimals(): number {
  return formatConfigProvider.decimals;
}

/**
 * Helper function to get null value representation
 */
export function getConfigNullValue(): string {
  return formatConfigProvider.nullValue;
}

/**
 * Helper function to get date format style
 */
export function getConfigDateFormat(): FormatConfig['dateFormat'] {
  return formatConfigProvider.dateFormat;
}
