import { ChartBarIcon } from '@heroicons/react/24/outline';
import { BarChartWidgetAE } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import { ECHARTS_BAR_PARAMS } from '../schemas';

/**
 * Bar chart widget type implementation
 */
export class BarWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'bar' as const;
  protected readonly widgetLabel = 'Bar Chart';
  protected readonly widgetDescription = 'Graphique en barres pour comparer des valeurs';
  protected readonly widgetIcon = ChartBarIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = BarChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      barThickness: { default: undefined, inputType: 'number', label: 'Epaisseur des barres' },
      borderRadius: { default: 0, inputType: 'number', label: 'Arrondi des barres' },
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      stacked: { default: false, inputType: 'checkbox', label: 'Empiler les barres' },
      horizontal: { default: false, inputType: 'checkbox', label: 'Barres horizontales' },
      ...ECHARTS_BAR_PARAMS,
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
