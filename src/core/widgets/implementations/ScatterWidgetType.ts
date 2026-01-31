import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { ScatterChartWidget } from '@customdash/visualizations';
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
  WidgetFieldBuilder,
  MetricConfigFactory,
  EChartsParamsFactory,
  SelectOptionFactory,
} from '../factories';
import { t } from '../utils/i18nHelper';

const POINT_STYLE_OPTIONS = SelectOptionFactory.createFromI18nKeys(
  ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'],
  'widgets.options.symbolTypes',
);

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
  protected readonly widgetComponent = ScatterChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      pointRadius: {
        default: 4,
        inputType: 'number',
        get label() {
          return t('widgets.styles.pointRadius');
        },
      },
      pointStyle: {
        default: 'circle',
        inputType: 'select',
        get label() {
          return t('widgets.styles.pointStyle');
        },
        options: POINT_STYLE_OPTIONS,
      },
      opacity: WidgetFieldBuilder.opacity(),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: WidgetFieldBuilder.showPoints(),
      ...EChartsParamsFactory.scatterParams(),
    };
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createMultipleMetricsConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return MetricConfigFactory.createDisabledBucketsConfig();
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
