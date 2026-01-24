import { ChartPieIcon } from '@heroicons/react/24/outline';
import { PieChartWidgetAE } from '@customdash/visualizations';
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
  LEGEND_POSITION_OPTIONS,
  TITLE_ALIGN_OPTIONS,
} from '../schemas';

/**
 * Pie chart widget type implementation
 */
export class PieWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'pie' as const;
  protected readonly widgetLabel = 'Pie Chart';
  protected readonly widgetDescription = 'Graphique circulaire pour les proportions';
  protected readonly widgetIcon = ChartPieIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = PieChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      colors: { default: [...DEFAULT_CHART_COLORS], inputType: 'color-array', label: 'Couleurs' },
      borderColor: { default: '#ffffff', inputType: 'color', label: 'Couleur de bordure' },
      borderWidth: { default: 2, inputType: 'number', label: 'Epaisseur bordure' },
    };
  }

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return this.getChartSpecificMetricStyles();
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre' },
      titleAlign: {
        default: 'center',
        inputType: 'select',
        label: 'Alignement du titre',
        options: TITLE_ALIGN_OPTIONS,
      },
      legend: { default: true, inputType: 'checkbox', label: 'Afficher la legende' },
      legendPosition: {
        default: 'right',
        inputType: 'select',
        label: 'Position de la legende',
        options: LEGEND_POSITION_OPTIONS,
      },
      cutout: { default: '0%', inputType: 'text', label: 'Trou central (doughnut)' },
      showValues: { default: false, inputType: 'checkbox', label: 'Afficher les valeurs' },
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
      label: 'Metrique',
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: false,
      label: 'Groupement',
      allowedTypes: [
        { value: 'terms', label: 'Termes' },
        { value: 'range', label: 'Plages' },
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
