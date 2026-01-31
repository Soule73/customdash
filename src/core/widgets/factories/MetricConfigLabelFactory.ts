import { t } from '../utils/i18nHelper';
import type { IMetricsConfig, IBucketsConfig } from '../interfaces';

/**
 * Factory for metric and bucket configurations
 * Implements Factory Pattern to centralize config creation
 * Respects DRY and Single Responsibility Principle
 */
export class MetricConfigFactory {
  /**
   * Creates a single metric configuration
   */
  static createSingleMetricConfig(options?: { description?: string }): Partial<IMetricsConfig> {
    const config: Partial<IMetricsConfig> = {
      allowMultiple: false,
      get label() {
        return t('widgets.metrics.singular');
      },
    };

    if (options?.description) {
      Object.defineProperty(config, 'description', {
        get() {
          return t(options.description as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return config;
  }

  /**
   * Creates a multiple metrics configuration
   */
  static createMultipleMetricsConfig(options?: {
    minRequired?: number;
    description?: string;
  }): Partial<IMetricsConfig> {
    const config = {
      allowMultiple: true as const,
      ...(options?.minRequired !== undefined && { minRequired: options.minRequired }),
      get label() {
        return t('widgets.metrics.label');
      },
    };

    if (options?.description) {
      Object.defineProperty(config, 'description', {
        get() {
          return t(options.description as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return config;
  }

  /**
   * Creates a KPI group configuration
   */
  static createKPIGroupConfig(options?: {
    minRequired?: number;
    description?: string;
  }): Partial<IMetricsConfig> {
    const config = {
      allowMultiple: true as const,
      ...(options?.minRequired !== undefined && { minRequired: options.minRequired }),
      get label() {
        return t('widgets.kpis');
      },
    };

    if (options?.description) {
      Object.defineProperty(config, 'description', {
        get() {
          return t(options.description as string);
        },
        enumerable: true,
        configurable: true,
      });
    }

    return config;
  }

  /**
   * Creates a single bucket configuration
   */
  static createSingleBucketConfig(options?: {
    allowedTypes?: Array<{ value: string; label: string }>;
  }): Partial<IBucketsConfig> {
    const baseConfig: Partial<IBucketsConfig> = {
      allow: true,
      allowMultiple: false,
      get label() {
        return t('widgets.buckets.singular');
      },
    };

    if (options?.allowedTypes) {
      return {
        ...baseConfig,
        allowedTypes: options.allowedTypes.map(type => ({
          value: type.value,
          get label() {
            return t(type.label);
          },
        })) as unknown as IBucketsConfig['allowedTypes'],
      };
    }

    return baseConfig;
  }

  /**
   * Creates a multiple buckets configuration
   */
  static createMultipleBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: true,
      get label() {
        return t('widgets.buckets.label');
      },
    };
  }

  /**
   * Creates a disabled buckets configuration
   */
  static createDisabledBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: false,
    };
  }
}
