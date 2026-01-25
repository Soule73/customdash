import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { BubbleChartWidget } from '@customdash/visualizations';
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
  ECHARTS_SCATTER_PARAMS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Bubble chart widget type implementation
 */
export class BubbleWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'bubble' as const;
  protected get widgetLabel() {
    return t('widgets.types.bubble');
  }
  protected get widgetDescription() {
    return t('widgets.types.bubbleDescription');
  }
  protected readonly widgetIcon = ChatBubbleLeftIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = BubbleChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      pointRadius: F.pointRadius(5),
      opacity: F.opacity(),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      ...ECHARTS_SCATTER_PARAMS,
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

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return {
      allow: false,
    };
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      datasetType: 'xyr',
      useDatasetSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleDatasets: true,
      get datasetSectionTitle() {
        return t('widgets.datasets.xyr');
      },
    };
  }
}
