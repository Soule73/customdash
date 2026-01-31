import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { RadarChartWidget } from '@customdash/visualizations';
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
  ECHARTS_RADAR_PARAMS,
  ECHARTS_NON_AXIS_COMMON_PARAMS,
  DEFAULT_CHART_COLORS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Radar chart widget type implementation
 * Each metric becomes an axis on the radar with its aggregated value
 */
export class RadarWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'radar' as const;
  protected get widgetLabel() {
    return t('widgets.types.radar');
  }
  protected get widgetDescription() {
    return t('widgets.types.radarDescription');
  }
  protected readonly widgetIcon = PresentationChartLineIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = RadarChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      colors: F.colors(DEFAULT_CHART_COLORS),
      opacity: F.opacity(0.25),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      titleAlign: F.titleAlign(),
      legend: F.legend(),
      legendPosition: F.legendPosition(),
      showPoints: F.showPoints(),
      showValues: F.showValues(),
      ...ECHARTS_NON_AXIS_COMMON_PARAMS,
      ...ECHARTS_RADAR_PARAMS,
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {};
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      minRequired: 3,
      get label() {
        return L.metrics;
      },
      get description() {
        return t('widgets.datasets.radarMetricsDescription');
      },
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return null;
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      useGroupBy: true,
      allowMultipleMetrics: true,
    };
  }
}
