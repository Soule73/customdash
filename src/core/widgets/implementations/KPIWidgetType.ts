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
import { WidgetFieldBuilder, MetricConfigFactory, SelectOptionFactory } from '../factories';
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
      title: WidgetFieldBuilder.title(),
      valueColor: WidgetFieldBuilder.valueColor(),
      titleColor: WidgetFieldBuilder.titleColor(),
      showTrend: WidgetFieldBuilder.showTrend(),
      showValue: WidgetFieldBuilder.showValue(),
      format: WidgetFieldBuilder.format(),
      decimals: WidgetFieldBuilder.decimals(),
      currency: WidgetFieldBuilder.currency(),
      trendType: {
        default: 'arrow',
        inputType: 'select',
        get label() {
          return t('widgets.params.trendType');
        },
        options: SelectOptionFactory.createTrendTypeOptions(),
      },
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
