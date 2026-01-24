import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { KPIWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractWidgetType } from '../abstracts';
import { FORMAT_OPTIONS, CURRENCY_OPTIONS, TREND_TYPE_OPTIONS } from '../schemas';

/**
 * KPI widget type implementation
 */
export class KPIWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'kpi' as const;
  protected readonly widgetLabel = 'KPI';
  protected readonly widgetDescription = 'Indicateur de performance cle';
  protected readonly widgetIcon = Squares2X2Icon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = KPIWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {};
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre du KPI' },
      valueColor: { default: '#6366f1', inputType: 'color', label: 'Couleur de la valeur' },
      titleColor: { default: '#374151', inputType: 'color', label: 'Couleur du titre' },
      showTrend: { default: true, inputType: 'checkbox', label: 'Afficher la tendance' },
      showValue: { default: true, inputType: 'checkbox', label: 'Afficher la valeur' },
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
      trendType: {
        default: 'arrow',
        inputType: 'select',
        label: 'Type de tendance',
        options: TREND_TYPE_OPTIONS,
      },
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: false,
      label: 'Metrique',
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
      allowMultipleMetrics: false,
    };
  }
}
