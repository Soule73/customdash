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
import { WIDGET_FIELD_SCHEMAS as F, METRIC_CONFIG_LABELS as L } from '../schemas';
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
      title: F.title(),
      description: F.description(),
      showIcon: F.showIcon(),
      iconColor: F.iconColor(),
      valueColor: F.valueColor('#111827'),
      format: F.format(),
      decimals: F.decimals(),
      currency: F.currency(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: false,
      get label() {
        return L.metric;
      },
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return {
      allow: false,
    };
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
