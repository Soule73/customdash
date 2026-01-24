import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { KPIGroupWidget } from '@customdash/visualizations';
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
 * KPI Group widget type implementation
 */
export class KPIGroupWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'kpiGroup' as const;
  protected get widgetLabel() {
    return t('widgets.types.kpiGroup');
  }
  protected get widgetDescription() {
    return t('widgets.types.kpiGroupDescription');
  }
  protected readonly widgetIcon = RectangleGroupIcon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = KPIGroupWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      valueColor: F.valueColor(),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      columns: F.columns(),
      showTrend: F.showTrend(),
      format: F.format(),
      decimals: F.decimals(),
      currency: F.currency(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      get label() {
        return L.kpis;
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
      allowMultipleMetrics: true,
    };
  }
}
