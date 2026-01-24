import { TableCellsIcon } from '@heroicons/react/24/outline';
import { TableWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractWidgetType } from '../abstracts';

/**
 * Table widget type implementation
 */
export class TableWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'table' as const;
  protected readonly widgetLabel = 'Table';
  protected readonly widgetDescription = 'Tableau de donnees';
  protected readonly widgetIcon = TableCellsIcon;
  protected readonly widgetCategory: WidgetCategory = 'data';
  protected readonly widgetComponent = TableWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {};
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: { default: '', inputType: 'text', label: 'Titre du tableau' },
      pageSize: { default: 10, inputType: 'number', label: 'Lignes par page' },
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
