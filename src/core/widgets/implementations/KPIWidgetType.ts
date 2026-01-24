import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { KPIWidget } from '@customdash/visualizations';
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
 * KPI widget type implementation
 */
export class KPIWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'kpi' as const;
  protected get widgetLabel() {
    return t('widgets.types.kpi');
  }
  protected get widgetDescription() {
    return t('widgets.types.kpiDescription');
  }
  protected readonly widgetIcon = Squares2X2Icon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = KPIWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {};
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      valueColor: F.valueColor(),
      titleColor: F.titleColor(),
      showTrend: F.showTrend(),
      showValue: F.showValue(),
      format: F.format(),
      decimals: F.decimals(),
      currency: F.currency(),
      trendType: F.trendType(),
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
