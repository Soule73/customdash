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
import { MetricConfigFactory, WidgetFieldBuilder, SelectOptionFactory } from '../factories';
import { FORMAT_TYPES } from '../constants';
import { t } from '../utils/i18nHelper';

/**
 * Table widget type implementation
 * Respects Single Responsibility Principle - only defines table widget configuration
 */
export class TableWidgetType extends AbstractWidgetType {
  protected readonly widgetType = 'table' as const;
  protected get widgetLabel() {
    return t('widgets.types.table');
  }
  protected get widgetDescription() {
    return t('widgets.types.tableDescription');
  }
  protected readonly widgetIcon = TableCellsIcon;
  protected readonly widgetCategory: WidgetCategory = 'data';
  protected readonly widgetComponent = TableWidget as unknown as WidgetComponent;

  /**
   * Builds table-specific metric styles
   * Uses builder pattern for consistent field creation
   */
  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      width: WidgetFieldBuilder.width(),
      align: WidgetFieldBuilder.align('right'),
      format: {
        default: 'number',
        inputType: 'select',
        get label() {
          return t('widgets.styles.format');
        },
        options: SelectOptionFactory.createFromI18nKeys(FORMAT_TYPES, 'widgets.formats'),
      },
    };
  }

  /**
   * Builds table-specific widget parameters
   * Uses builder for DRY and consistency
   */
  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: WidgetFieldBuilder.title(),
      pageSize: WidgetFieldBuilder.pageSize(10),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createMultipleMetricsConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return MetricConfigFactory.createMultipleBucketsConfig();
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
