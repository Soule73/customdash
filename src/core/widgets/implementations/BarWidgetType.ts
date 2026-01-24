import { ChartBarIcon } from '@heroicons/react/24/outline';
import { BarChartWidgetAE } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import {
  ECHARTS_BAR_PARAMS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
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
  protected readonly widgetComponent = BarChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      barThickness: F.barThickness(),
      borderRadius: F.borderRadius(),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      stacked: F.stacked('bar'),
      horizontal: F.horizontal(),
      ...ECHARTS_BAR_PARAMS,
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      get label() {
        return L.metrics;
      },
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: true,
      get label() {
        return L.buckets;
      },
    };
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
