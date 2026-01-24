import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { KPIGroupWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractWidgetType } from '../abstracts';
import { FORMAT_OPTIONS, CURRENCY_OPTIONS } from '../schemas';

/**
 * KPI Group widget type implementation
 */
export class KPIGroupWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'kpiGroup' as const;
  protected readonly widgetLabel = 'KPI Group';
  protected readonly widgetDescription = 'Groupe de KPIs';
  protected readonly widgetIcon = RectangleGroupIcon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = KPIGroupWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      valueColor: { default: '#6366f1', inputType: 'color', label: 'Couleur des valeurs' },
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre du groupe' },
      columns: { default: 2, inputType: 'number', label: 'Nombre de colonnes' },
      showTrend: { default: true, inputType: 'checkbox', label: 'Afficher la tendance' },
      format: {
        default: 'number',
        inputType: 'select',
        label: 'Format',
        options: FORMAT_OPTIONS,
      },
      decimals: { default: 2, inputType: 'number', label: 'Decimales' },
      currency: {
        default: 'EUR',
        inputType: 'select',
        label: 'Devise',
        options: CURRENCY_OPTIONS,
      },
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      label: 'KPIs',
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return {
      allow: false,
    };
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleMetrics: true,
    };
  }
}
