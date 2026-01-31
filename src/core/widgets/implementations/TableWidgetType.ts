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
import {
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
  ALIGN_OPTIONS,
  FORMAT_OPTIONS,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Table widget type implementation
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

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      width: {
        default: undefined,
        inputType: 'text',
        get label() {
          return t('widgets.styles.width');
        },
        get placeholder() {
          return t('widgets.styles.widthPlaceholder');
        },
      },
      align: {
        default: 'right',
        inputType: 'select',
        get label() {
          return t('widgets.styles.align');
        },
        options: ALIGN_OPTIONS,
      },
      format: {
        default: 'number',
        inputType: 'select',
        get label() {
          return t('widgets.styles.format');
        },
        options: FORMAT_OPTIONS,
      },
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: F.title(),
      pageSize: {
        default: 10,
        inputType: 'number',
        get label() {
          return t('widgets.params.pageSize');
        },
      },
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return {
      allowMultiple: true,
      get label() {
        return L.metrics;
      },
    };
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return {
      allow: true,
      allowMultiple: true,
      get label() {
        return L.buckets;
      },
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
