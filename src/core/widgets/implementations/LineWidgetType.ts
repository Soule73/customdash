import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { LineChartWidget } from '@customdash/visualizations';
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
 * Line chart widget type implementation
 */
export class LineWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'line' as const;
  protected get widgetLabel() {
    return t('widgets.types.line');
  }
  protected get widgetDescription() {
    return t('widgets.types.lineDescription');
  }
  protected readonly widgetIcon = ArrowTrendingUpIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = LineChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      fill: {
        default: false,
        inputType: 'checkbox',
        get label() {
          return t('widgets.styles.fill');
        },
      },
      tension: {
        default: 0,
        inputType: 'number',
        get label() {
          return t('widgets.styles.tension');
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
      stepped: {
        default: false,
        inputType: 'checkbox',
        get label() {
          return t('widgets.styles.stepped');
        },
      },
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {
      showPoints: WidgetFieldBuilder.showPoints(),
      stacked: {
        default: false,
        inputType: 'checkbox',
        get label() {
          return t('widgets.line.stacked');
        },
      },
      ...EChartsParamsFactory.lineParams({
        stepOptions: SelectOptionFactory.createFromI18nKeys(
          ['none', 'start', 'middle', 'end'],
          'widgets.options.lineSteps',
        ),
        symbolOptions: POINT_STYLE_OPTIONS,
      }),
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
