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
import { ECHARTS_RADAR_PARAMS, ECHARTS_COMMON_PARAMS, LEGEND_POSITION_OPTIONS } from '../schemas';

/**
 * Radar chart widget type implementation
 */
export class RadarWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'radar' as const;
  protected readonly widgetLabel = 'Radar Chart';
  protected readonly widgetDescription = 'Graphique radar pour comparaison multi-axes';
  protected readonly widgetIcon = PresentationChartLineIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = RadarChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      fill: { default: true, inputType: 'checkbox', label: 'Remplir la zone' },
      opacity: { default: 0.25, inputType: 'number', label: 'Opacite (0-1)' },
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre' },
      legend: { default: true, inputType: 'checkbox', label: 'Afficher la legende' },
      legendPosition: {
        default: 'top',
        inputType: 'select',
        label: 'Position de la legende',
        options: LEGEND_POSITION_OPTIONS,
      },
      showValues: { default: false, inputType: 'checkbox', label: 'Afficher les valeurs' },
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
      datasetType: 'multiAxis',
      useDatasetSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleDatasets: true,
      datasetSectionTitle: 'Datasets (axes multiples)',
    };
  }
}
