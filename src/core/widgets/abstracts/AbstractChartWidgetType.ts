import type { FieldSchema } from '@type/widget-form.types';
import { AbstractWidgetType } from './AbstractWidgetType';
import { COMMON_METRIC_STYLES, COMMON_WIDGET_PARAMS } from '../schemas/CommonSchemas';
import { ECHARTS_COMMON_PARAMS } from '../schemas/EChartsSchemas';

/**
 * Abstract class for ECharts-based chart widgets.
 * Provides common chart parameters and styling configuration.
 */
export abstract class AbstractChartWidgetType extends AbstractWidgetType {
  protected abstract getChartSpecificMetricStyles(): Record<string, FieldSchema>;
  protected abstract getChartSpecificParams(): Record<string, FieldSchema>;

  protected buildMetricStyles(): Record<string, FieldSchema> {
    return {
      ...COMMON_METRIC_STYLES,
      ...this.getChartSpecificMetricStyles(),
    };
  }

  protected buildWidgetParams(): Record<string, FieldSchema> {
    return {
      ...COMMON_WIDGET_PARAMS,
      ...ECHARTS_COMMON_PARAMS,
      ...this.getChartSpecificParams(),
    };
  }
}
