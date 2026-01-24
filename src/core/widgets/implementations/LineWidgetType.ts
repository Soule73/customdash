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
import { ECHARTS_LINE_PARAMS, POINT_STYLE_OPTIONS } from '../schemas';

/**
 * Line chart widget type implementation
 */
export class LineWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'line' as const;
  protected readonly widgetLabel = 'Line Chart';
  protected readonly widgetDescription = 'Graphique en lignes pour visualiser des tendances';
  protected readonly widgetIcon = ArrowTrendingUpIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = LineChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      fill: { default: false, inputType: 'checkbox', label: 'Remplir sous la ligne' },
      tension: { default: 0, inputType: 'number', label: 'Courbure' },
      pointStyle: {
        default: 'circle',
        inputType: 'select',
        label: 'Style des points',
        options: POINT_STYLE_OPTIONS,
      },
      stepped: { default: false, inputType: 'checkbox', label: 'Ligne en escalier' },
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: { default: true, inputType: 'checkbox', label: 'Afficher les points' },
      stacked: { default: false, inputType: 'checkbox', label: 'Empiler les lignes' },
      ...ECHARTS_LINE_PARAMS,
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      label: 'Metriques',
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: true,
      label: 'Groupements',
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
