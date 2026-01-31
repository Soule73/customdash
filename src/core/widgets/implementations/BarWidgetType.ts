import { ChartBarIcon } from '@heroicons/react/24/outline';
import { BarChartWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import { MetricConfigFactory, EChartsParamsFactory } from '../factories';
import { t } from '../utils/i18nHelper';

/**
 * Bar chart widget type implementation
 */
export class BarWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'bar' as const;
  protected get widgetLabel() {
    return t('widgets.types.bar');
  }
  protected get widgetDescription() {
    return t('widgets.types.barDescription');
  }
  protected readonly widgetIcon = ChartBarIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = BarChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      barThickness: {
        default: undefined,
        inputType: 'number',
        get label() {
          return t('widgets.styles.barThickness');
        },
      },
      borderRadius: {
        default: 0,
        inputType: 'number',
        get label() {
          return t('widgets.styles.borderRadius');
        },
      },
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      stacked: {
        default: false,
        inputType: 'checkbox',
        get label() {
          return t('widgets.bar.stacked');
        },
      },
      horizontal: {
        default: false,
        inputType: 'checkbox',
        get label() {
          return t('widgets.bar.horizontal');
        },
      },
      ...EChartsParamsFactory.barParams(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createMultipleMetricsConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return MetricConfigFactory.createMultipleBucketsConfig();
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: true,
      allowMultipleMetrics: true,
    };
  }
}
