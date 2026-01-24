import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { RadarChartWidgetAE } from '@customdash/visualizations';
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
  ECHARTS_COMMON_PARAMS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Radar chart widget type implementation
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
  protected readonly widgetComponent = RadarChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      fill: F.fill(),
      opacity: F.opacity(0.25),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      legend: F.legend(),
      legendPosition: F.legendPosition(),
      showValues: F.showValues(),
      ...ECHARTS_COMMON_PARAMS,
      ...ECHARTS_RADAR_PARAMS,
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {};
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      get label() {
        return L.metrics;
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
      datasetType: 'multiAxis',
      useDatasetSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleDatasets: true,
      get datasetSectionTitle() {
        return t('widgets.datasets.multiAxis');
      },
    };
  }
}
