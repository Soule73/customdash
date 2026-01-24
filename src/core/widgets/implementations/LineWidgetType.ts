import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { LineChartWidgetAE } from '@customdash/visualizations';
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
  ECHARTS_LINE_PARAMS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Line chart widget type implementation
 */
export class LineWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'line' as const;
  protected get widgetLabel() {
    return t('widgets.types.line');
  }
  protected get widgetDescription() {
    return t('widgets.types.lineDescription');
  }
  protected readonly widgetIcon = ArrowTrendingUpIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = LineChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      fill: F.fill(),
      tension: F.tension(),
      pointStyle: F.pointStyle(),
      stepped: F.stepped(),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: F.showPoints(),
      stacked: F.stacked('line'),
      ...ECHARTS_LINE_PARAMS,
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
