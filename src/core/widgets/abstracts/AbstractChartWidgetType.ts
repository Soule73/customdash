import type { FieldSchema } from '@type/widget-form.types';
import { AbstractWidgetType } from './AbstractWidgetType';
import { EChartsParamsFactory, SelectOptionFactory, FieldSchemaFactory } from '../factories';
import { LEGEND_POSITIONS, TITLE_ALIGNS } from '../constants';

/**
 * Abstract class for ECharts-based chart widgets.
 * Provides common chart parameters and styling configuration.
 */
export abstract class AbstractChartWidgetType extends AbstractWidgetType {
  protected abstract getChartSpecificMetricStyles(): Record<string, FieldSchema>;
  protected abstract getChartSpecificParams(): Record<string, FieldSchema>;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      ...FieldSchemaFactory.createMetricStyleFields(),
      ...this.getChartSpecificMetricStyles(),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      ...FieldSchemaFactory.createCommonWidgetFields({
        titleAlignOptions: SelectOptionFactory.createPositionOptions(TITLE_ALIGNS),
        legendPositionOptions: SelectOptionFactory.createPositionOptions(LEGEND_POSITIONS),
      }),
      ...EChartsParamsFactory.commonParams({
        animationEasingOptions: SelectOptionFactory.createFromI18nKeys(
          ['linear', 'cubicIn', 'cubicOut', 'cubicInOut', 'elasticOut', 'bounceOut'],
          'widgets.options.animationEasing',
        ),
        dataZoomOptions: SelectOptionFactory.createFromI18nKeys(
          ['inside', 'slider'],
          'widgets.options.dataZoomTypes',
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
      ...this.getChartSpecificParams(),
    };
  }
}
