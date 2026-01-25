import { ChartPieIcon } from '@heroicons/react/24/outline';
import { PieChartWidget } from '@customdash/visualizations';
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
  ECHARTS_PIE_PARAMS,
  ECHARTS_COMMON_PARAMS,
  DEFAULT_CHART_COLORS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Pie chart widget type implementation
 */
export class PieWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'pie' as const;
  protected get widgetLabel() {
    return t('widgets.types.pie');
  }
  protected get widgetDescription() {
    return t('widgets.types.pieDescription');
  }
  protected readonly widgetIcon = ChartPieIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = PieChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      colors: F.colors(DEFAULT_CHART_COLORS),
      borderColor: F.borderColor(),
      borderWidth: F.borderWidth(),
    };
  }

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return this.getChartSpecificMetricStyles();
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      titleAlign: F.titleAlign(),
      legend: F.legend(),
      legendPosition: F.legendPosition('right'),
      cutout: F.cutout(),
      showValues: F.showValues(),
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_PIE_PARAMS,
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {};
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: false,
      get label() {
        return L.metric;
      },
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: false,
      get label() {
        return L.bucket;
      },
      allowedTypes: [
        {
          value: 'terms',
          get label() {
            return t('widgets.options.bucketTypes.terms');
          },
        },
        {
          value: 'range',
          get label() {
            return t('widgets.options.bucketTypes.range');
          },
        },
      ],
    };
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: true,
      allowMultipleMetrics: false,
    };
  }
}
