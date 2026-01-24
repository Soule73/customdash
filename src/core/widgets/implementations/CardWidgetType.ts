import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { CardWidget } from '@customdash/visualizations';
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
 * Card widget type implementation
 */
export class CardWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'card' as const;
  protected readonly widgetLabel = 'Card';
  protected readonly widgetDescription = 'Carte avec valeur et icone';
  protected readonly widgetIcon = Squares2X2Icon;
  protected readonly widgetCategory: WidgetCategory = 'metric';
  protected readonly widgetComponent = CardWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {};
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre' },
      description: { default: '', inputType: 'text', label: 'Description' },
      showIcon: { default: true, inputType: 'checkbox', label: 'Afficher une icone' },
      iconColor: { default: '#6366f1', inputType: 'color', label: "Couleur de l'icone" },
      valueColor: { default: '#111827', inputType: 'color', label: 'Couleur de la valeur' },
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
