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
  FieldSchemaFactory,
} from '../factories';
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
  protected readonly widgetComponent = ScatterChartWidget as unknown as WidgetComponent;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      color: FieldSchemaFactory.createColorField({
        label: 'widgets.styles.color',
        defaultValue: '#6366f1',
      }),
      borderColor: FieldSchemaFactory.createColorField({
        label: 'widgets.styles.borderColor',
        defaultValue: '#4f46e5',
      }),
      borderWidth: FieldSchemaFactory.createNumberField({
        label: 'widgets.styles.borderWidth',
        defaultValue: 1,
      }),
      pointRadius: {
        default: 4,
        inputType: 'number',
        get label() {
          return t('widgets.styles.pointRadius');
        },
      },
      opacity: WidgetFieldBuilder.opacity(0.8),
    };
  }

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {};
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
