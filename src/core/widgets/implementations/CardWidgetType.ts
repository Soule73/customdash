import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { CardWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractWidgetType } from '../abstracts';
import { WidgetFieldBuilder, MetricConfigFactory } from '../factories';
import { t } from '../utils/i18nHelper';

/**
 * Card widget type implementation
 */
export class CardWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'card' as const;
  protected get widgetLabel() {
    return t('widgets.types.card');
  }
  protected get widgetDescription() {
    return t('widgets.types.cardDescription');
  }
  protected readonly widgetIcon = Squares2X2Icon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = CardWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {};
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: WidgetFieldBuilder.title(),
      description: WidgetFieldBuilder.description(),
      showIcon: WidgetFieldBuilder.showIcon(),
      iconColor: WidgetFieldBuilder.iconColor(),
      valueColor: WidgetFieldBuilder.valueColor('#111827'),
      format: WidgetFieldBuilder.format(),
      decimals: WidgetFieldBuilder.decimals(),
      currency: WidgetFieldBuilder.currency(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createSingleMetricConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return MetricConfigFactory.createDisabledBucketsConfig();
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleMetrics: false,
    };
  }
}
