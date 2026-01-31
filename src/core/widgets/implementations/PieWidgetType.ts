import { ChartPieIcon } from '@heroicons/react/24/outline';
import { PieChartWidget } from '@customdash/visualizations';
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
import { DEFAULT_CHART_COLORS } from '../constants';
import { t } from '../utils/i18nHelper';

/**
 * Pie chart widget type implementation
 */
export class PieWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'pie' as const;
  protected get widgetLabel() {
    return t('widgets.types.pie');
  }
  protected get widgetDescription() {
    return t('widgets.types.pieDescription');
  }
  protected readonly widgetIcon = ChartPieIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = PieChartWidget as unknown as WidgetComponent;

  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      colors: WidgetFieldBuilder.colors(DEFAULT_CHART_COLORS),
      borderColor: WidgetFieldBuilder.borderColor(),
      borderWidth: WidgetFieldBuilder.borderWidth(),
    };
  }

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return this.getChartSpecificMetricStyles();
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: WidgetFieldBuilder.title(),
      titleAlign: WidgetFieldBuilder.titleAlign(),
      legend: WidgetFieldBuilder.legend(),
      legendPosition: WidgetFieldBuilder.legendPosition('right'),
      cutout: WidgetFieldBuilder.cutout(),
      showValues: WidgetFieldBuilder.showValues(),
      ...EChartsParamsFactory.nonAxisCommonParams({
        animationEasingOptions: SelectOptionFactory.createFromI18nKeys(
          ['linear', 'cubicIn', 'cubicOut', 'cubicInOut', 'elasticOut', 'bounceOut'],
          'widgets.options.animationEasing',
        ),
        emphasisFocusOptions: SelectOptionFactory.createFromI18nKeys(
          ['none', 'self', 'series'],
          'widgets.options.emphasisFocus',
        ),
        tooltipTriggerOptions: SelectOptionFactory.createFromI18nKeys(
          ['item', 'axis', 'none'],
          'widgets.options.tooltipTrigger',
        ),
        labelPositionOptions: SelectOptionFactory.createFromI18nKeys(
          [
            'top',
            'bottom',
            'left',
            'right',
            'inside',
            'insideTop',
            'insideBottom',
            'insideLeft',
            'insideRight',
          ],
          'widgets.options.labelPositions',
        ),
        gradientDirectionOptions: SelectOptionFactory.createFromI18nKeys(
          ['vertical', 'horizontal'],
          'widgets.options.gradientDirections',
        ),
      }),
      ...EChartsParamsFactory.pieParams(
        SelectOptionFactory.createFromI18nKeys(
          ['none', 'radius', 'area'],
          'widgets.options.roseTypes',
        ),
      ),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {};
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createSingleMetricConfig();
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> {
    return MetricConfigFactory.createSingleBucketConfig({
      allowedTypes: [
        { value: 'terms', label: 'widgets.options.bucketTypes.terms' },
        { value: 'range', label: 'widgets.options.bucketTypes.range' },
      ],
    });
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: true,
      allowMultipleMetrics: false,
    };
  }
}
