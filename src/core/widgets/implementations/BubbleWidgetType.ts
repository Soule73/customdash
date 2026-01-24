import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { BubbleChartWidgetAE } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import { ECHARTS_SCATTER_PARAMS } from '../schemas';

/**
 * Bubble chart widget type implementation
 */
export class BubbleWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'bubble' as const;
  protected readonly widgetLabel = 'Bubble Chart';
  protected readonly widgetDescription = 'Graphique a bulles pour 3 dimensions';
  protected readonly widgetIcon = ChatBubbleLeftIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = BubbleChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      pointRadius: { default: 5, inputType: 'number', label: 'Taille de base' },
      opacity: { default: 0.7, inputType: 'number', label: 'Opacite (0-1)' },
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
      label: 'Metriques',
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
      datasetSectionTitle: 'Datasets (X, Y, R)',
    };
  }
}
