import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { ScatterChartWidgetAE } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import { ECHARTS_SCATTER_PARAMS, POINT_STYLE_OPTIONS } from '../schemas';

/**
 * Scatter chart widget type implementation
 */
export class ScatterWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'scatter' as const;
  protected readonly widgetLabel = 'Scatter Chart';
  protected readonly widgetDescription = 'Nuage de points pour correlations';
  protected readonly widgetIcon = CursorArrowRaysIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = ScatterChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      pointRadius: { default: 4, inputType: 'number', label: 'Taille des points' },
      pointStyle: {
        default: 'circle',
        inputType: 'select',
        label: 'Style des points',
        options: POINT_STYLE_OPTIONS,
      },
      opacity: { default: 0.7, inputType: 'number', label: 'Opacite (0-1)' },
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: { default: true, inputType: 'checkbox', label: 'Afficher les points' },
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
      datasetType: 'xy',
      useDatasetSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleDatasets: true,
      datasetSectionTitle: 'Datasets (X, Y)',
    };
  }
}
