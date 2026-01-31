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
import { WidgetFieldBuilder, MetricConfigFactory } from '../factories';
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
      valueColor: WidgetFieldBuilder.valueColor(),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: WidgetFieldBuilder.title(),
      columns: {
        default: 2,
        inputType: 'number',
        get label() {
          return t('widgets.params.columns');
        },
      },
      showTrend: WidgetFieldBuilder.showTrend(),
      format: WidgetFieldBuilder.format(),
      decimals: WidgetFieldBuilder.decimals(),
      currency: WidgetFieldBuilder.currency(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createKPIGroupConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return MetricConfigFactory.createDisabledBucketsConfig();
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
