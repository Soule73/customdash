import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { ScatterChartWidgetAE } from '@customdash/visualizations';
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
  ECHARTS_SCATTER_PARAMS,
  WIDGET_FIELD_SCHEMAS as F,
  METRIC_CONFIG_LABELS as L,
} from '../schemas';
import { t } from '../utils/i18nHelper';

/**
 * Scatter chart widget type implementation
 */
export class ScatterWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'scatter' as const;
  protected get widgetLabel() {
    return t('widgets.types.scatter');
  }
  protected get widgetDescription() {
    return t('widgets.types.scatterDescription');
  }
  protected readonly widgetIcon = CursorArrowRaysIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = ScatterChartWidgetAE as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      pointRadius: F.pointRadius(),
      pointStyle: F.pointStyle(),
      opacity: F.opacity(),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: F.showPoints(),
      ...ECHARTS_SCATTER_PARAMS,
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

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return {
      allow: false,
    };
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      datasetType: 'xy',
      useDatasetSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      allowMultipleDatasets: true,
      get datasetSectionTitle() {
        return t('widgets.datasets.xy');
      },
    };
  }
}
