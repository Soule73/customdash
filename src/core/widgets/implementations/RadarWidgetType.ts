import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { RadarChartWidget } from '@customdash/visualizations';
import type { FieldSchema } from '@type/widget-form.types';
import type {
  IMetricsConfig,
  IBucketsConfig,
  IWidgetDataConfig,
  WidgetComponent,
  WidgetCategory,
} from '../interfaces';
import { AbstractChartWidgetType } from '../abstracts';
import { DEFAULT_CHART_COLORS } from '../constants';
import {
  WidgetFieldBuilder,
  MetricConfigFactory,
  EChartsParamsFactory,
  SelectOptionFactory,
} from '../factories';
import { t } from '../utils/i18nHelper';

/**
 * Radar chart widget type implementation
 * Each metric becomes an axis on the radar with its aggregated value
 * Respects Single Responsibility Principle - only defines radar widget configuration
 */
export class RadarWidgetType extends AbstractChartWidgetType {
  protected readonly widgetType = 'radar' as const;
  protected get widgetLabel() {
    return t('widgets.types.radar');
  }
  protected get widgetDescription() {
    return t('widgets.types.radarDescription');
  }
  protected readonly widgetIcon = PresentationChartLineIcon;
  protected readonly widgetCategory: WidgetCategory = 'chart';
  protected readonly widgetComponent = RadarChartWidget as unknown as WidgetComponent;

  /**
   * Builds radar-specific metric styles
   * Uses builder pattern for consistent field creation
   */
  protected getChartSpecificMetricStyles(): Record<string, FieldSchema> {
    return {
      colors: WidgetFieldBuilder.colors(DEFAULT_CHART_COLORS),
      opacity: WidgetFieldBuilder.opacity(0.25),
    };
  }

  /**
   * Builds radar-specific widget parameters
   * Uses builder and spreads for ECharts integration
   */
  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      title: WidgetFieldBuilder.title(),
      titleAlign: WidgetFieldBuilder.titleAlign(),
      legend: WidgetFieldBuilder.legend(),
      legendPosition: WidgetFieldBuilder.legendPosition(),
      showPoints: WidgetFieldBuilder.showPoints(),
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
      ...EChartsParamsFactory.radarParams(
        SelectOptionFactory.createFromI18nKeys(
          ['polygon', 'circle'],
          'widgets.options.radarShapes',
        ),
      ),
    };
  }

  protected getChartSpecificParams(): Record<string, FieldSchema> {
    return {};
  }

  protected buildMetricsConfig(): Partial<IMetricsConfig> {
    return MetricConfigFactory.createMultipleMetricsConfig({
      minRequired: 3,
      description: 'widgets.datasets.radarMetricsDescription',
    });
  }

  protected buildBucketsConfig(): Partial<IBucketsConfig> | null {
    return null;
  }

  protected buildDataConfigOptions(): Partial<IWidgetDataConfig> {
    return {
      useMetricSection: true,
      useGlobalFilters: true,
      useBuckets: false,
      useGroupBy: true,
      allowMultipleMetrics: true,
    };
  }
}
